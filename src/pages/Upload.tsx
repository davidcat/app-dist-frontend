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
    FileUp,
    Loader2,
    Check,
    X,
} from 'lucide-react';

export function Upload() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'app' | 'file' | 'uploading' | 'done'>('app');
    const [platform, setPlatform] = useState<'android' | 'ios'>('android');
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // App form
    const [bundleId, setBundleId] = useState('');
    const [appName, setAppName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    // Version form
    const [versionCode, setVersionCode] = useState('');
    const [versionName, setVersionName] = useState('');
    const [channel, setChannel] = useState('default');
    const [releaseNotes, setReleaseNotes] = useState('');
    const [forceUpdate, setForceUpdate] = useState(false);

    const [createdApp, setCreatedApp] = useState<{ id: number; name: string } | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const f = acceptedFiles[0];
            setFile(f);

            // Auto-detect platform
            if (f.name.endsWith('.apk')) {
                setPlatform('android');
            } else if (f.name.endsWith('.ipa')) {
                setPlatform('ios');
            }
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

    const handleCreateApp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const app = await api.createApp({
                bundle_id: bundleId,
                name: appName,
                description: description || undefined,
                platform,
                is_public: isPublic,
            });

            setCreatedApp(app);
            setStep('file');
            toast.success('应用创建成功！');
        } catch (error) {
            toast.error('创建失败，包名可能已存在。');
        }
    };

    const handleUpload = async () => {
        if (!file || !createdApp) return;

        setStep('uploading');

        try {
            await api.uploadVersion(
                createdApp.id,
                file,
                {
                    version_code: versionCode,
                    version_name: versionName,
                    channel,
                    release_notes: releaseNotes || undefined,
                    force_update: forceUpdate,
                },
                (progress) => setUploadProgress(progress)
            );

            setStep('done');
            toast.success('版本上传成功！');
        } catch (error) {
            setStep('file');
            toast.error('上传失败，请重试。');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">上传应用</h1>
                    <p className="text-gray-500 mt-2">
                        创建新应用并上传第一个版本
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center mb-8">
                    {['应用信息', '上传文件', '完成'].map((label, index) => (
                        <div key={label} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index === 0 && step === 'app'
                                        ? 'bg-primary-600 text-white'
                                        : index === 1 && (step === 'file' || step === 'uploading')
                                            ? 'bg-primary-600 text-white'
                                            : index === 2 && step === 'done'
                                                ? 'bg-green-600 text-white'
                                                : (index === 0 && step !== 'app') || (index === 1 && step === 'done')
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {((index === 0 && step !== 'app') || (index === 1 && step === 'done')) ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className={`ml-2 text-sm ${index === 2 ? '' : 'mr-4'} ${(index === 0 && step === 'app') ||
                                    (index === 1 && (step === 'file' || step === 'uploading')) ||
                                    (index === 2 && step === 'done')
                                    ? 'text-gray-900 font-medium'
                                    : 'text-gray-500'
                                }`}>
                                {label}
                            </span>
                            {index < 2 && (
                                <div className="w-12 h-px bg-gray-300 mx-2"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: App Info */}
                {step === 'app' && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">应用信息</h2>

                        {/* Platform Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                平台
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPlatform('android')}
                                    className={`p-4 rounded-xl border-2 transition-all ${platform === 'android'
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Smartphone className={`w-8 h-8 mx-auto mb-2 ${platform === 'android' ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                    <span className={`font-medium ${platform === 'android' ? 'text-green-700' : 'text-gray-600'
                                        }`}>Android</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPlatform('ios')}
                                    className={`p-4 rounded-xl border-2 transition-all ${platform === 'ios'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Apple className={`w-8 h-8 mx-auto mb-2 ${platform === 'ios' ? 'text-blue-600' : 'text-gray-400'
                                        }`} />
                                    <span className={`font-medium ${platform === 'ios' ? 'text-blue-700' : 'text-gray-600'
                                        }`}>iOS</span>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateApp} className="space-y-5">
                            <div>
                                <label htmlFor="bundleId" className="block text-sm font-medium text-gray-700 mb-1">
                                    包名 (Bundle ID) *
                                </label>
                                <input
                                    id="bundleId"
                                    type="text"
                                    value={bundleId}
                                    onChange={(e) => setBundleId(e.target.value)}
                                    className="input"
                                    placeholder="com.example.myapp"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="appName" className="block text-sm font-medium text-gray-700 mb-1">
                                    应用名称 *
                                </label>
                                <input
                                    id="appName"
                                    type="text"
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    className="input"
                                    placeholder="我的应用"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    应用描述
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input"
                                    rows={3}
                                    placeholder="简单介绍一下您的应用"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="isPublic"
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                                    公开应用 (任何人可通过链接下载)
                                </label>
                            </div>

                            <button type="submit" className="btn-primary w-full py-3">
                                下一步
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: File Upload */}
                {(step === 'file' || step === 'uploading') && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            上传 {platform === 'android' ? 'APK' : 'IPA'} 文件
                        </h2>

                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                                    ? 'border-primary-500 bg-primary-50'
                                    : file
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-300 hover:border-primary-400'
                                }`}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <FileUp className="w-8 h-8 text-green-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium">
                                        {isDragActive
                                            ? '放开以上传文件'
                                            : `拖拽 ${platform === 'android' ? 'APK' : 'IPA'} 文件到此处`}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        或点击选择文件 (最大 500MB)
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Version Info */}
                        {file && step === 'file' && (
                            <div className="mt-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            版本号 *
                                        </label>
                                        <input
                                            type="text"
                                            value={versionName}
                                            onChange={(e) => setVersionName(e.target.value)}
                                            className="input"
                                            placeholder="1.0.0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            构建号 *
                                        </label>
                                        <input
                                            type="text"
                                            value={versionCode}
                                            onChange={(e) => setVersionCode(e.target.value)}
                                            className="input"
                                            placeholder="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        渠道
                                    </label>
                                    <input
                                        type="text"
                                        value={channel}
                                        onChange={(e) => setChannel(e.target.value)}
                                        className="input"
                                        placeholder="default"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        更新说明
                                    </label>
                                    <textarea
                                        value={releaseNotes}
                                        onChange={(e) => setReleaseNotes(e.target.value)}
                                        className="input"
                                        rows={3}
                                        placeholder="这个版本有什么新功能？"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="forceUpdate"
                                        type="checkbox"
                                        checked={forceUpdate}
                                        onChange={(e) => setForceUpdate(e.target.checked)}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="forceUpdate" className="ml-2 text-sm text-gray-700">
                                        强制更新 (用户必须更新才能使用)
                                    </label>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={!versionName || !versionCode}
                                    className="btn-primary w-full py-3"
                                >
                                    上传版本
                                </button>
                            </div>
                        )}

                        {/* Uploading Progress */}
                        {step === 'uploading' && (
                            <div className="mt-6">
                                <div className="flex items-center justify-center space-x-3 mb-4">
                                    <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                                    <span className="text-gray-700 font-medium">上传中...</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="gradient-bg h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    已完成 {uploadProgress}%
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Done */}
                {step === 'done' && (
                    <div className="card p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">上传完成！</h2>
                        <p className="text-gray-600 mb-6">
                            您的应用已上传成功，可以开始分发了。
                        </p>
                        <div className="flex justify-center space-x-4">
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
                                返回控制台
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
