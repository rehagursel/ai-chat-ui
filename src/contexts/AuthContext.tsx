import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/auth";

interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | null;
    token: string | null;
    login: (username: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        if (storedToken && storedUserId) {
            setToken(storedToken);
            setUserId(storedUserId);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (username: string) => {
        try {
            const { token, userId } = await auth.login(username);
            
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId); 
            
            setToken(token);
            setUserId(userId);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setToken(null);
        setUserId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}; 