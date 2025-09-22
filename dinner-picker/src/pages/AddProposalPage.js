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
    Autocomplete
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Restaurant as RestaurantIcon,
    Link as LinkIcon,
    Image as ImageIcon,
    AttachMoney as MoneyIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    const [errors, setErrors] = useState({});
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

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await sessionAPI.getSession(sessionId);
                setSession(response.data);
            } catch (error) {
                toast.error('Failed to load session');
                navigate('/groups');
            }
        };
        fetchSession();
    }, [sessionId, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Restaurant name is required';
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
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            const proposalData = {
                ...formData,
                votingSessionId: parseInt(sessionId)
            };

            await optionAPI.addOption(proposalData);
            toast.success('🎉 Restaurant added successfully!');
            navigate(`/sessions/${sessionId}`);
        } catch (error) {
            toast.error('Failed to add restaurant: ' + (error.response?.data?.error || 'Unknown error'));
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
    };

    if (!session) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: 'white' }}>Loading...</Typography>
                </Box>
            </Container>
        );
    }

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
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{
                                    bgcolor: 'primary.main',
                                    width: 60,
                                    height: 60,
                                    fontSize: 24,
                                    mr: 2
                                }}>
                                    <RestaurantIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" component="h1" gutterBottom>
                                        🍽️ Add Restaurant
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Suggest a great restaurant for the group to consider
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Quick Fill Options */}
                            <Paper sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
                                <Typography variant="h6" gutterBottom>
                                    ⚡ Quick Fill (Popular Restaurants)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Click any restaurant below to auto-fill the form
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {popularRestaurants.map((restaurant, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Chip
                                                avatar={<Avatar>{restaurant.cuisine.charAt(0)}</Avatar>}
                                                label={`${restaurant.name} (${restaurant.price})`}
                                                onClick={() => handleQuickFill(restaurant)}
                                                sx={{
                                                    m: 0.5,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </Box>
                            </Paper>

                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Restaurant Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            required
                                            autoFocus
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <RestaurantIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Website Link"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleChange}
                                            error={!!errors.link}
                                            helperText={errors.link || "Include the full URL (https://...)"}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LinkIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={cuisineOptions}
                                            value={formData.cuisine}
                                            onChange={(event, newValue) => {
                                                setFormData(prev => ({ ...prev, cuisine: newValue || '' }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Cuisine Type"
                                                    placeholder="e.g., Italian, Mexican, etc."
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Price Range</InputLabel>
                                            <Select
                                                name="priceRange"
                                                value={formData.priceRange}
                                                onChange={handleChange}
                                                label="Price Range"
                                            >
                                                {priceRanges.map((range) => (
                                                    <MenuItem key={range.value} value={range.value}>
                                                        <Box>
                                                            <Typography variant="body1">{range.label}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {range.description}
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Photo URL (Optional)"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            error={!!errors.imageUrl}
                                            helperText={errors.imageUrl || "Add a photo to make your proposal stand out!"}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <ImageIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Preview Card */}
                                {(formData.name || formData.cuisine || formData.priceRange) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
                                            <Typography variant="h6" gutterBottom>
                                                👀 Preview
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                    {formData.cuisine ? formData.cuisine.charAt(0) : '🍽️'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6">
                                                        {formData.name || 'Restaurant Name'}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                        {formData.cuisine && (
                                                            <Chip size="small" label={formData.cuisine} />
                                                        )}
                                                        {formData.priceRange && (
                                                            <Chip size="small" label={formData.priceRange} color="primary" />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </motion.div>
                                )}

                                <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate(`/sessions/${sessionId}`)}
                                        disabled={loading}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading || !formData.name.trim() || !formData.link.trim()}
                                        sx={{
                                            minWidth: 120,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                            }
                                        }}
                                    >
                                        {loading ? 'Adding...' : 'Add Restaurant 🚀'}
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

export default AddProposalPage;
