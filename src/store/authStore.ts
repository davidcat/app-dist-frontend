import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
    token: string | null;
    user: User | null;
    setToken: (token: string) => void;
    setAuth: (token: string, user: User) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setToken: (token) =>
                set({
                    token,
                }),
            setAuth: (token, user) =>
                set({
                    token,
                    user,
                }),
            setUser: (user) =>
                set({
                    user,
                }),
            logout: () =>
                set({
                    token: null,
                    user: null,
                }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }),
        }
    )
);

// Helper selector to check if authenticated
export const selectIsAuthenticated = (state: AuthState) => !!state.token;
