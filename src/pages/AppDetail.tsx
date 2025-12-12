import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { VersionList } from '../components/apps/VersionList';
import { Loading } from '../components/common/Loading';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Smartphone,
    Apple,
    Upload,
    Trash2,
    Copy,
} from 'lucide-react';
import type { App, Version } from '../types';

export function AppDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [app, setApp] = useState<App | null>(null);
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadApp();
        }
    }, [id]);

    const loadApp = async () => {
        try {
            const [appData, versionsData] = await Promise.all([
                api.getApp(Number(id)),
                api.getVersions(Number(id)),
            ]);
            setApp(appData);
            setVersions(versionsData.items);
        } catch (error) {
            toast.error('加载应用失败');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (version: Version) => {
        try {
            await api.togglePublish(version.id);
            loadApp();
            toast.success(version.is_published ? '已下架' : '已上架');
        } catch (error) {
            toast.error('操作失败');
        }
    };

    const handleDeleteVersion = async (version: Version) => {
        if (!confirm('确定要删除这个版本吗？')) return;

        try {
            await api.deleteVersion(version.id);
            loadApp();
            toast.success('版本已删除');
        } catch (error) {
            toast.error('删除失败');
        }
    };

    const handleDeleteApp = async () => {
        if (!confirm('确定要删除这个应用及其所有版本吗？此操作不可撤销。')) {
            return;
        }

        try {
            await api.deleteApp(Number(id));
            toast.success('应用已删除');
            navigate('/dashboard');
        } catch (error) {
            toast.error('删除失败');
        }
    };

    const copyLatestLink = () => {
        if (versions.length > 0) {
            const latestVersion = versions[0];
            const downloadUrl = `${window.location.origin}/d/${latestVersion.download_token}`;
            navigator.clipboard.writeText(downloadUrl);
            toast.success('下载链接已复制！');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="加载中..." />
                </div>
            </div>
        );
    }

    if (!app) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Back link */}
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    返回控制台
                </Link>

                {/* App Header */}
                <div className="card p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${app.platform === 'android'
                                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                                    : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                }`}>
                                {app.icon_url ? (
                                    <img
                                        src={app.icon_url}
                                        alt={app.name}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                ) : (
                                    app.platform === 'android'
                                        ? <Smartphone className="w-10 h-10 text-white" />
                                        : <Apple className="w-10 h-10 text-white" />
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
                                <p className="text-gray-500">{app.bundle_id}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                    <span className={app.platform === 'android' ? 'badge-android' : 'badge-ios'}>
                                        {app.platform === 'android' ? 'Android' : 'iOS'}
                                    </span>
                                    <span className={`badge ${app.is_public ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {app.is_public ? '公开' : '私有'}
                                    </span>
                                </div>
                                {app.description && (
                                    <p className="text-gray-600 mt-3">{app.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={copyLatestLink}
                                disabled={versions.length === 0}
                                className="btn-secondary text-sm"
                            >
                                <Copy className="w-4 h-4 mr-1" />
                                复制链接
                            </button>
                            <button
                                onClick={handleDeleteApp}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="删除应用"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Versions Section */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        版本列表 ({versions.length})
                    </h2>
                    <Link
                        to={`/apps/${app.id}/upload`}
                        state={{ app }}
                        className="btn-primary text-sm"
                    >
                        <Upload className="w-4 h-4 mr-1" />
                        上传新版本
                    </Link>
                </div>

                <VersionList
                    versions={versions}
                    onTogglePublish={handleTogglePublish}
                    onDelete={handleDeleteVersion}
                />
            </main>

            <Footer />
        </div>
    );
}
