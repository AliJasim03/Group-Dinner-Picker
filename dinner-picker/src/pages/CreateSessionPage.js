import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Paper,
    Chip,
    Avatar,
    Stepper,
    Step,
    StepLabel,
    Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    ArrowBack as ArrowBackIcon,
    Schedule as ScheduleIcon,
    Restaurant as RestaurantIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { groupAPI, sessionAPI } from '../services/api';

const CreateSessionPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: null,
        hasDeadline: false
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const steps = ['Session Info', 'Settings', 'Review'];

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await groupAPI.getGroup(groupId);
                setGroup(response.data);
            } catch (error) {
                toast.error('Failed to load group');
                navigate('/groups');
            }
        };
        fetchGroup();
    }, [groupId, navigate]);

    const handleNext = () => {
        if (activeStep === 0 && !formData.title.trim()) {
            toast.error('Please enter a session title');
            return;
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const sessionData = {
                title: formData.title,
                description: formData.description,
                groupId: parseInt(groupId),
                deadline: formData.hasDeadline ? formData.deadline?.toISOString() : null
            };

            const response = await sessionAPI.createSession(sessionData);
            if (response.data.success) {
                toast.success('🎉 Session created successfully!');
                navigate(`/sessions/${response.data.session.id}`);
            }
        } catch (error) {
            toast.error('Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    const sessionTypes = [
        {
            id: 'lunch',
            title: 'Team Lunch',
            description: 'Quick lunch decision for the team',
            icon: '🍽️',
            color: '#667eea'
        },
        {
            id: 'dinner',
            title: 'Dinner Night',
            description: 'Special dinner gathering',
            icon: '🌃',
            color: '#f093fb'
        },
        {
            id: 'celebration',
            title: 'Celebration',
            description: 'Birthday, promotion, or special event',
            icon: '🎉',
            color: '#4facfe'
        },
        {
            id: 'casual',
            title: 'Casual Meal',
            description: 'Relaxed dining experience',
            icon: '😊',
            color: '#00d4aa'
        }
    ];

    if (!group) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: 'white' }}>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ py: 4 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(`/groups/${groupId}`)}
                            sx={{ mb: 3, color: 'white' }}
                        >
                            Back to {group.name}
                        </Button>

                        <Card sx={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 4,
                            mb: 3
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                    <Avatar sx={{
                                        bgcolor: group.colorTheme || '#667eea',
                                        width: 60,
                                        height: 60,
                                        fontSize: 24,
                                        mr: 2
                                    }}>
                                        {group.emojiIcon || '🍽️'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" component="h1" gutterBottom>
                                            Create New Session
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            For {group.name}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>

                                <AnimatePresence mode="wait">
                                    {/* Step 1: Session Info */}
                                    {activeStep === 0 && (
                                        <motion.div
                                            key="info"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                                📝 Session Details
                                            </Typography>

                                            <TextField
                                                fullWidth
                                                label="Session Title"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="e.g., Friday Team Lunch"
                                                sx={{ mb: 3 }}
                                                autoFocus
                                            />

                                            <TextField
                                                fullWidth
                                                label="Description (Optional)"
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Tell your group what this session is about..."
                                                multiline
                                                rows={3}
                                                sx={{ mb: 3 }}
                                            />

                                            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                                Quick Templates
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                                                {sessionTypes.map((type) => (
                                                    <motion.div
                                                        key={type.id}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Chip
                                                            avatar={<Avatar sx={{ bgcolor: type.color }}>{type.icon}</Avatar>}
                                                            label={type.title}
                                                            variant={formData.title === type.title ? "filled" : "outlined"}
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                title: type.title,
                                                                description: type.description
                                                            }))}
                                                            sx={{
                                                                p: 1,
                                                                '&:hover': {
                                                                    boxShadow: `0 4px 12px ${type.color}40`
                                                                }
                                                            }}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </Box>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Settings */}
                                    {activeStep === 1 && (
                                        <motion.div
                                            key="settings"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                                ⚙️ Session Settings
                                            </Typography>

                                            <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.hasDeadline}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                hasDeadline: e.target.checked
                                                            }))}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography variant="body1">Set Voting Deadline</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Automatically lock voting at a specific time
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Paper>

                                            <AnimatePresence>
                                                {formData.hasDeadline && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <DateTimePicker
                                                            label="Voting Deadline"
                                                            value={formData.deadline}
                                                            onChange={(newValue) => setFormData(prev => ({
                                                                ...prev,
                                                                deadline: newValue
                                                            }))}
                                                            renderInput={(params) => (
                                                                <TextField {...params} fullWidth sx={{ mb: 3 }} />
                                                            )}
                                                            minDateTime={new Date()}
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <Alert severity="info" sx={{ mt: 2 }}>
                                                💡 <strong>Tip:</strong> Setting a deadline helps create urgency and ensures decisions are made on time!
                                            </Alert>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Review */}
                                    {activeStep === 2 && (
                                        <motion.div
                                            key="review"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                                                👀 Review & Create
                                            </Typography>

                                            <Paper sx={{ p: 3, mb: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <RestaurantIcon sx={{ mr: 2, color: 'primary.main' }} />
                                                    <Typography variant="h6">{formData.title}</Typography>
                                                </Box>

                                                {formData.description && (
                                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                        {formData.description}
                                                    </Typography>
                                                )}

                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                                    <Chip
                                                        icon={<GroupIcon />}
                                                        label={`For ${group.name}`}
                                                        color="primary"
                                                    />
                                                    {formData.hasDeadline && formData.deadline && (
                                                        <Chip
                                                            icon={<ScheduleIcon />}
                                                            label={`Ends ${formData.deadline.toLocaleDateString()} at ${formData.deadline.toLocaleTimeString()}`}
                                                            color="warning"
                                                        />
                                                    )}
                                                </Box>
                                            </Paper>

                                            <Alert severity="success">
                                                🚀 Ready to create your session! Group members will be able to add restaurant proposals and vote immediately.
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        variant="outlined"
                                        size="large"
                                    >
                                        Back
                                    </Button>

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={() => navigate(`/groups/${groupId}`)}
                                        >
                                            Cancel
                                        </Button>

                                        {activeStep === steps.length - 1 ? (
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    minWidth: 120
                                                }}
                                            >
                                                {loading ? 'Creating...' : 'Create Session 🎉'}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={handleNext}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                }}
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </motion.div>
            </Container>
        </LocalizationProvider>
    );
};

export default CreateSessionPage;
