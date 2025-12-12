import { Smartphone, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">应用分发</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-md">
                            免费、开源的 App 分发平台。轻松上传和分享您的 Android 和 iOS 应用。
                            基于 FastAPI 和 React 构建。
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">产品</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">功能介绍</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">使用文档</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API 接口</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">资源</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 hover:text-white transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                    <span>GitHub</span>
                                </a>
                            </li>
                            <li><a href="#" className="hover:text-white transition-colors">部署指南</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">技术支持</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">
                        © {new Date().getFullYear()} 应用分发平台. 基于 MIT 协议开源。
                    </p>
                    <p className="text-sm mt-2 md:mt-0">
                        部署于 <span className="text-white">Vercel</span> + <span className="text-white">Render</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
