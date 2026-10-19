import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const USER_KEY = 'user';
const EXPIRES_KEY = 'auth_expires_at';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // masa berlaku token: 24 jam
const SKEW_MS = 5 * 1000; // toleransi selisih jam client–server

const authContext = createContext({
    user: null,
    token: null,
    expiresAt: null,
    isAuthenticated: false,
    sessionExpired: false,
    register: () => { },
    login: () => { },
    logout: () => { },
});

const decodeJwt = (token) => {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64).split('').map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};

// Respons login dan register bentuknya bisa berbeda; cari token di beberapa tempat
const extractToken = (userData) =>
    userData?.token ?? userData?.access_token ?? userData?.data?.token ?? userData?.data?.access_token ?? null;

// Waktu kedaluwarsa (ms): dari klaim `exp` JWT; jika tidak ada, 24 jam sejak login
const computeExpiry = (userData) => {
    const exp = decodeJwt(extractToken(userData) ?? '')?.exp;
    return exp ? exp * 1000 : Date.now() + TOKEN_TTL_MS;
};

const isExpired = (expiresAt) => !expiresAt || Date.now() >= expiresAt - SKEW_MS;

const clearStorage = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
};

// Baca sesi tersimpan; sesi yang sudah kedaluwarsa atau rusak langsung dibuang
const readSession = () => {
    try {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return { user: null, expiresAt: null };

        const user = JSON.parse(raw);
        const expiresAt = Number(localStorage.getItem(EXPIRES_KEY)) || computeExpiry(user);

        if (isExpired(expiresAt)) {
            clearStorage();
            return { user: null, expiresAt: null, expired: true };
        }
        return { user, expiresAt };
    } catch {
        clearStorage();
        return { user: null, expiresAt: null };
    }
};

export default function UseAuthProvider({ children }) {
    const [session, setSession] = useState(() => readSession());
    const [sessionExpired, setSessionExpired] = useState(() => Boolean(session.expired));

    const { user, expiresAt } = session;

    const persist = useCallback((userData) => {
        const nextExpiresAt = computeExpiry(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem(EXPIRES_KEY, String(nextExpiresAt));
        setSession({ user: userData, expiresAt: nextExpiresAt });
        setSessionExpired(false);
    }, []);

    const register = useCallback((userData) => persist(userData), [persist]);
    const login = useCallback((userData) => persist(userData), [persist]);

    const logout = useCallback(() => {
        clearStorage();
        setSession({ user: null, expiresAt: null });
    }, []);

    // Dipanggil saat token terdeteksi kedaluwarsa / ditolak server (401)
    const expireSession = useCallback(() => {
        clearStorage();
        setSession({ user: null, expiresAt: null });
        setSessionExpired(true);
    }, []);

    // 1) Logout otomatis tepat saat token kedaluwarsa
    useEffect(() => {
        if (!user || !expiresAt) return undefined;

        const remaining = expiresAt - SKEW_MS - Date.now();
        if (remaining <= 0) {
            expireSession();
            return undefined;
        }
        const timer = setTimeout(expireSession, Math.min(remaining, 2 ** 31 - 1));
        return () => clearTimeout(timer);
    }, [user, expiresAt, expireSession]);

    // 2) Timer bisa tertahan saat laptop tidur / tab di background: cek ulang saat tab aktif lagi
    useEffect(() => {
        const check = () => {
            if (document.visibilityState === 'hidden') return;
            if (user && isExpired(expiresAt)) expireSession();
        };
        document.addEventListener('visibilitychange', check);
        window.addEventListener('focus', check);
        return () => {
            document.removeEventListener('visibilitychange', check);
            window.removeEventListener('focus', check);
        };
    }, [user, expiresAt, expireSession]);

    // 3) Sinkron antar tab: login/logout di satu tab berlaku di tab lain
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key !== null && e.key !== USER_KEY && e.key !== EXPIRES_KEY) return;
            setSession(readSession());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // 4) Server menolak token (401): useFetch cukup memanggil
    //    window.dispatchEvent(new Event('auth:unauthorized'))
    useEffect(() => {
        const onUnauthorized = () => expireSession();
        window.addEventListener('auth:unauthorized', onUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
    }, [expireSession]);

    const value = useMemo(
        () => ({
            user,
            token: extractToken(user),
            expiresAt,
            isAuthenticated: Boolean(user),
            sessionExpired,
            register,
            login,
            logout,
        }),
        [user, expiresAt, sessionExpired, register, login, logout]
    );

    return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);