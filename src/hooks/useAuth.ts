import { useEffect, useState } from 'react';
import { useAuthStore, selectIsAuthenticated } from '../store/authStore';
import { api } from '../services/api';

export function useAuth() {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const setAuth = useAuthStore((state) => state.setAuth);
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token && !user) {
                try {
                    const userData = await api.getMe();
                    setUser(userData);
                } catch {
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token, user, setUser, logout]);

    const login = async (email: string, password: string) => {
        const authResponse = await api.login({ email, password });
        // 先设置 token，再获取用户信息
        useAuthStore.getState().setToken(authResponse.access_token);
        const userData = await api.getMe();
        setAuth(authResponse.access_token, userData);
        return userData;
    };

    const register = async (email: string, username: string, password: string) => {
        await api.register({ email, username, password });
        return login(email, password);
    };

    return {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    };
}
