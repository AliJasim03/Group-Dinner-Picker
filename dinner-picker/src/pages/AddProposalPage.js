import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    Paper,
    InputAdornment,
    Autocomplete,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Restaurant as RestaurantIcon,
    Link as LinkIcon,
    Image as ImageIcon,
    AttachMoney as MoneyIcon,
    Search as SearchIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { sessionAPI, optionAPI } from '../services/api';

const AddProposalPage = () => {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        link: '',
        imageUrl: '',
        cuisine: '',
        priceRange: ''
    });
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    const cuisineOptions = [
        'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'Indian', 'American',
        'French', 'Mediterranean', 'Korean', 'Vietnamese', 'Greek', 'Spanish',
        'Middle Eastern', 'Brazilian', 'Seafood', 'BBQ', 'Pizza', 'Burgers',
        'Vegetarian', 'Vegan', 'Fusion', 'Fast Food', 'Fine Dining', 'Other'
    ];

    const priceRanges = [
        { value: '$', label: '$ - Budget Friendly', description: 'Under $15 per person' },
        { value: '$$', label: '$$ - Moderate', description: '$15-30 per person' },
        { value: '$$$', label: '$$$ - Upscale', description: '$30+ per person' }
    ];

    const popularRestaurants = [
        { name: 'Pizza Palace', link: 'https://pizzapalace.com', cuisine: 'Italian', price: '$$' },
        { name: 'Burger Barn', link: 'https://burgerbarn.com', cuisine: 'American', price: '$' },
        { name: 'Sushi Supreme', link: 'https://sushisupreme.com', cuisine: 'Japanese', price: '$$$' },
        { name: 'Taco Fiesta', link: 'https://tacofiesta.com', cuisine: 'Mexican', price: '$' },
        { name: 'Pasta Paradise', link: 'https://pastaparadise.com', cuisine: 'Italian', price: '$$' }
    ];

    const steps = ['Basic Info', 'Details', 'Review'];

    useEffect(() => {
        const fetchSession = async () => {
            try {
                setPageLoading(true);
                console.log('Fetching session with ID:', sessionId);

                const response = await sessionAPI.getSession(sessionId);
                console.log('Session response:', response.data);

                // Handle both old format (direct data) and new format (with success flag)
                const sessionData = response.data.success ? response.data.data : response.data;
                setSession(sessionData);

                // Check if session is locked
                if (sessionData.locked) {
                    toast.error('This voting session is locked. Cannot add restaurants.');
                    navigate(`/sessions/${sessionId}`);
                }

            } catch (error) {
                console.error('Error fetching session:', error);
                toast.error('Failed to load session');
                navigate('/groups');
            } finally {
                setPageLoading(false);
            }
        };

        if (sessionId) {
            fetchSession();
        }
    }, [sessionId, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Restaurant name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Restaurant name must be at least 2 characters';
        }

        if (!formData.link.trim()) {
            newErrors.link = 'Website link is required';
        } else if (!isValidUrl(formData.link)) {
            newErrors.link = 'Please enter a valid URL (starting with http:// or https://)';
        }

        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid image URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };

    const handleNext = () => {
        if (activeStep === 0) {
            // Validate basic info
            if (!formData.name.trim()) {
                toast.error('Please enter a restaurant name');
                return;
            }
            if (!formData.link.trim() || !isValidUrl(formData.link)) {
                toast.error('Please enter a valid website link');
                return;
            }
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        try {
            setLoading(true);

            const proposalData = {
                name: formData.name.trim(),
                link: formData.link.trim(),
                imageUrl: formData.imageUrl ? formData.imageUrl.trim() : null,
                cuisine: formData.cuisine || null,
                priceRange: formData.priceRange || null,
                votingSessionId: parseInt(sessionId)
            };

            console.log('Submitting proposal data:', proposalData);

            const response = await optionAPI.addOption(proposalData);
            console.log('Add option response:', response.data);

            if (response.data.success) {
                toast.success('🎉 Restaurant added successfully!');
                navigate(`/sessions/${sessionId}`);
            } else {
                throw new Error(response.data.error || 'Failed to add restaurant');
            }

        } catch (error) {
            console.error('Error adding restaurant:', error);

            let errorMessage = 'Failed to add restaurant';

            if (error.response) {
                // Server responded with error
                if (error.response.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data?.errors) {
                    // Validation errors
                    const validationErrors = error.response.data.errors;
                    setErrors(validationErrors);
                    errorMessage = 'Please fix the validation errors';
                } else if (error.response.status === 400) {
                    errorMessage = 'Invalid restaurant data. Please check your input.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
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

    const handleQuickFill = (restaurant) => {
        setFormData(prev => ({
            ...prev,
            name: restaurant.name,
            link: restaurant.link,
            cuisine: restaurant.cuisine,
            priceRange: restaurant.price
        }));
        setActiveStep(2); // Jump to review step
    };

    if (pageLoading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h5" sx={{ color: 'white' }}>Loading session...</Typography>
                </Box>
            </Container>
        );
    }

    if (!session) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: 'white' }}>Session not found</Typography>
                    <Button onClick={() => navigate('/groups')} sx={{ mt: 2, color: 'white' }}>
                        Back to Groups
                    </Button>
                </Box>
            </Container>
        );
    }

    const isFormValid = formData.name.trim() && formData.link.trim() && isValidUrl(formData.link);

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
                        onClick={() => navigate(`/sessions/${sessionId}`)}
                        sx={{ mb: 3, color: 'white' }}
                        disabled={loading}
                    >
                        Back to {session.title}
                    </Button>

                    <Card sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 4
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                                🍽️ Add Restaurant Proposal
                            </Typography>

                            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {/* Session Info */}
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Adding proposal to: <strong>{session.title}</strong>
                            </Alert>

                            {/* Quick Fill Options */}
                            {activeStep === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                        Quick Fill Options
                                    </Typography>
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        {popularRestaurants.map((restaurant, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        cursor: 'pointer',
                                                        '&:hover': { bgcolor: 'action.hover' }
                                                    }}
                                                    onClick={() => handleQuickFill(restaurant)}
                                                >
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {restaurant.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {restaurant.cuisine} • {restaurant.price}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </motion.div>
                            )}

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <AnimatePresence mode="wait">
                                    {activeStep === 0 && (
                                        <motion.div
                                            key="basic"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                        >
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Restaurant Name"
                                                        name="name"
                                                        placeholder="e.g., Tony's Italian Kitchen"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        error={!!errors.name}
                                                        helperText={errors.name}
                                                        required
                                                        disabled={loading}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <RestaurantIcon />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: formData.name.trim() && !errors.name && (
                                                                <InputAdornment position="end">
                                                                    <CheckIcon color="success" />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Website Link"
                                                        name="link"
                                                        placeholder="https://tonysitaliankitchen.com"
                                                        value={formData.link}
                                                        onChange={handleChange}
                                                        error={!!errors.link}
                                                        helperText={errors.link || 'Include the full URL starting with http:// or https://'}
                                                        required
                                                        disabled={loading}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LinkIcon />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: formData.link.trim() && isValidUrl(formData.link) && (
                                                                <InputAdornment position="end">
                                                                    <CheckIcon color="success" />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </motion.div>
                                    )}

                                    {activeStep === 1 && (
                                        <motion.div
                                            key="details"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                        >
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Image URL (Optional)"
                                                        name="imageUrl"
                                                        placeholder="https://example.com/restaurant-image.jpg"
                                                        value={formData.imageUrl}
                                                        onChange={handleChange}
                                                        error={!!errors.imageUrl}
                                                        helperText={errors.imageUrl || 'Optional: Add a photo URL for the restaurant'}
                                                        disabled={loading}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <ImageIcon />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        options={cuisineOptions}
                                                        value={formData.cuisine}
                                                        onChange={(event, newValue) => {
                                                            setFormData(prev => ({ ...prev, cuisine: newValue || '' }));
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Cuisine Type (Optional)"
                                                                placeholder="Select cuisine..."
                                                                disabled={loading}
                                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FormControl fullWidth disabled={loading}>
                                                        <InputLabel>Price Range (Optional)</InputLabel>
                                                        <Select
                                                            name="priceRange"
                                                            value={formData.priceRange}
                                                            onChange={handleChange}
                                                            label="Price Range (Optional)"
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <MoneyIcon />
                                                                </InputAdornment>
                                                            }
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            <MenuItem value="">
                                                                <em>Select price range...</em>
                                                            </MenuItem>
                                                            {priceRanges.map((range) => (
                                                                <MenuItem key={range.value} value={range.value}>
                                                                    <Box>
                                                                        <Typography variant="body1">
                                                                            {range.label}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {range.description}
                                                                        </Typography>
                                                                    </Box>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </motion.div>
                                    )}

                                    {activeStep === 2 && (
                                        <motion.div
                                            key="review"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                        >
                                            <Typography variant="h6" gutterBottom>
                                                Review Your Proposal
                                            </Typography>

                                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6" color="primary">
                                                            {formData.name || 'Restaurant Name'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Website: {formData.link || 'No link provided'}
                                                        </Typography>
                                                    </Grid>
                                                    {formData.cuisine && (
                                                        <Grid item xs={12}>
                                                            <Chip label={formData.cuisine} size="small" />
                                                        </Grid>
                                                    )}
                                                    {formData.priceRange && (
                                                        <Grid item xs={12}>
                                                            <Chip
                                                                label={priceRanges.find(r => r.value === formData.priceRange)?.label || formData.priceRange}
                                                                size="small"
                                                                color="primary"
                                                            />
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </Paper>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                    <Button
                                        disabled={activeStep === 0 || loading}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        Back
                                    </Button>

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(`/sessions/${sessionId}`)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>

                                        {activeStep === steps.length - 1 ? (
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={loading || !isFormValid}
                                                sx={{
                                                    minWidth: 120,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                                    }
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                                        Adding...
                                                    </>
                                                ) : (
                                                    'Add Restaurant 🎉'
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={handleNext}
                                                disabled={loading}
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </motion.div>
        </Container>
    );
};

export default AddProposalPage;