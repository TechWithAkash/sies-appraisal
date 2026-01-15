'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '@/lib/data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored session
        const stored = localStorage.getItem('appraisal_user');
        if (stored) {
            try {
                const userData = JSON.parse(stored);
                setUser(userData);
            } catch (e) {
                localStorage.removeItem('appraisal_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Find user by email
        const foundUser = users.find(u => u.email === email);

        if (!foundUser) {
            throw new Error('User not found');
        }

        if (foundUser.password !== password) {
            throw new Error('Invalid password');
        }

        // Create session (remove password from stored data)
        const { password: _, ...userData } = foundUser;
        setUser(userData);
        localStorage.setItem('appraisal_user', JSON.stringify(userData));

        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('appraisal_user');
    };

    const hasRole = (roles) => {
        if (!user) return false;
        if (typeof roles === 'string') {
            return user.role === roles;
        }
        return roles.includes(user.role);
    };

    const canAccessDepartment = (department) => {
        if (!user) return false;
        if (['ADMIN', 'PRINCIPAL', 'IQAC'].includes(user.role)) return true;
        if (user.role === 'HOD') return user.department === department;
        return false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            hasRole,
            canAccessDepartment,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
