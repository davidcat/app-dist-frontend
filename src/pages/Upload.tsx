import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import {
    Upload as UploadIcon,
    Smartphone,
    Apple,
    Loader2,
    Check,
    X,
    Package,
} from 'lucide-react';

interface ParsedPackageInfo {
    app_name: string;
    bundle_id: string;
    version_name: string;
    version_code: string;
    platform: 'android' | 'ios';
}

export function Upload() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'upload' | 'uploading' | 'done'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [parsing, setParsing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [packageInfo, setPackageInfo] = useState<ParsedPackageInfo | null>(null);

    // 只需要用户填写更新说明
    const [releaseNotes, setReleaseNotes] = useState('');
    const [createdApp, setCreatedApp] = useState<{ id: number; name: string } | null>(null);

    const parsePackage = async (selectedFile: File) => {
        setParsing(true);
        setParseError(null);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const info = await api.parsePackage(formData);
            setPackageInfo(info);
        } catch (err: unknown) {
            // 显示后台错误信息
            let errorMessage = '解析安装包失败';
            if (err && typeof err === 'object') {
                const axiosError = err as { response?: { data?: { detail?: string } }; message?: string };
                if (axiosError.response?.data?.detail) {
                    errorMessage = axiosError.response.data.detail;
                } else if (axiosError.message) {
                    errorMessage = axiosError.message;
                }
            }
            setParseError(errorMessage);

            // 解析失败时使用文件名作为应用名
            const isIos = selectedFile.name.endsWith('.ipa');
            setPackageInfo({
                app_name: selectedFile.name.replace(/\.(apk|ipa)$/i, ''),
                bundle_id: 'com.unknown.app',
                version_name: '1.0.0',
                version_code: '1',
                platform: isIos ? 'ios' : 'android',
            });
        } finally {
            setParsing(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const f = acceptedFiles[0];
            setFile(f);
            parsePackage(f);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.android.package-archive': ['.apk'],
            'application/octet-stream': ['.ipa'],
        },
        maxFiles: 1,
        maxSize: 500 * 1024 * 1024, // 500MB
    });

    const handleUpload = async () => {
        if (!file || !packageInfo) return;

        setStep('uploading');

        try {
            // 1. 先创建或获取应用
            let appId: number;
            try {
                const app = await api.createApp({
                    bundle_id: packageInfo.bundle_id,
                    name: packageInfo.app_name,
                    platform: packageInfo.platform,
                    is_public: true,
                });
                appId = app.id;
                setCreatedApp(app);
            } catch {
                // 如果应用已存在，获取现有应用
                const apps = await api.getApps(1, 100);
                const existingApp = apps.items.find(a => a.bundle_id === packageInfo.bundle_id);
                if (existingApp) {
                    appId = existingApp.id;
                    setCreatedApp(existingApp);
                } else {
                    throw new Error('创建应用失败');
                }
            }

            // 2. 上传版本
            await api.uploadVersion(
                appId,
                file,
                {
                    version_code: packageInfo.version_code,
                    version_name: packageInfo.version_name,
                    channel: 'default',
                    release_notes: releaseNotes || undefined,
                    force_update: false,
                },
                (progress) => setUploadProgress(progress)
            );

            setStep('done');
            toast.success('上传成功！');
        } catch (error: unknown) {
            setStep('upload');
            // 提取后端详细错误信息
            let message = '上传失败，请重试';
            if (error && typeof error === 'object') {
                const axiosError = error as { response?: { data?: { detail?: string } }; message?: string };
                if (axiosError.response?.data?.detail) {
                    message = axiosError.response.data.detail;
                } else if (axiosError.message) {
                    message = axiosError.message;
                }
            }
            toast.error(message);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">上传应用</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        拖拽 APK 或 IPA 文件，自动识别应用信息
                    </p>
                </div>

                {/* Upload Step */}
                {step === 'upload' && (
                    <div className="space-y-6">
                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                                ? 'border-primary-500 bg-primary-50'
                                : file
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-primary-400 bg-white'
                                }`}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <div className="flex items-center justify-center space-x-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${packageInfo?.platform === 'ios' ? 'bg-blue-100' : 'bg-green-100'
                                        }`}>
                                        {packageInfo?.platform === 'ios'
                                            ? <Apple className="w-6 h-6 text-blue-600" />
                                            : <Smartphone className="w-6 h-6 text-green-600" />
                                        }
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setPackageInfo(null);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">
                                        {isDragActive ? '放开以上传' : '拖拽安装包到此处'}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        支持 APK 和 IPA 文件，最大 500MB
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Parsing indicator */}
                        {parsing && (
                            <div className="flex items-center justify-center space-x-2 text-gray-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">正在解析安装包...</span>
                            </div>
                        )}

                        {/* Parsed Info */}
                        {packageInfo && !parsing && (
                            <div className="card p-4 space-y-3">
                                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Package className="w-4 h-4" />
                                    <span>识别信息</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-500">应用名称：</span>
                                        <span className="text-gray-900 ml-1">{packageInfo.app_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">平台：</span>
                                        <span className={`ml-1 ${packageInfo.platform === 'ios' ? 'text-blue-600' : 'text-green-600'}`}>
                                            {packageInfo.platform === 'ios' ? 'iOS' : 'Android'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">包名：</span>
                                        <span className="text-gray-900 ml-1 text-xs">{packageInfo.bundle_id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">版本：</span>
                                        <span className="text-gray-900 ml-1">v{packageInfo.version_name}</span>
                                    </div>
                                </div>
                                {parseError && (
                                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-xs">
                                        ⚠️ {parseError}（使用默认值，可能需要手动修正）
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Release Notes */}
                        {file && packageInfo && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    更新说明 <span className="text-gray-400 font-normal">(可选)</span>
                                </label>
                                <textarea
                                    value={releaseNotes}
                                    onChange={(e) => setReleaseNotes(e.target.value)}
                                    className="input"
                                    rows={3}
                                    placeholder="这个版本有什么新功能？"
                                />
                            </div>
                        )}

                        {/* Upload Button */}
                        {file && packageInfo && (
                            <button
                                onClick={handleUpload}
                                className="btn-primary w-full py-3"
                            >
                                <UploadIcon className="w-5 h-5 mr-2" />
                                上传
                            </button>
                        )}
                    </div>
                )}

                {/* Uploading Progress */}
                {step === 'uploading' && (
                    <div className="card p-8 text-center">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-700 font-medium mb-4">上传中...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                                className="gradient-bg h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500">{uploadProgress}%</p>
                    </div>
                )}

                {/* Done */}
                {step === 'done' && (
                    <div className="card p-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-7 h-7 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">上传成功</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            应用已上传，可以开始分发了
                        </p>
                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={() => navigate(`/apps/${createdApp?.id}`)}
                                className="btn-primary"
                            >
                                查看应用
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn-secondary"
                            >
                                返回
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
