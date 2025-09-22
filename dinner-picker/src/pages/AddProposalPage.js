import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
    Snackbar
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dinnerAPI } from '../services/api';

const AddProposalPage = () => {
    const [formData, setFormData] = useState({ name: '', link: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Restaurant name is required';
        }

        if (!formData.link.trim()) {
            newErrors.link = 'Website link is required';
        } else if (!formData.link.startsWith('http://') && !formData.link.startsWith('https://')) {
            newErrors.link = 'Link must start with http:// or https://';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            await dinnerAPI.addOption(formData);
            setSnackbar({
                open: true,
                message: 'Proposal added successfully!',
                severity: 'success'
            });

            // Navigate back after short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to add proposal: ' + (err.response?.data?.error || 'Unknown error'),
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 3 }}
            >
                Back to Proposals
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Add New Restaurant Proposal
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Suggest a restaurant for the group to consider. Include the name and a link to their website or menu.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Restaurant Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        margin="normal"
                        required
                        autoFocus
                    />

                    <TextField
                        fullWidth
                        label="Website Link"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        error={!!errors.link}
                        helperText={errors.link || "Include http:// or https://"}
                        margin="normal"
                        required
                        placeholder="https://example-restaurant.com"
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? 'Adding...' : 'Add Proposal'}
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddProposalPage;
