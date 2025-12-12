import { LoginForm } from '../components/auth/LoginForm';
import { Header } from '../components/common/Header';
import { Smartphone } from 'lucide-react';

export function Login() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="card p-8">
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center">
                                <Smartphone className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
