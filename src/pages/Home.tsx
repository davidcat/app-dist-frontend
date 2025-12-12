import { Link } from 'react-router-dom';
import {
    Upload,
    Smartphone,
    Download,
    Shield,
    Zap,
    Globe,
    ArrowRight,
    Check
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export function Home() {
    const features = [
        {
            icon: Upload,
            title: '便捷上传',
            description: '拖拽上传 APK 或 IPA 文件，一键完成分发。',
        },
        {
            icon: Download,
            title: '即时分发',
            description: '上传后立即生成下载链接和二维码。',
        },
        {
            icon: Smartphone,
            title: 'iOS OTA 支持',
            description: '自动生成 plist，一键安装到 iOS 设备。',
        },
        {
            icon: Shield,
            title: '安全可控',
            description: '支持公开或私有分发，完全掌控访问权限。',
        },
        {
            icon: Zap,
            title: '极速下载',
            description: '基于现代云架构，保证高速稳定下载。',
        },
        {
            icon: Globe,
            title: '完全免费',
            description: '开源免费，可部署在自己的服务器上。',
        },
    ];

    const benefits = [
        '无需应用商店审核',
        '支持最大 500MB 文件上传',
        '下载量统计分析',
        '版本管理和历史记录',
        '强制更新提醒功能',
        '二维码扫码下载',
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg opacity-5"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            轻松分发您的应用
                            <span className="block mt-2 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                无需应用商店
                            </span>
                        </h1>

                        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                            免费、开源的 App 分发平台，支持 Android 和 iOS 应用上传、管理和分发。
                            无需等待审核，即刻分享给用户。
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="btn-primary px-8 py-4 text-lg"
                            >
                                免费开始使用
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="btn-secondary px-8 py-4 text-lg"
                            >
                                登录
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-2" />
                                完全免费开源
                            </div>
                            <div className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-2" />
                                无需信用卡
                            </div>
                            <div className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-2" />
                                可私有化部署
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            功能齐全
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            为开发者打造的完整 App 分发解决方案
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card p-6 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                为什么选择我们？
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                跳过应用商店审核流程，直接将应用分发给用户。
                                非常适合内测分发、企业应用分发和内部应用。
                            </p>

                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="card p-8 bg-gradient-to-br from-primary-600 to-purple-700 text-white">
                                <h3 className="text-2xl font-bold mb-4">准备开始了吗？</h3>
                                <p className="text-primary-100 mb-6">
                                    创建免费账户，几分钟内即可开始分发应用。
                                </p>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                                >
                                    创建免费账户
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
