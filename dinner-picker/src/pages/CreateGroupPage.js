import React, { useState } from 'react';
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
    Zoom
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ColorLens as ColorIcon,
    EmojiEmotions as EmojiIcon
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
    const navigate = useNavigate();

    const colorThemes = [
        { name: 'Ocean Blue', value: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: 'Sunset Pink', value: '#f093fb', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Fresh Green', value: '#4facfe', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { name: 'Golden Hour', value: '#ffeaa7', gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)' },
        { name: 'Purple Magic', value: '#a29bfe', gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' },
        { name: 'Mint Fresh', value: '#00b894', gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Please enter a group name');
            return;
        }

        try {
            setLoading(true);
            const response = await groupAPI.createGroup(formData);
            if (response.data.success) {
                toast.success('🎉 Group created successfully!');
                navigate(`/groups/${response.data.group.id}`);
            }
        } catch (error) {
            toast.error('Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    const handleEmojiClick = (emojiData) => {
        setFormData(prev => ({ ...prev, emojiIcon: emojiData.emoji }));
        setShowEmojiPicker(false);
    };

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
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
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

                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Group Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                            variant="outlined"
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Choose an Icon
                                        </Typography>
                                        <Box sx={{ position: 'relative', mb: 3 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                sx={{
                                                    minWidth: 120,
                                                    height: 60,
                                                    fontSize: 24,
                                                    borderRadius: 3,
                                                    border: '2px dashed #ccc',
                                                    '&:hover': {
                                                        border: '2px dashed #667eea',
                                                        backgroundColor: 'rgba(102, 126, 234, 0.05)'
                                                    }
                                                }}
                                            >
                                                {formData.emojiIcon} <EmojiIcon sx={{ ml: 1 }} />
                                            </Button>

                                            <AnimatePresence>
                                                {showEmojiPicker && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '70px',
                                                            left: 0,
                                                            zIndex: 1000,
                                                            borderRadius: '12px',
                                                            overflow: 'hidden',
                                                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                                                        }}
                                                    >
                                                        <EmojiPicker
                                                            onEmojiClick={handleEmojiClick}
                                                            width={300}
                                                            height={350}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Choose a Color Theme
                                        </Typography>
                                        <Grid container spacing={1}>
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
                                                                border: formData.colorTheme === theme.value ? '3px solid #fff' : 'none',
                                                                borderRadius: 2,
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onClick={() => setFormData(prev => ({ ...prev, colorTheme: theme.value }))}
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
                                        disabled={loading || !formData.name.trim()}
                                        sx={{
                                            minWidth: 120,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                            }
                                        }}
                                    >
                                        {loading ? 'Creating...' : 'Create Group 🚀'}
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
