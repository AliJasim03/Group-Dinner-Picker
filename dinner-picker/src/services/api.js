import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response) => {
        console.log(`[API] Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('[API] Response error:', error);

        // Handle network errors
        if (!error.response) {
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                type: 'NETWORK_ERROR'
            });
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                message: 'Request timeout. Please try again.',
                type: 'TIMEOUT_ERROR'
            });
        }

        // Handle HTTP errors
        const { status, data } = error.response;
        let errorMessage = 'An unexpected error occurred';

        if (data?.error) {
            errorMessage = data.error;
        } else if (data?.message) {
            errorMessage = data.message;
        }

        return Promise.reject({
            ...error,
            message: errorMessage,
            status,
            data
        });
    }
);

// Groups API
export const groupAPI = {
    getAllGroups: async () => {
        try {
            const response = await api.get('/api/groups');
            // Handle both old format (direct array) and new format (with success flag)
            if (response.data.success) {
                return {
                    ...response,
                    data: response.data.data || response.data
                };
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    getGroup: async (id) => {
        if (!id) throw new Error('Group ID is required');

        try {
            const response = await api.get(`/api/groups/${id}`);
            // Handle both old format and new format
            if (response.data.success) {
                return {
                    ...response,
                    data: response.data.data || response.data
                };
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    createGroup: async (groupData) => {
        // Validate required fields
        if (!groupData.name || !groupData.name.trim()) {
            throw new Error('Group name is required');
        }

        // Sanitize data
        const sanitizedData = {
            name: groupData.name.trim(),
            description: groupData.description ? groupData.description.trim() : '',
            emojiIcon: groupData.emojiIcon || '🍽️',
            colorTheme: groupData.colorTheme || '#667eea'
        };

        try {
            const response = await api.post('/api/groups', sanitizedData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getUserGroups: async (userId) => {
        if (!userId) throw new Error('User ID is required');

        try {
            const response = await api.get(`/api/groups/user/${userId}`);
            // Handle both old format and new format
            if (response.data.success) {
                return {
                    ...response,
                    data: response.data.data || response.data
                };
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    deleteGroup: async (id) => {
        if (!id) throw new Error('Group ID is required');

        try {
            const response = await api.delete(`/api/groups/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateGroup: async (id, groupData) => {
        if (!id) throw new Error('Group ID is required');

        // Sanitize data
        const sanitizedData = {
            name: groupData.name ? groupData.name.trim() : undefined,
            description: groupData.description ? groupData.description.trim() : undefined,
            emojiIcon: groupData.emojiIcon,
            colorTheme: groupData.colorTheme
        };

        try {
            const response = await api.put(`/api/groups/${id}`, sanitizedData);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

// Voting Sessions API
export const sessionAPI = {
    getGroupSessions: async (groupId) => {
        if (!groupId) throw new Error('Group ID is required');

        try {
            const response = await api.get(`/api/sessions/group/${groupId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getSession: async (id) => {
        if (!id) throw new Error('Session ID is required');

        try {
            const response = await api.get(`/api/sessions/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    createSession: async (sessionData) => {
        // Validate required fields
        if (!sessionData.title || !sessionData.title.trim()) {
            throw new Error('Session title is required');
        }

        if (!sessionData.groupId) {
            throw new Error('Group ID is required');
        }

        try {
            const response = await api.post('/api/sessions', sessionData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    lockSession: async (id, locked) => {
        if (!id) throw new Error('Session ID is required');

        try {
            const response = await api.post(`/api/sessions/${id}/lock`, { locked });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

// Options API
export const optionAPI = {
    getSessionOptions: async (sessionId) => {
        if (!sessionId) throw new Error('Session ID is required');

        try {
            const response = await api.get(`/api/sessions/${sessionId}/options`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    addOption: async (optionData) => {
        // Validate required fields
        if (!optionData.name || !optionData.name.trim()) {
            throw new Error('Option name is required');
        }

        if (!optionData.link || !optionData.link.trim()) {
            throw new Error('Option link is required');
        }

        try {
            const response = await api.post('/api/options', optionData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    vote: async (optionId, delta) => {
        if (!optionId) throw new Error('Option ID is required');

        if (delta === undefined || delta === null) {
            throw new Error('Vote delta is required');
        }

        try {
            const response = await api.post(`/api/options/${optionId}/vote`, { delta });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

// Utility functions
export const apiUtils = {
    // Check if the API is reachable
    healthCheck: async () => {
        try {
            const response = await api.get('/api/health');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Handle file uploads (if needed in the future)
    uploadFile: async (file, endpoint) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default api;