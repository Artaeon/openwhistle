const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const token = localStorage.getItem('token');

        const headers: HeadersInit = {
            ...options.headers,
        };

        // Only set Content-Type for non-FormData requests
        if (!(options.body instanceof FormData)) {
            (headers as Record<string, string>)['Content-Type'] = 'application/json';
        }

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || 'Anfrage fehlgeschlagen' };
        }

        return { data };
    } catch (error) {
        return { error: 'Netzwerkfehler. Bitte versuchen Sie es erneut.' };
    }
}

// Settings endpoints (public GET, admin PUT)
export const getSettings = () =>
    request<{ settings: Record<string, string> }>('/settings');

export const updateSettings = (settings: Record<string, string>) =>
    request<{ success: boolean; settings: Record<string, string> }>('/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
    });

// Categories endpoint
export const getCategories = () =>
    request<{ categories: string[] }>('/categories');

// Public endpoints
export const submitReport = (content: string, category: string, files?: File[]) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('category', category);
    files?.forEach(file => formData.append('files', file));

    return request<{
        success: boolean;
        credentials: { caseId: string; password: string };
        message: string;
    }>('/reports', {
        method: 'POST',
        body: formData,
    });
};

// Whistleblower endpoints
export const whistleblowerLogin = (caseId: string, password: string) =>
    request<{ token: string; caseId: string; status: string }>('/whistleblower/login', {
        method: 'POST',
        body: JSON.stringify({ caseId, password }),
    });

export const getWhistleblowerMessages = () =>
    request<{
        caseId: string;
        status: string;
        messages: Array<{
            id: string;
            senderType: 'WHISTLEBLOWER' | 'ADMIN';
            content: string;
            createdAt: string;
            attachments: Array<{ id: string; originalName: string; filePath: string }>;
        }>;
    }>('/whistleblower/messages');

export const sendWhistleblowerMessage = (content: string, files?: File[]) => {
    const formData = new FormData();
    formData.append('content', content);
    files?.forEach(file => formData.append('files', file));

    return request<{
        id: string;
        senderType: string;
        content: string;
        createdAt: string;
        attachments: Array<{ id: string; originalName: string }>;
    }>('/whistleblower/messages', {
        method: 'POST',
        body: formData,
    });
};

// Admin endpoints
export const adminLogin = (username: string, password: string) =>
    request<{ token: string; username: string }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });

export const getReports = () =>
    request<{
        reports: Array<{
            id: string;
            caseId: string;
            status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
            category: string;
            receivedConfirmationSent: boolean;
            createdAt: string;
            messageCount: number;
        }>;
    }>('/admin/reports');

export const getReportDetail = (id: string) =>
    request<{
        id: string;
        caseId: string;
        status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
        category: string;
        receivedConfirmationSent: boolean;
        createdAt: string;
        messages: Array<{
            id: string;
            senderType: 'WHISTLEBLOWER' | 'ADMIN';
            content: string;
            createdAt: string;
            attachments: Array<{ id: string; originalName: string; filePath?: string }>;
        }>;
    }>(`/admin/reports/${id}`);

export const sendAdminMessage = (reportId: string, content: string, files?: File[]) => {
    const formData = new FormData();
    formData.append('content', content);
    files?.forEach(file => formData.append('files', file));

    return request<{
        id: string;
        senderType: string;
        content: string;
        createdAt: string;
        attachments: Array<{ id: string; originalName: string }>;
    }>(`/admin/reports/${reportId}/messages`, {
        method: 'POST',
        body: formData,
    });
};

export const updateReportStatus = (reportId: string, status: 'NEW' | 'IN_PROGRESS' | 'CLOSED') =>
    request<{ id: string; caseId: string; status: string }>(`/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });

export const sendConfirmation = (reportId: string) =>
    request<{ success: boolean; message: string }>(`/admin/reports/${reportId}/send-confirmation`, {
        method: 'POST',
    });

export const getAttachmentUrl = (id: string) => `${API_BASE}/attachments/${id}`;

export const getReportPdfUrl = (reportId: string) => `${API_BASE}/admin/reports/${reportId}/export-pdf`;

// Get direct URL for uploaded files (for image preview)
export const getUploadUrl = (filePath: string) => {
    // In Docker, backend is proxied via /api, so uploads are at /uploads
    const baseUrl = API_BASE.replace('/api', '');
    return `${baseUrl}/uploads/${filePath}`;
};

// User management endpoints
export const getUsers = () =>
    request<{
        users: Array<{
            id: string;
            username: string;
            email: string | null;
            isSuper: boolean;
            createdAt: string;
        }>;
    }>('/admin/users');

export const createUser = (username: string, email: string | undefined, password: string) =>
    request<{
        user: {
            id: string;
            username: string;
            email: string | null;
            isSuper: boolean;
            createdAt: string;
        };
    }>('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
    });

export const deleteUser = (id: string) =>
    request<{ success: boolean }>(`/admin/users/${id}`, {
        method: 'DELETE',
    });

// Helper to check if file is an image
export const isImageFile = (filename: string): boolean => {
    const ext = filename.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
};
