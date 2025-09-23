import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Avatar,
    Chip,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    Grid,
    Paper
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    EmojiEvents as TrophyIcon,
    Launch as LaunchIcon,
    Restaurant as RestaurantIcon,
    Group as GroupIcon,
    CalendarToday as CalendarIcon,
    HowToVote as VoteIcon,
    Fastfood as CuisineIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { groupAPI, sessionAPI, optionAPI } from '../services/api';

// Import existing components for modularity
import HomePageSkeleton from '../components/HomePageSkeleton';
import { theme } from '../theme/theme';

const ViewResults = () => {
    const [recentWins, setRecentWins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalWins: 0,
        totalVotes: 0,
        mostPopularCuisine: 'N/A'
    });
    const navigate = useNavigate();

    const fetchRecentWins = async () => {
        try {
            setLoading(true);
            
            // Fetch user's groups (assuming userId = 1)
            const userId = 1;
            const groupsResponse = await groupAPI.getUserGroups(userId);
            const userGroups = groupsResponse.data || [];
            
            // Fetch all sessions for user's groups
            let allCompletedSessions = [];
            
            for (const group of userGroups) {
                try {
                    const sessionsResponse = await sessionAPI.getGroupSessions(group.id);
                    const groupSessions = Array.isArray(sessionsResponse.data) 
                        ? sessionsResponse.data 
                        : (sessionsResponse.data?.data || []);
                    
                    // Filter for completed (locked) sessions and add group info
                    const completedSessions = groupSessions
                        .filter(session => session.locked)
                        .map(session => ({
                            ...session,
                            groupInfo: group
                        }));
                    
                    allCompletedSessions = [...allCompletedSessions, ...completedSessions];
                } catch (error) {
                    console.warn(`Failed to fetch sessions for group ${group.id}:`, error);
                }
            }

            // Sort by creation date (most recent first)
            allCompletedSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Get winners for each session
            const winsWithWinners = [];
            let totalVotes = 0;
            const cuisineCount = {};
            
            for (const session of allCompletedSessions.slice(0, 10)) { // Limit to 10 most recent
                try {
                    const optionsResponse = await optionAPI.getSessionOptions(session.id);
                    const options = optionsResponse.data || [];
                    
                    // Sort options by votes to find winner
                    const sortedOptions = options.sort((a, b) => b.votes - a.votes);
                    const winner = sortedOptions.length > 0 && sortedOptions[0].votes > 0 ? sortedOptions[0] : null;
                    
                    if (winner) {
                        // Calculate total votes for this session
                        const sessionVotes = options.reduce((sum, option) => sum + option.votes, 0);
                        totalVotes += sessionVotes;
                        
                        // Count cuisine types
                        if (winner.cuisine) {
                            cuisineCount[winner.cuisine] = (cuisineCount[winner.cuisine] || 0) + 1;
                        }
                        
                        winsWithWinners.push({
                            sessionId: session.id,
                            sessionTitle: session.title,
                            sessionDate: session.createdAt,
                            group: session.groupInfo,
                            winner: winner,
                            totalVotes: sessionVotes,
                            winPercentage: Math.round((winner.votes / sessionVotes) * 100)
                        });
                    }
                } catch (error) {
                    console.warn(`Failed to fetch options for session ${session.id}:`, error);
                }
            }
            
            // Find most popular cuisine
            const mostPopularCuisine = Object.keys(cuisineCount).length > 0 
                ? Object.entries(cuisineCount).reduce((max, [cuisine, count]) => 
                    count > max.count ? { cuisine, count } : max, { cuisine: 'N/A', count: 0 }).cuisine
                : 'N/A';
            
            setRecentWins(winsWithWinners);
            setStats({
                totalWins: winsWithWinners.length,
                totalVotes: totalVotes,
                mostPopularCuisine: mostPopularCuisine
            });
            
        } catch (error) {
            console.error('Failed to fetch recent wins:', error);
            toast.error('Failed to load recent results');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentWins();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return `${Math.floor(diffInDays / 30)} months ago`;
    };

    if (loading) {
        return <HomePageSkeleton />;
    }

    return (
        <Container maxWidth="lg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box sx={{ py: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{ mb: 3, color: 'white' }}
                    >
                        Back to Home
                    </Button>

                    {/* Header */}
                    <Card sx={{ 
                        mb: 4, 
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
                        color: theme.palette.getContrastText('#f8f9fa'),
                        borderRadius: 3
                    }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <TrophyIcon sx={{ fontSize: 60, mb: 2, color: '#ffd700' }} />
                            </motion.div>
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                🏆 Recent Winners 🏆
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Discover the dining champions from your recent votes
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Custom Stats Cards for ViewResults */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        gap: 3, 
                        mb: 6,
                        flexWrap: 'wrap',
                        '& > *': {
                            flex: '0 1 280px',
                            maxWidth: '320px'
                        }
                    }}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{
                                background: theme.palette.primary.light,
                                color: 'white',
                                height: '100%'
                            }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <TrophyIcon sx={{ fontSize: 40, mb: 2 }} />
                                    <Typography variant="h3" component="div" gutterBottom color='#f7f5ed'>
                                        {stats.totalWins}
                                    </Typography>
                                    <Typography variant="body1" color='#f7f5ed'>
                                        Recent Winners
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{
                                background: theme.palette.secondary.main,
                                color: 'white',
                                height: '100%'
                            }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <VoteIcon sx={{ fontSize: 40, mb: 2 }} />
                                    <Typography variant="h3" component="div" gutterBottom color='#f7f5ed'>
                                        {stats.totalVotes}
                                    </Typography>
                                    <Typography variant="body1" color='#f7f5ed'>
                                        Total Votes Cast
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card sx={{
                                background: '#71c9c2',
                                color: 'white',
                                height: '100%'
                            }}>
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <CuisineIcon sx={{ fontSize: 40, mb: 2 }} />
                                    <Typography variant="h3" component="div" gutterBottom color='#f7f5ed'>
                                        {stats.mostPopularCuisine}
                                    </Typography>
                                    <Typography variant="body1" color='#f7f5ed'>
                                        Top Cuisine
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Box>

                    {/* Recent Wins List */}
                    <Card sx={{ 
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <RestaurantIcon /> Recent Winners
                            </Typography>

                            {recentWins.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Avatar sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 3,
                                        bgcolor: 'grey.200',
                                        fontSize: 60
                                    }}>
                                        🤷‍♂️
                                    </Avatar>
                                    <Typography variant="h5" gutterBottom>
                                        No winners yet!
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Complete some voting sessions to see winners here.
                                    </Typography>
                                </Box>
                            ) : (
                                <List>
                                    {recentWins.map((win, index) => (
                                        <motion.div
                                            key={win.sessionId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Card
                                                sx={{
                                                    mb: 2,
                                                    background: index === 0 
                                                        ? 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)'
                                                        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                    border: index === 0 ? '2px solid gold' : '1px solid #e0e0e0',
                                                    borderRadius: 2
                                                }}
                                            >
                                                <ListItem sx={{ p: 3 }}>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{
                                                            bgcolor: index === 0 ? '#ff6b6b' : 'primary.main',
                                                            fontSize: 24,
                                                            width: 56,
                                                            height: 56
                                                        }}>
                                                            {index === 0 ? '👑' : '🏆'}
                                                        </Avatar>
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={
                                                            <Box>
                                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                                    {win.winner.name}
                                                                    {index === 0 && (
                                                                        <Chip 
                                                                            label="Latest Winner!" 
                                                                            size="small" 
                                                                            sx={{ ml: 1, bgcolor: '#ff6b6b', color: 'white' }}
                                                                        />
                                                                    )}
                                                                </Typography>
                                                                
                                                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                                                    <Chip 
                                                                        icon={<GroupIcon />}
                                                                        label={`${win.group.name} ${win.group.emojiIcon || ''}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                    <Chip 
                                                                        icon={<CalendarIcon />}
                                                                        label={getTimeAgo(win.sessionDate)}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                    {win.winner.cuisine && (
                                                                        <Chip 
                                                                            label={win.winner.cuisine}
                                                                            size="small"
                                                                            sx={{ bgcolor: 'primary.light', color: 'white' }}
                                                                        />
                                                                    )}
                                                                    {win.winner.priceRange && (
                                                                        <Chip 
                                                                            label={win.winner.priceRange}
                                                                            size="small"
                                                                            sx={{ bgcolor: 'success.light', color: 'white' }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                                
                                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                    Session: {win.sessionTitle}
                                                                </Typography>
                                                                
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    🗳️ {win.winner.votes} votes ({win.winPercentage}%) • Total: {win.totalVotes} votes
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />

                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        <IconButton
                                                            href={win.winner.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <LaunchIcon />
                                                        </IconButton>
                                                        <Button
                                                            size="small"
                                                            onClick={() => navigate(`/results/${win.sessionId}`)}
                                                            sx={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Box>
                                                </ListItem>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </motion.div>
        </Container>
    );
};

export default ViewResults;
