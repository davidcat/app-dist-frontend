import { Loader2 } from 'lucide-react';

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export function Loading({ text = '加载中...', fullScreen = false }: LoadingProps) {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            <p className="text-gray-500 text-sm">{text}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
}
