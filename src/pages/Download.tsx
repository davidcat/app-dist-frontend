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
            setError('下载链接无效或已过期');
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
                <div className="card p-6 max-w-sm w-full text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h1 className="text-lg font-bold text-gray-900 mb-1">链接无效</h1>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    const downloadUrl = `${window.location.origin}/d/${token}`;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-sm mx-auto">
                <div className="card p-6">
                    {/* App Icon & Name */}
                    <div className="text-center mb-6">
                        <div className={`w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center ${info.platform === 'android'
                                ? 'bg-gradient-to-br from-green-400 to-green-600'
                                : 'bg-gradient-to-br from-blue-400 to-blue-600'
                            }`}>
                            {info.app_icon ? (
                                <img
                                    src={info.app_icon}
                                    alt={info.app_name}
                                    className="w-16 h-16 rounded-xl object-cover"
                                />
                            ) : (
                                info.platform === 'android'
                                    ? <Smartphone className="w-10 h-10 text-white" />
                                    : <Apple className="w-10 h-10 text-white" />
                            )}
                        </div>

                        <h1 className="text-xl font-bold text-gray-900">{info.app_name}</h1>
                        <p className="text-xs text-gray-400 mt-1">{info.bundle_id}</p>

                        <div className="flex items-center justify-center space-x-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${info.platform === 'android' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {info.platform === 'android' ? 'Android' : 'iOS'}
                            </span>
                            <span className="text-sm text-gray-500">v{info.version_name}</span>
                        </div>
                    </div>

                    {/* App Info */}
                    <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                        <div>
                            <HardDrive className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">大小</p>
                            <p className="text-sm font-medium text-gray-900">{formatFileSize(info.file_size)}</p>
                        </div>
                        <div>
                            <Download className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">下载</p>
                            <p className="text-sm font-medium text-gray-900">{info.download_count}</p>
                        </div>
                        <div>
                            <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">发布</p>
                            <p className="text-sm font-medium text-gray-900">
                                {format(new Date(info.created_at), 'MM-dd')}
                            </p>
                        </div>
                    </div>

                    {/* Force Update Warning */}
                    {info.force_update && (
                        <div className="flex items-center space-x-2 p-2 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                            <RefreshCw className="w-4 h-4 text-orange-600 flex-shrink-0" />
                            <p className="text-xs text-orange-700">必须更新</p>
                        </div>
                    )}

                    {/* Release Notes */}
                    {info.release_notes && (
                        <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">更新说明</p>
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                                {info.release_notes}
                            </p>
                        </div>
                    )}

                    {/* Download Button */}
                    {info.platform === 'ios' ? (
                        <button
                            onClick={handleIOSInstall}
                            className="btn-primary w-full py-3"
                        >
                            <Apple className="w-5 h-5 mr-2" />
                            安装
                        </button>
                    ) : (
                        <button
                            onClick={handleDownload}
                            className="btn-primary w-full py-3"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            下载 APK
                        </button>
                    )}

                    {info.platform === 'ios' && (
                        <p className="text-center text-xs text-gray-400 mt-2">
                            点击安装后需在设置中信任证书
                        </p>
                    )}

                    {/* QR Code */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-400 mb-3">扫码下载</p>
                        <div className="flex justify-center">
                            <QRCodeSVG
                                value={downloadUrl}
                                size={120}
                                level="M"
                                includeMargin={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
