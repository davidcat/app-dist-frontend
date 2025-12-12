import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Smartphone, LogOut, User, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            应用分发
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    控制台
                                </Link>
                                <Link
                                    to="/upload"
                                    className="btn-primary text-sm"
                                >
                                    上传应用
                                </Link>
                                {user?.is_admin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
                                    >
                                        <Shield className="w-4 h-4" />
                                        <span>管理</span>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                                    <div className="flex items-center space-x-2 text-gray-700">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm font-medium">{user?.username}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                        title="退出登录"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    登录
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    免费注册
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                        <nav className="flex flex-col space-y-3">
                            {isAuthenticated ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="py-2 text-gray-600 hover:text-primary-600"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        登录
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="py-2 text-gray-600 hover:text-primary-600"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        注册
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
