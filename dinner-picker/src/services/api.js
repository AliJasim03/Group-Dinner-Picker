import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const dinnerAPI = {
    // Get all proposals
    getOptions: () => api.get('/options'),

    // Add new proposal
    addOption: (proposal) => api.post('/options', proposal),

    // Vote on proposal
    vote: (optionId, delta) => api.post('/vote', { optionId, delta }),

    // Lock voting
    lockVoting: (locked) => api.post('/lock', { locked }),

    // Get winner
    getWinner: () => api.get('/winner'),

    // Get status
    getStatus: () => api.get('/status'),
};

export default api;
