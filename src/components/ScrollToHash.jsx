import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Render di dalam PublicLayout (sekali saja).
// - Pindah halaman tanpa hash  -> scroll ke atas
// - Pindah halaman dengan hash -> scroll ke elemen tujuan (menunggu elemen muncul bila data masih dimuat)
export default function ScrollToHash() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0 });
            return undefined;
        }

        const id = decodeURIComponent(hash.slice(1));
        let tries = 0;
        const timer = setInterval(() => {
            const el = document.getElementById(id);
            tries += 1;
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                clearInterval(timer);
            } else if (tries > 30) {
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [pathname, hash]);

    return null;
}