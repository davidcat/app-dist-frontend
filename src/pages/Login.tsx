import { LoginForm } from '../components/auth/LoginForm';
import { Smartphone } from 'lucide-react';

export function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center">
                            <Smartphone className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-center text-gray-900 mb-6">应用分发平台</h1>
                    <LoginForm />
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                    个人使用 · 仅限内部
                </p>
            </div>
        </div>
    );
}
