import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging and debugging
api.interceptors.request.use(
    (config) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
    },
    (error) => {
        console.error('[API Request Error]:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for consistent error handling and data format
api.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.error('[API Response Error]:', error);

        // Handle network errors
        if (!error.response) {
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                type: 'NETWORK_ERROR',
                originalError: error
            });
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                message: 'Request timeout. Please try again.',
                type: 'TIMEOUT_ERROR',
                originalError: error
            });
        }

        // Handle HTTP errors
        const { status, data } = error.response;
        let errorMessage = 'An unexpected error occurred';

        if (data?.error) {
            errorMessage = data.error;
        } else if (data?.message) {
            errorMessage = data.message;
        } else if (status === 400) {
            errorMessage = 'Invalid request data';
        } else if (status === 401) {
            errorMessage = 'Unauthorized access';
        } else if (status === 403) {
            errorMessage = 'Access forbidden';
        } else if (status === 404) {
            errorMessage = 'Resource not found';
        } else if (status >= 500) {
            errorMessage = 'Server error. Please try again later.';
        }

        return Promise.reject({
            ...error,
            message: errorMessage,
            status,
            data
        });
    }
);

// Helper function to normalize response data format
const normalizeResponse = (response) => {
    // Handle both old format (direct array/object) and new format (with success flag)
    if (response.data.success !== undefined) {
        return {
            ...response,
            data: response.data.data || response.data
        };
    }
    return response;
};

// Groups API
export const groupAPI = {
    getAllGroups: async () => {
        try {
            const response = await api.get('/api/groups');
            return normalizeResponse(response);
        } catch (error) {
            throw error;
        }
    },

    getGroup: async (id) => {
        if (!id) throw new Error('Group ID is required');

        try {
            const response = await api.get(`/api/groups/${id}`);
            return normalizeResponse(response);
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
            return normalizeResponse(response);
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
            return normalizeResponse(response);
        } catch (error) {
            throw error;
        }
    },

    getSession: async (id) => {
        if (!id) throw new Error('Session ID is required');

        try {
            const response = await api.get(`/api/sessions/${id}`);
            return normalizeResponse(response);
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
        if (typeof locked !== 'boolean') throw new Error('Lock status must be boolean');

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
    getAllOptions: async () => {
        try {
            const response = await api.get('/api/options');
            return normalizeResponse(response);
        } catch (error) {
            throw error;
        }
    },

    getSessionOptions: async (sessionId) => {
        if (!sessionId) throw new Error('Session ID is required');

        try {
            const response = await api.get(`/api/sessions/${sessionId}/options`);
            return normalizeResponse(response);
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

        if (!Number.isInteger(delta)) {
            throw new Error('Vote delta must be an integer');
        }

        try {
            console.log(`[Voting] Option ${optionId}, Delta: ${delta}`);

            const response = await api.post(`/api/options/${optionId}/vote`, { delta });

            console.log(`[Vote Response]`, response.data);
            return response;

        } catch (error) {
            console.error(`[Vote Error]`, error);
            throw error;
        }
    }
};

// Utility functions
export const apiUtils = {
    // Check if the API is reachable
    healthCheck: async () => {
        try {
            const response = await api.get('/api/status');
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
    },

    // Retry mechanism for failed requests
    retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await requestFn();
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }

                console.log(`Request attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
};

export default api;