import React, { useState, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Avatar,
    Chip,
    IconButton,
    Paper,
    Zoom,
    Alert,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ColorLens as ColorIcon,
    EmojiEmotions as EmojiIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { groupAPI } from '../services/api';

const CreateGroupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        emojiIcon: '🍽️',
        colorTheme: '#667eea'
    });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const navigate = useNavigate();

    const colorThemes = [
        { name: 'Ocean Blue', value: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: 'Sunset Pink', value: '#f093fb', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Fresh Green', value: '#4facfe', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { name: 'Golden Hour', value: '#ffeaa7', gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)' },
        { name: 'Purple Magic', value: '#a29bfe', gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' },
        { name: 'Mint Fresh', value: '#00b894', gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }
    ];

    // Validation function
    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Group name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Group name must be at least 2 characters';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Group name must be less than 50 characters';
        }

        if (formData.description && formData.description.length > 200) {
            newErrors.description = 'Description must be less than 200 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle input changes with validation
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear specific error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Show preview when name is entered
        if (field === 'name' && value.trim()) {
            setShowPreview(true);
        }
    }, [errors]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        try {
            setLoading(true);

            // Prepare the data
            const groupData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                emojiIcon: formData.emojiIcon,
                colorTheme: formData.colorTheme
            };

            const response = await groupAPI.createGroup(groupData);

            if (response.data.success) {
                toast.success('🎉 Group created successfully!');
                // Navigate to the new group
                navigate(`/groups/${response.data.group.id}`);
            } else {
                throw new Error(response.data.error || 'Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);

            // Handle specific error types
            if (error.response?.status === 400) {
                const serverErrors = error.response.data.errors || {};
                setErrors(serverErrors);
                toast.error('Please check your input and try again');
            } else if (error.response?.status >= 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error(error.message || 'Failed to create group');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmojiClick = (emojiData) => {
        handleInputChange('emojiIcon', emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const isFormValid = formData.name.trim() && !Object.keys(errors).some(key => errors[key]);

    return (
        <Container maxWidth="md">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box sx={{ py: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/groups')}
                        sx={{ mb: 3, color: 'white' }}
                        disabled={loading}
                    >
                        Back to Groups
                    </Button>

                    <Card sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 4
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                                ✨ Create New Group
                            </Typography>

                            {/* Preview Card */}
                            <AnimatePresence>
                                {showPreview && (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0, height: 0 }}
                                        animate={{ scale: 1, opacity: 1, height: 'auto' }}
                                        exit={{ scale: 0.9, opacity: 0, height: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                mb: 4,
                                                background: colorThemes.find(c => c.value === formData.colorTheme)?.gradient || colorThemes[0].gradient,
                                                color: 'white',
                                                borderRadius: 3,
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Avatar sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                mx: 'auto',
                                                mb: 2,
                                                fontSize: 40
                                            }}>
                                                {formData.emojiIcon}
                                            </Avatar>
                                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                                {formData.name || 'Your Group Name'}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                {formData.description || 'Group description will appear here'}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Grid container spacing={3}>
                                    {/* Group Name and Icon Selection - Same Row */}
                                    <Grid item size={12}>
                                        <Grid container spacing={2}>
                                            <Grid item size={6} sm={8}>
                                                <TextField
                                                    fullWidth
                                                    label="Group Name"
                                                    placeholder="e.g., Friday Lunch Squad"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    error={!!errors.name}
                                                    helperText={errors.name}
                                                    required
                                                    disabled={loading}
                                                    InputProps={{
                                                        endAdornment: formData.name.trim() && !errors.name && (
                                                            <InputAdornment position="end">
                                                                <CheckIcon color="success" />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <Box sx={{ position: 'relative' }}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<EmojiIcon />}
                                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                        disabled={loading}
                                                        fullWidth
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            minHeight: 56,
                                                            justifyContent: 'flex-start'
                                                        }}
                                                    >
                                                        <Avatar sx={{ mx: 1, bgcolor: 'transparent', width: 32, height: 32 }}>
                                                            {formData.emojiIcon}
                                                        </Avatar>
                                                        Select Icon
                                                    </Button>

                                                    <AnimatePresence>
                                                        {showEmojiPicker && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '100%',
                                                                    right: 0,
                                                                    zIndex: 1000,
                                                                    marginTop: 8
                                                                }}
                                                            >
                                                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {/* Description - Separate Row */}
                                    <Grid item size={12}>
                                        <TextField
                                            fullWidth
                                            label="Description (Optional)"
                                            placeholder="Tell us about your group..."
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            error={!!errors.description}
                                            helperText={errors.description || `${formData.description.length}/200 characters`}
                                            multiline
                                            rows={3}
                                            disabled={loading}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    {/* Color Theme Selection */}
                                    <Grid item size={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Choose a Theme
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {colorThemes.map((theme, index) => (
                                                <Grid item xs={6} sm={4} key={theme.value}>
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Card
                                                            sx={{
                                                                cursor: 'pointer',
                                                                background: theme.gradient,
                                                                color: 'white',
                                                                border: formData.colorTheme === theme.value ?
                                                                    '3px solid #fff' : 'none',
                                                                borderRadius: 2,
                                                                transition: 'all 0.2s',
                                                                opacity: loading ? 0.7 : 1,
                                                                pointerEvents: loading ? 'none' : 'auto'
                                                            }}
                                                            onClick={() => !loading && handleInputChange('colorTheme', theme.value)}
                                                        >
                                                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                                                <ColorIcon sx={{ mb: 1 }} />
                                                                <Typography variant="caption" display="block">
                                                                    {theme.name}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Form Actions */}
                                <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/groups')}
                                        disabled={loading}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading || !isFormValid}
                                        sx={{
                                            minWidth: 120,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                            },
                                            '&:disabled': {
                                                background: '#ccc'
                                            }
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Group 🚀'
                                        )}
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </motion.div>
        </Container>
    );
};

export default CreateGroupPage;