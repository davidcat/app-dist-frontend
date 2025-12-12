import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Smartphone, Apple, Package, ChevronRight } from 'lucide-react';
import type { App } from '../../types';

interface AppCardProps {
    app: App;
}

export function AppCard({ app }: AppCardProps) {
    return (
        <Link
            to={`/apps/${app.id}`}
            className="card p-6 hover:shadow-xl transition-all duration-300 group"
        >
            <div className="flex items-start space-x-4">
                {/* App Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${app.platform === 'android'
                        ? 'bg-gradient-to-br from-green-400 to-green-600'
                        : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                    {app.icon_url ? (
                        <img
                            src={app.icon_url}
                            alt={app.name}
                            className="w-12 h-12 rounded-xl object-cover"
                        />
                    ) : (
                        app.platform === 'android'
                            ? <Smartphone className="w-8 h-8 text-white" />
                            : <Apple className="w-8 h-8 text-white" />
                    )}
                </div>

                {/* App Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                            {app.name}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>

                    <p className="text-sm text-gray-500 truncate mt-1">{app.bundle_id}</p>

                    <div className="flex items-center space-x-4 mt-3">
                        <span className={app.platform === 'android' ? 'badge-android' : 'badge-ios'}>
                            {app.platform === 'android' ? 'Android' : 'iOS'}
                        </span>

                        <div className="flex items-center text-gray-500 text-sm">
                            <Package className="w-4 h-4 mr-1" />
                            <span>{app.version_count} 个版本</span>
                        </div>

                        {app.latest_version && (
                            <span className="text-sm text-gray-500">
                                v{app.latest_version}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {app.description && (
                <p className="text-gray-600 text-sm mt-4 line-clamp-2">{app.description}</p>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                    创建于 {format(new Date(app.created_at), 'yyyy年MM月dd日')}
                </span>
                <span className={`text-xs font-medium ${app.is_public ? 'text-green-600' : 'text-orange-600'}`}>
                    {app.is_public ? '公开' : '私有'}
                </span>
            </div>
        </Link>
    );
}
