import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Loading } from '../components/common/Loading';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import {
    Download,
    Smartphone,
    Apple,
    Calendar,
    HardDrive,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import type { DownloadPageInfo } from '../types';

export function DownloadPage() {
    const { token } = useParams<{ token: string }>();
    const [info, setInfo] = useState<DownloadPageInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            loadDownloadInfo();
        }
    }, [token]);

    const loadDownloadInfo = async () => {
        try {
            const data = await api.getDownloadPage(token!);
            setInfo(data);
        } catch (err) {
            setError('下载链接无效或已过期。');
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleDownload = () => {
        if (info) {
            window.location.href = info.download_url;
        }
    };

    const handleIOSInstall = () => {
        if (info?.itms_url) {
            window.location.href = info.itms_url;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loading text="加载中..." />
            </div>
        );
    }

    if (error || !info) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="card p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">链接无效</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const downloadUrl = `${window.location.origin}/d/${token}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-lg mx-auto">
                <div className="card p-8">
                    {/* App Icon & Name */}
                    <div className="text-center mb-8">
                        <div className={`w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center ${info.platform === 'android'
                                ? 'bg-gradient-to-br from-green-400 to-green-600'
                                : 'bg-gradient-to-br from-blue-400 to-blue-600'
                            }`}>
                            {info.app_icon ? (
                                <img
                                    src={info.app_icon}
                                    alt={info.app_name}
                                    className="w-20 h-20 rounded-2xl object-cover"
                                />
                            ) : (
                                info.platform === 'android'
                                    ? <Smartphone className="w-12 h-12 text-white" />
                                    : <Apple className="w-12 h-12 text-white" />
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">{info.app_name}</h1>
                        <p className="text-gray-500 text-sm">{info.bundle_id}</p>

                        <div className="flex items-center justify-center space-x-3 mt-3">
                            <span className={info.platform === 'android' ? 'badge-android' : 'badge-ios'}>
                                {info.platform === 'android' ? 'Android' : 'iOS'}
                            </span>
                            <span className="text-gray-500">v{info.version_name}</span>
                        </div>
                    </div>

                    {/* App Info */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center">
                            <HardDrive className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">大小</p>
                            <p className="font-medium text-gray-900">{formatFileSize(info.file_size)}</p>
                        </div>
                        <div className="text-center">
                            <Download className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">下载</p>
                            <p className="font-medium text-gray-900">{info.download_count} 次</p>
                        </div>
                        <div className="text-center">
                            <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">发布</p>
                            <p className="font-medium text-gray-900">
                                {format(new Date(info.created_at), 'MM-dd')}
                            </p>
                        </div>
                    </div>

                    {/* Force Update Warning */}
                    {info.force_update && (
                        <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-6">
                            <RefreshCw className="w-5 h-5 text-orange-600 flex-shrink-0" />
                            <p className="text-sm text-orange-700">
                                这是一个必须更新的版本，请安装以继续使用应用。
                            </p>
                        </div>
                    )}

                    {/* Release Notes */}
                    {info.release_notes && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">更新说明</h3>
                            <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                                {info.release_notes}
                            </p>
                        </div>
                    )}

                    {/* Download Button */}
                    {info.platform === 'ios' ? (
                        <button
                            onClick={handleIOSInstall}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            <Apple className="w-6 h-6 mr-2" />
                            安装到 iOS 设备
                        </button>
                    ) : (
                        <button
                            onClick={handleDownload}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            <Download className="w-6 h-6 mr-2" />
                            下载 APK
                        </button>
                    )}

                    {info.platform === 'ios' && (
                        <p className="text-center text-xs text-gray-500 mt-3">
                            点击后在弹出窗口中选择"安装"。您可能需要在设置中信任开发者证书。
                        </p>
                    )}

                    {/* QR Code */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500 mb-4">
                            扫码在手机上下载
                        </p>
                        <div className="flex justify-center">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <QRCodeSVG
                                    value={downloadUrl}
                                    size={150}
                                    level="M"
                                    includeMargin={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    由 <span className="font-medium">应用分发平台</span> 提供支持
                </p>
            </div>
        </div>
    );
}
