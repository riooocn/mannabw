export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const isFormData = options.body instanceof FormData;
    
    const headers = new Headers(options.headers);
    
    // Only set Content-Type to application/json if it's not FormData
    if (!isFormData && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    
    headers.set('Accept', 'application/json');

    // Add Authorization header if token exists in localStorage (client-side only)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const config: RequestInit = {
        ...options,
        headers,
        // credentials: 'omit', // We use Bearer token, so no need for session cookies (avoids CSRF mismatch)
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Some APIs might return 204 No Content
    const data = response.status !== 204 ? await response.json().catch(() => ({})) : {};

    if (!response.ok) {
        throw { status: response.status, data };
    }

    return data;
}

// Function to get CSRF token before login/register
export async function getCsrfToken() {
    return fetchApi('/sanctum/csrf-cookie', { method: 'GET' });
}
