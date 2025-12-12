import { format } from 'date-fns';
import { Download, Copy, ExternalLink, Eye, EyeOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Version } from '../../types';

interface VersionListProps {
    versions: Version[];
    onTogglePublish: (version: Version) => void;
    onDelete: (version: Version) => void;
}

export function VersionList({ versions, onTogglePublish, onDelete }: VersionListProps) {
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const copyLink = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('下载链接已复制！');
    };

    if (versions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                暂无版本，请上传第一个版本。
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {versions.map((version) => (
                <div
                    key={version.id}
                    className={`card p-4 ${!version.is_published ? 'opacity-60' : ''}`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-semibold text-gray-900">
                                    v{version.version_name}
                                </span>
                                <span className="text-sm text-gray-500">
                                    (构建号 {version.version_code})
                                </span>
                                {version.force_update && (
                                    <span className="badge bg-red-100 text-red-700">
                                        强制更新
                                    </span>
                                )}
                                <span className={`badge ${version.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {version.is_published ? '已发布' : '未发布'}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>渠道: {version.channel}</span>
                                <span>{formatFileSize(version.file_size)}</span>
                                <span className="flex items-center">
                                    <Download className="w-4 h-4 mr-1" />
                                    {version.download_count} 次下载
                                </span>
                                <span>{format(new Date(version.created_at), 'yyyy-MM-dd HH:mm')}</span>
                            </div>

                            {version.release_notes && (
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                    {version.release_notes}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                onClick={() => copyLink(version.download_url)}
                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="复制下载链接"
                            >
                                <Copy className="w-5 h-5" />
                            </button>

                            <a
                                href={version.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="打开下载链接"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>

                            <button
                                onClick={() => onTogglePublish(version)}
                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title={version.is_published ? '下架' : '上架'}
                            >
                                {version.is_published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>

                            <button
                                onClick={() => onDelete(version)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="删除版本"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
