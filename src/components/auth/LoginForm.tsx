import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            toast.success('登录成功');
            navigate('/dashboard');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '登录失败，请检查邮箱和密码';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input pl-9 py-2"
                        placeholder="输入邮箱"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    密码
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input pl-9 py-2"
                        placeholder="输入密码"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        登录中...
                    </>
                ) : (
                    '登录'
                )}
            </button>

            <p className="text-center text-sm text-gray-500">
                没有账户？{' '}
                <Link to="/register" className="text-primary-600 hover:underline">
                    注册
                </Link>
            </p>
        </form>
    );
}
