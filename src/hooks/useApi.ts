import { useState, useCallback } from 'react';
import { api } from '../services/api';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

export function useApi<T, P extends unknown[]>(
    apiFunc: (...args: P) => Promise<T>,
    options: UseApiOptions<T> = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(
        async (...args: P): Promise<T | null> => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFunc(...args);
                setData(result);
                options.onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('An error occurred');
                setError(error);
                options.onError?.(error);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiFunc, options]
    );

    return { data, loading, error, execute };
}

// Pre-configured hooks for common API calls
export function useApps() {
    return useApi(api.getApps.bind(api));
}

export function useVersions(appId: number) {
    return useApi(() => api.getVersions(appId));
}

export function useDownloadPage(token: string) {
    return useApi(() => api.getDownloadPage(token));
}

export function useAdminStats() {
    return useApi(api.getAdminStats.bind(api));
}
