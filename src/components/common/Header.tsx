import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Smartphone, LogOut, User, Shield, Menu, X, Upload } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!isAuthenticated) return null;

    return (
        <header className="sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">应用分发</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <Link
                            to="/dashboard"
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors"
                        >
                            控制台
                        </Link>
                        <Link
                            to="/upload"
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center"
                        >
                            <Upload className="w-4 h-4 mr-1" />
                            上传
                        </Link>
                        {user?.is_admin && (
                            <Link
                                to="/admin"
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center"
                            >
                                <Shield className="w-4 h-4 mr-1" />
                                管理
                            </Link>
                        )}
                        <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-200">
                            <span className="text-sm text-gray-500">{user?.username}</span>
                            <button
                                onClick={logout}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                title="退出登录"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-3 border-t border-gray-100 animate-fade-in">
                        <nav className="flex flex-col space-y-2">
                            <Link
                                to="/dashboard"
                                className="py-2 text-gray-600 hover:text-primary-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                控制台
                            </Link>
                            <Link
                                to="/upload"
                                className="py-2 text-gray-600 hover:text-primary-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                上传应用
                            </Link>
                            {user?.is_admin && (
                                <Link
                                    to="/admin"
                                    className="py-2 text-gray-600 hover:text-primary-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    管理后台
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="py-2 text-left text-red-600"
                            >
                                退出登录
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
