import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';
import type {
    AuthResponse,
    LoginCredentials,
    RegisterData,
    User,
    App,
    AppListResponse,
    CreateAppData,
    Version,
    VersionListResponse,
    DownloadPageInfo,
    AdminStats,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add auth token to requests
        this.client.interceptors.request.use((config) => {
            const token = useAuthStore.getState().token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Handle auth errors
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    useAuthStore.getState().logout();
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await this.client.post<AuthResponse>('/api/auth/login', credentials);
        return data;
    }

    async register(userData: RegisterData): Promise<User> {
        const { data } = await this.client.post<User>('/api/auth/register', userData);
        return data;
    }

    async getMe(): Promise<User> {
        const { data } = await this.client.get<User>('/api/auth/me');
        return data;
    }

    // App endpoints
    async getApps(page = 1, pageSize = 20, platform?: string): Promise<AppListResponse> {
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
        if (platform) params.append('platform', platform);
        const { data } = await this.client.get<AppListResponse>(`/api/apps?${params}`);
        return data;
    }

    async getApp(id: number): Promise<App> {
        const { data } = await this.client.get<App>(`/api/apps/${id}`);
        return data;
    }

    async createApp(appData: CreateAppData): Promise<App> {
        const { data } = await this.client.post<App>('/api/apps', appData);
        return data;
    }

    async updateApp(id: number, appData: Partial<CreateAppData>): Promise<App> {
        const { data } = await this.client.put<App>(`/api/apps/${id}`, appData);
        return data;
    }

    async deleteApp(id: number): Promise<void> {
        await this.client.delete(`/api/apps/${id}`);
    }

    // Version endpoints
    async getVersions(appId: number): Promise<VersionListResponse> {
        const { data } = await this.client.get<VersionListResponse>(`/api/apps/${appId}/versions`);
        return data;
    }

    async uploadVersion(
        appId: number,
        file: File,
        metadata: {
            version_code: string;
            version_name: string;
            channel?: string;
            release_notes?: string;
            force_update?: boolean;
        },
        onProgress?: (progress: number) => void
    ): Promise<Version> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('version_code', metadata.version_code);
        formData.append('version_name', metadata.version_name);
        if (metadata.channel) formData.append('channel', metadata.channel);
        if (metadata.release_notes) formData.append('release_notes', metadata.release_notes);
        formData.append('force_update', String(metadata.force_update || false));

        const { data } = await this.client.post<Version>(`/api/apps/${appId}/versions`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                }
            },
        });
        return data;
    }

    async updateVersion(id: number, data: Partial<Version>): Promise<Version> {
        const { data: response } = await this.client.put<Version>(`/api/versions/${id}`, data);
        return response;
    }

    async togglePublish(id: number): Promise<{ is_published: boolean }> {
        const { data } = await this.client.patch<{ is_published: boolean }>(`/api/versions/${id}/publish`);
        return data;
    }

    async deleteVersion(id: number): Promise<void> {
        await this.client.delete(`/api/versions/${id}`);
    }

    // Download endpoints (public)
    async getDownloadPage(token: string): Promise<DownloadPageInfo> {
        const { data } = await this.client.get<DownloadPageInfo>(`/api/download/${token}`);
        return data;
    }

    // Admin endpoints
    async getAdminStats(): Promise<AdminStats> {
        const { data } = await this.client.get<AdminStats>('/api/admin/stats');
        return data;
    }

    async getAdminUsers(page = 1, pageSize = 20, search?: string) {
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
        if (search) params.append('search', search);
        const { data } = await this.client.get(`/api/admin/users?${params}`);
        return data;
    }

    async updateUser(id: number, userData: { is_active?: boolean; is_admin?: boolean }) {
        const { data } = await this.client.patch(`/api/admin/users/${id}`, userData);
        return data;
    }

    async getAdminApps(page = 1, pageSize = 20, platform?: string, search?: string) {
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
        if (platform) params.append('platform', platform);
        if (search) params.append('search', search);
        const { data } = await this.client.get(`/api/admin/apps?${params}`);
        return data;
    }

    async adminDeleteApp(id: number): Promise<void> {
        await this.client.delete(`/api/admin/apps/${id}`);
    }

    async toggleAppPublic(id: number) {
        const { data } = await this.client.patch(`/api/admin/apps/${id}/toggle-public`);
        return data;
    }
}

export const api = new ApiService();
