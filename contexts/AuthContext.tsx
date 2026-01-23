'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithGoogle, signOutUser as firebaseSignOut } from '../services/firebase';

interface AuthContextType {
    user: any;
    isLoggedIn: boolean;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' }); 
            const userInfo = await res.json();
            
            if (res.ok && userInfo.isLoggedIn && userInfo.user) {
                setUser({
                    uid: userInfo.user.uid,
                    displayName: userInfo.user.displayName,
                    email: userInfo.user.email,
                    photoURL: userInfo.user.photoURL,
                })
                setIsLoggedIn(true);
                localStorage.setItem('should_check_auth', 'true');
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        } catch (err) {
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('should_check_auth');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const shouldCheck = localStorage.getItem('should_check_auth');        
        
        if (shouldCheck === 'true') {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async () => {
        try {
            const userInfo = await signInWithGoogle();
            if (!userInfo.googleIdToken) throw new Error("Failed to get Google ID Token");
            
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idToken: userInfo.googleIdToken,
                    userProfile: {
                        uid: userInfo.user.uid,
                        displayName: userInfo.user.displayName,
                        email: userInfo.user.email,
                        photoURL: userInfo.user.photoURL,
                    }
                }),
                credentials: 'include',
            });

            if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Invalid server response")
            if (!response.ok) throw new Error("Backend auth failed");

            localStorage.setItem('should_check_auth', 'true');
            setUser({
                uid: userInfo.user.uid,
                displayName: userInfo.user.displayName,
                email: userInfo.user.email,
                photoURL: userInfo.user.photoURL,
            })
            setIsLoggedIn(true);

        } catch (error) {
            localStorage.removeItem('should_check_auth');
            throw error;
        } finally {
            setLoading(false)
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut();
        } finally {
            setUser(null);
            setIsLoggedIn(false);
            window.location.reload();
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

