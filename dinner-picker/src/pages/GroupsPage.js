import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Avatar,
    Chip,
    TextField,
    InputAdornment,
    Skeleton
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    People as PeopleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { groupAPI } from '../services/api';
import toast from 'react-hot-toast';
import FloatingActionButton from '../components/FloatingActionButton';

const GroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            setLoading(true);
            // Assuming single user application with userId = 1
            const userId = 1;
            const response = await groupAPI.getUserGroups(userId);
            setGroups(response.data);
        } catch (error) {
            toast.error('Failed to load groups');
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getGroupStats = (group) => {
        const activeVotes = group.votingSessions?.filter(s => !s.locked).length || 0;
        const totalSessions = group.votingSessions?.length || 0;
        const memberCount = group.members?.length || 0;

        return { activeVotes, totalSessions, memberCount };
    };

    // Function to determine if a color is light or dark
    const isLightColor = (hexColor) => {
        if (!hexColor) return false;
        
        // Remove # if present
        const color = hexColor.replace('#', '');
        
        // Convert to RGB
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        
        // Calculate relative luminance using W3C formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return true only for very light colors (luminance > 0.8)
        return luminance > 0.8;
    };

    // Get appropriate text colors based on background
    const getTextColors = (colorTheme) => {
        const isLight = isLightColor(colorTheme);
        
        return {
            primary: isLight ? '#1a1a1a' : 'white',
            secondary: isLight ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
            caption: isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            chipText: isLight ? '#1a1a1a' : 'white',
            chipBg: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            activeBg: isLight ? 'rgba(76, 175, 80, 0.8)' : 'rgba(76, 217, 100, 0.8)'
        };
    };

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Skeleton variant="text" width="40%" height={60} />
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mt: 3, borderRadius: 2 }} />
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        {[1, 2, 3, 4].map((item) => (
                            <Grid item xs={12} md={6} lg={4} key={item}>
                                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white' }}>
                            Your Groups 👥
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 4 }}>
                            Manage your dining groups and discover new food adventures together
                        </Typography>

                        <TextField
                            fullWidth
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                maxWidth: 400,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.8)',
                                    },
                                },
                            }}
                        />
                    </Box>

                    {filteredGroups.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{
                                textAlign: 'center',
                                py: 8,
                                background: 'rgba(255, 255, 255, 0.95)'
                            }}>
                                <CardContent>
                                    <Avatar sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 4,
                                        bgcolor: 'primary.main',
                                        fontSize: 60
                                    }}>
                                        👥
                                    </Avatar>
                                    <Typography variant="h4" gutterBottom>
                                        No groups yet!
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                                        Create your first dining group to start making group decisions about where to eat!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate('/groups/create')}
                                        sx={{ borderRadius: '25px', px: 4 }}
                                    >
                                        Create Your First Group
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredGroups.map((group, index) => {
                                const stats = getGroupStats(group);
                                const textColors = getTextColors(group.colorTheme);

                                return (
                                    <Grid item xs={12} md={6} lg={4} key={group.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                            whileHover={{ y: -8 }}
                                        >
                                            <Card
                                                sx={{
                                                    cursor: 'pointer',
                                                    height: '100%',
                                                    background: `linear-gradient(135deg, ${group.colorTheme || '#f2ecd8'} 0%, ${group.colorTheme || '#f0e9f7'} 100%)`,
                                                    color: textColors.primary,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(10px)',
                                                    }
                                                }}
                                                onClick={() => navigate(`/groups/${group.id}`)}
                                            >
                                                <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                                                        <Avatar sx={{
                                                            bgcolor: isLightColor(group.colorTheme) 
                                                                ? 'rgba(0, 0, 0, 0.1)' 
                                                                : 'rgba(255, 255, 255, 0.2)',
                                                            color: textColors.primary,
                                                            width: 60,
                                                            height: 60,
                                                            fontSize: 30,
                                                            mr: 2
                                                        }}>
                                                            {group.emojiIcon || '🍽️'}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="h6" gutterBottom sx={{ 
                                                                fontWeight: 700,
                                                                color: textColors.primary 
                                                            }}>
                                                                {group.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ 
                                                                color: textColors.secondary, 
                                                                mb: 2 
                                                            }}>
                                                                {group.description || 'No description'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            icon={<PeopleIcon />}
                                                            label={`${stats.memberCount} members`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: textColors.chipBg,
                                                                color: textColors.chipText,
                                                                '& .MuiChip-icon': { color: textColors.chipText }
                                                            }}
                                                        />
                                                        <Chip
                                                            icon={<ScheduleIcon />}
                                                            label={`${stats.activeVotes} active`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: stats.activeVotes > 0 ? textColors.activeBg : textColors.chipBg,
                                                                color: textColors.chipText,
                                                                '& .MuiChip-icon': { color: textColors.chipText }
                                                            }}
                                                        />
                                                        <Chip
                                                            icon={<TrendingIcon />}
                                                            label={`${stats.totalSessions} total`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: textColors.chipBg,
                                                                color: textColors.chipText,
                                                                '& .MuiChip-icon': { color: textColors.chipText }
                                                            }}
                                                        />
                                                    </Box>

                                                    <Typography variant="caption" sx={{ color: textColors.caption }}>
                                                        Created {new Date(group.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Box>
            </motion.div>

            <FloatingActionButton
                onClick={() => navigate('/groups/create')}
                ariaLabel="add group"
            />
        </Container>
    );
};

export default GroupsPage;
