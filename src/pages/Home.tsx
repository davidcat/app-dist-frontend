import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/common/Loading';

export function Home() {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            // 已登录跳转到控制台，未登录跳转到登录页
            if (isAuthenticated) {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [isAuthenticated, loading, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loading text="加载中..." />
        </div>
    );
}
