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
    IconButton,
    Skeleton
} from '@mui/material';
import {
    Add as AddIcon,
    Group as GroupIcon,
    Poll as PollIcon,
    TrendingUp as TrendingIcon,
    Schedule as ScheduleIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { theme } from '../theme/theme';

const HomePage = () => {
    const [stats, setStats] = useState({
        activeVotes: 0,
        totalGroups: 0,
        weeklyWins: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate loading recent activity
        setTimeout(() => {
            setStats({
                activeVotes: 3,
                totalGroups: 4,
                weeklyWins: 2
            });

            setRecentActivity([
                {
                    id: 1,
                    type: 'vote',
                    title: 'Friday Team Lunch',
                    group: 'Work Team 💼',
                    time: '5 min ago',
                    status: 'active'
                },
                {
                    id: 2,
                    type: 'result',
                    title: 'Saturday Night Dinner',
                    group: 'Weekend Squad 🎉',
                    winner: 'Sushi Zen',
                    time: '1 hour ago',
                    status: 'completed'
                },
                {
                    id: 3,
                    type: 'new_session',
                    title: 'Sunday Family Meal',
                    group: 'Family Dinners 👨‍👩‍👧‍👦',
                    time: '3 hours ago',
                    status: 'pending'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const quickActions = [
        {
            title: 'Create Group',
            description: 'Start a new dining group',
            icon: <GroupIcon />,
            color: '#667eea',
            action: () => navigate('/groups/create')
        },
        {
            title: 'Join Vote',
            description: 'Participate in active voting',
            icon: <PollIcon />,
            color: '#f093fb',
            action: () => navigate('/groups')
        },
        {
            title: 'View Results',
            description: 'Check recent winners',
            icon: <TrophyIcon />,
            color: '#00d4aa',
            action: () => navigate('/groups')
        }
    ];

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Skeleton variant="text" width="60%" height={60} />
                    <Skeleton variant="text" width="40%" height={30} sx={{ mt: 2 }} />
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        {[1, 2, 3].map((item) => (
                            <Grid item xs={12} md={4} key={item}>
                                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4 }} />
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
                    {/* Hero Section */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h1" color={theme.palette.background.default} component="h1" gutterBottom>
                            Welcome back, Alex! 👋
                        </Typography>
                        <Typography variant="h6" color={theme.palette.background.paper} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                            Ready to discover your next amazing dining experience? Let's see what your groups are up to!
                        </Typography>

                        {/* Stats Cards */}
                        <Grid container spacing={3} sx={{ mb: 6 }}>
                            <Grid item xs={12} md={4}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Card sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <PollIcon sx={{ fontSize: 40, mb: 2 }} />
                                            <Typography variant="h3" component="div" gutterBottom>
                                                {stats.activeVotes}
                                            </Typography>
                                            <Typography variant="body1">
                                                Active Votes
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Card sx={{
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white',
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <GroupIcon sx={{ fontSize: 40, mb: 2 }} />
                                            <Typography variant="h3" component="div" gutterBottom>
                                                {stats.totalGroups}
                                            </Typography>
                                            <Typography variant="body1">
                                                Your Groups
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Card sx={{
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        color: 'white',
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <TrophyIcon sx={{ fontSize: 40, mb: 2 }} />
                                            <Typography variant="h3" component="div" gutterBottom>
                                                {stats.weeklyWins}
                                            </Typography>
                                            <Typography variant="body1">
                                                Weekly Wins
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Quick Actions */}
                    <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'white', textAlign: 'center' }}>
                        ⚡ Quick Actions
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {quickActions.map((action, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            '&:hover': {
                                                boxShadow: `0 12px 48px ${action.color}40`,
                                            }
                                        }}
                                        onClick={action.action}
                                    >
                                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                            <Avatar sx={{
                                                bgcolor: action.color,
                                                width: 60,
                                                height: 60,
                                                mx: 'auto',
                                                mb: 2,
                                                fontSize: 30
                                            }}>
                                                {action.icon}
                                            </Avatar>
                                            <Typography variant="h6" gutterBottom>
                                                {action.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {action.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Recent Activity */}
                    <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <TrendingIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="h5">
                                    🔥 Recent Activity
                                </Typography>
                            </Box>

                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        py: 2,
                                        borderBottom: index < recentActivity.length - 1 ? '1px solid #f0f0f0' : 'none'
                                    }}>
                                        <Avatar sx={{
                                            bgcolor: activity.status === 'active' ? '#00d4aa' :
                                                activity.status === 'completed' ? '#ffa726' : '#667eea',
                                            mr: 3
                                        }}>
                                            {activity.type === 'vote' ? '🗳️' :
                                                activity.type === 'result' ? '🏆' : '✨'}
                                        </Avatar>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {activity.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {activity.group} • {activity.time}
                                            </Typography>
                                            {activity.winner && (
                                                <Chip
                                                    label={`Winner: ${activity.winner}`}
                                                    size="small"
                                                    sx={{ mt: 1, bgcolor: '#ffd700', color: '#000' }}
                                                />
                                            )}
                                        </Box>

                                        <Chip
                                            label={activity.status}
                                            size="small"
                                            color={
                                                activity.status === 'active' ? 'success' :
                                                    activity.status === 'completed' ? 'warning' : 'primary'
                                            }
                                        />
                                    </Box>
                                </motion.div>
                            ))}

                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/groups')}
                                    sx={{ borderRadius: '20px' }}
                                >
                                    View All Groups
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </motion.div>
        </Container>
    );
};

export default HomePage;
