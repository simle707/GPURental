'use client'
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { signInWithGoogle, signOutUser as firebaseSignOut, auth } from '../services/firebase';
import { getRedirectResult, onAuthStateChanged, User } from 'firebase/auth';

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

    const syncBackend = useCallback(async (firebaseUser: User) => {
        try{
            const idToken = await firebaseUser.getIdToken();
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idToken,
                    userProfile: {
                        uid: firebaseUser.uid,
                        displayName: firebaseUser.displayName,
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL,
                    }
                }),
                credentials: 'include',
            });
            const data = await response.json();
            console.log("data: ", data);
            

            if (response.ok && data.user) {
                setUser(data.user);
                setIsLoggedIn(true);
                // localStorage.setItem('should_check_auth', 'true');
                return true;
            }
            return false;
        } catch (error) {
            console.error("Sync Error:", error);
            return false;
        }
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' }); 
            const userInfo = await res.json();
            
            if (res.ok && userInfo.isLoggedIn && userInfo.user) {
                setUser(userInfo.user);
                setIsLoggedIn(true);
                // localStorage.setItem('should_check_auth', 'true');
            } else {
                throw new Error("Not logged in");
            }
        } catch (err) {
            setUser(null);
            setIsLoggedIn(false);
            // localStorage.removeItem('should_check_auth');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {        
        const initAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
                const result = await getRedirectResult(auth); 
                console.log("手动检查重定向结果:", result);
                 
                if (result?.user) {
                    await syncBackend(result.user)
                }
            } catch (error) {
                console.error("Redirect Error:", error);
            }
            const shouldCheck = localStorage.getItem('should_check_auth');
            console.log("should_check_auth=", shouldCheck);
            
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                console.log("Firebase 状态变化:", firebaseUser ? "已登录" : "未登录");
                
                if (firebaseUser) {
                    console.log("auth");
                    
                    await checkAuth();
                } else {
                    setLoading(false);
                }
            });

            return unsubscribe;
        };

        const unsubPromise = initAuth();
        return () => { unsubPromise.then(unsub => unsub?.()); };
    }, [syncBackend]);

    const login = async () => {
        try {
            setLoading(true);
            const result = await signInWithGoogle();
            
            if (result?.user) {
                const success = await syncBackend(result.user);
                if (success) await checkAuth();
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut();
            await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
            setUser(null);
            setIsLoggedIn(false);
            // localStorage.removeItem('should_check_auth');
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
