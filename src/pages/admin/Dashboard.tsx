import { useEffect, useState } from 'react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Loading } from '../../components/common/Loading';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import {
    Users,
    Smartphone,
    Package,
    Download,
    Search,
    UserCheck,
    UserX,
    Shield,
    ShieldOff,
    Trash2,
    Eye,
    EyeOff,
} from 'lucide-react';
import type { AdminStats, AdminUser, AdminApp } from '../../types';

export function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [apps, setApps] = useState<AdminApp[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'apps'>('users');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const statsData = await api.getAdminStats();
            setStats(statsData);

            if (activeTab === 'users') {
                const usersData = await api.getAdminUsers(1, 50);
                setUsers(usersData.items);
            } else {
                const appsData = await api.getAdminApps(1, 50);
                setApps(appsData.items);
            }
        } catch (error) {
            toast.error('加载数据失败');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUserStatus = async (user: AdminUser) => {
        try {
            await api.updateUser(user.id, { is_active: !user.is_active });
            loadData();
            toast.success(user.is_active ? '用户已禁用' : '用户已启用');
        } catch (error) {
            toast.error('操作失败');
        }
    };

    const handleToggleAdmin = async (user: AdminUser) => {
        try {
            await api.updateUser(user.id, { is_admin: !user.is_admin });
            loadData();
            toast.success(user.is_admin ? '已取消管理员权限' : '已设为管理员');
        } catch (error) {
            toast.error('操作失败');
        }
    };

    const handleToggleAppPublic = async (app: AdminApp) => {
        try {
            await api.toggleAppPublic(app.id);
            loadData();
            toast.success(app.is_public ? '已设为私有' : '已设为公开');
        } catch (error) {
            toast.error('操作失败');
        }
    };

    const handleDeleteApp = async (app: AdminApp) => {
        if (!confirm(`确定要删除「${app.name}」吗？此操作不可撤销。`)) return;

        try {
            await api.adminDeleteApp(app.id);
            loadData();
            toast.success('应用已删除');
        } catch (error) {
            toast.error('删除失败');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.bundle_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.owner_username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">管理后台</h1>
                    <p className="text-gray-500 mt-1">管理用户和应用</p>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="card p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                                    <p className="text-sm text-gray-500">用户</p>
                                </div>
                            </div>
                        </div>
                        <div className="card p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_apps}</p>
                                    <p className="text-sm text-gray-500">应用</p>
                                </div>
                            </div>
                        </div>
                        <div className="card p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_versions}</p>
                                    <p className="text-sm text-gray-500">版本</p>
                                </div>
                            </div>
                        </div>
                        <div className="card p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <Download className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_downloads}</p>
                                    <p className="text-sm text-gray-500">下载</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'users'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            用户管理
                        </button>
                        <button
                            onClick={() => setActiveTab('apps')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'apps'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            应用管理
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10 w-64"
                        />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="py-12">
                        <Loading text="加载中..." />
                    </div>
                ) : activeTab === 'users' ? (
                    <div className="card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        用户
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        应用数
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        状态
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        角色
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{user.username}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.app_count}</td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {user.is_active ? '正常' : '已禁用'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${user.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {user.is_admin ? '管理员' : '普通用户'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleToggleUserStatus(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_active
                                                        ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                                        : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                                                        }`}
                                                    title={user.is_active ? '禁用用户' : '启用用户'}
                                                >
                                                    {user.is_active ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleToggleAdmin(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_admin
                                                        ? 'text-purple-600 hover:bg-purple-50'
                                                        : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                                                        }`}
                                                    title={user.is_admin ? '取消管理员' : '设为管理员'}
                                                >
                                                    {user.is_admin ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        应用
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        所有者
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        版本数
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        下载量
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        状态
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.platform === 'android' ? 'bg-green-100' : 'bg-blue-100'
                                                    }`}>
                                                    {app.platform === 'android'
                                                        ? <Smartphone className="w-5 h-5 text-green-600" />
                                                        : <Smartphone className="w-5 h-5 text-blue-600" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{app.name}</p>
                                                    <p className="text-sm text-gray-500">{app.bundle_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{app.owner_username}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.version_count}</td>
                                        <td className="px-6 py-4 text-gray-600">{app.total_downloads}</td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${app.is_public ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {app.is_public ? '公开' : '私有'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleToggleAppPublic(app)}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title={app.is_public ? '设为私有' : '设为公开'}
                                                >
                                                    {app.is_public ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteApp(app)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="删除应用"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
