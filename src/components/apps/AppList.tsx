import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AppCard } from './AppCard';
import { Loading } from '../common/Loading';
import { Plus, Search, Smartphone, Apple } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { App } from '../../types';

export function AppList() {
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [platform, setPlatform] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadApps();
    }, [platform]);

    const loadApps = async () => {
        setLoading(true);
        try {
            const response = await api.getApps(1, 100, platform || undefined);
            setApps(response.items);
        } catch (error) {
            console.error('Failed to load apps:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.bundle_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">我的应用</h2>
                    <p className="text-gray-500 mt-1">管理您的应用项目</p>
                </div>
                <Link to="/upload" className="btn-primary">
                    <Plus className="w-5 h-5 mr-2" />
                    新建应用
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜索应用..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10"
                    />
                </div>

                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <button
                        onClick={() => setPlatform('')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${platform === ''
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        全部
                    </button>
                    <button
                        onClick={() => setPlatform('android')}
                        className={`px-4 py-2 text-sm font-medium flex items-center transition-colors border-l border-gray-300 ${platform === 'android'
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Smartphone className="w-4 h-4 mr-1" />
                        Android
                    </button>
                    <button
                        onClick={() => setPlatform('ios')}
                        className={`px-4 py-2 text-sm font-medium flex items-center transition-colors border-l border-gray-300 ${platform === 'ios'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Apple className="w-4 h-4 mr-1" />
                        iOS
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="py-12">
                    <Loading text="加载中..." />
                </div>
            ) : filteredApps.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无应用</h3>
                    <p className="text-gray-500 mb-6">上传您的第一个应用开始使用</p>
                    <Link to="/upload" className="btn-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        上传应用
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredApps.map((app) => (
                        <AppCard key={app.id} app={app} />
                    ))}
                </div>
            )}
        </div>
    );
}
