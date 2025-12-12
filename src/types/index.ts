// User types
export interface User {
    id: number;
    email: string;
    username: string;
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

// App types
export interface App {
    id: number;
    user_id: number;
    bundle_id: string;
    name: string;
    icon_url: string | null;
    description: string | null;
    platform: 'android' | 'ios';
    is_public: boolean;
    created_at: string;
    updated_at: string;
    version_count: number;
    latest_version: string | null;
}

export interface CreateAppData {
    bundle_id: string;
    name: string;
    description?: string;
    platform: 'android' | 'ios';
    is_public?: boolean;
}

export interface AppListResponse {
    items: App[];
    total: number;
    page: number;
    page_size: number;
}

// Version types
export interface Version {
    id: number;
    app_id: number;
    version_code: string;
    version_name: string;
    file_size: number;
    channel: string;
    release_notes: string | null;
    force_update: boolean;
    is_published: boolean;
    download_token: string;
    download_count: number;
    created_at: string;
    download_url: string;
}

export interface CreateVersionData {
    version_code: string;
    version_name: string;
    channel?: string;
    release_notes?: string;
    force_update?: boolean;
}

export interface VersionListResponse {
    items: Version[];
    total: number;
}

// Download page types
export interface DownloadPageInfo {
    app_name: string;
    app_icon: string | null;
    bundle_id: string;
    platform: 'android' | 'ios';
    version_name: string;
    version_code: string;
    file_size: number;
    release_notes: string | null;
    force_update: boolean;
    download_count: number;
    created_at: string;
    download_url: string;
    plist_url?: string;
    itms_url?: string;
}

// Admin types
export interface AdminStats {
    total_users: number;
    total_apps: number;
    total_versions: number;
    total_downloads: number;
}

export interface AdminUser extends User {
    app_count: number;
}

export interface AdminApp {
    id: number;
    bundle_id: string;
    name: string;
    platform: string;
    is_public: boolean;
    created_at: string;
    owner_username: string;
    version_count: number;
    total_downloads: number;
}
