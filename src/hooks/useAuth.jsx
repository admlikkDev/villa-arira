import { createContext, useContext } from "react";
import { useState } from "react";

const authContext = createContext({
    user: null,
    register: () => { },
    login: () => { },
    logout: () => { },
})

export default function UseAuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    })

    const register = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
    }

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <authContext.Provider value={{ user, register, login, logout }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext(authContext) 