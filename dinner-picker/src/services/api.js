import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Groups API
export const groupAPI = {
    getAllGroups: () => api.get('/api/groups'),
    getGroup: (id) => api.get(`/api/groups/${id}`),
    createGroup: (groupData) => api.post('/api/groups', groupData), // TODO : check implementation in spring
    getUserGroups: (userId) => api.get(`/api/groups/user/${userId}`),
};

// Voting Sessions API
export const sessionAPI = {
    getGroupSessions: (groupId) => api.get(`/api/sessions/group/${groupId}`),
    getSession: (id) => api.get(`/api/sessions/${id}`),
    createSession: (sessionData) => api.post('/api/sessions', sessionData),
    lockSession: (id, locked) => api.post(`/api/sessions/${id}/lock`, { locked }),
};

// Options API
// TODO : check implementation in spring
export const optionAPI = {
    getSessionOptions: (sessionId) => api.get(`/api/sessions/${sessionId}/options`),
    addOption: (optionData) => api.post('/api/options', optionData),
    vote: (optionId, delta) => api.post(`/api/options/${optionId}/vote`, { delta }),
};

export default api;
