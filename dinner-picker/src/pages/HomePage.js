import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { Group as GroupIcon, Poll as PollIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Import modular components
import WelcomeHero from '../components/WelcomeHero';
import StatsCards from '../components/StatsCards';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import HomePageSkeleton from '../components/HomePageSkeleton';

// Import API services
import { groupAPI, sessionAPI } from '../services/api';

const HomePage = () => {
    const [stats, setStats] = useState({
        activeVotes: 0,
        totalGroups: 0,
        weeklyWins: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // Function to calculate weekly wins (sessions completed in the last 7 days)
    const calculateWeeklyWins = (sessions) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return sessions.filter(session => {
            // Check if session is locked (completed) and was created in the last week
            if (!session.locked || !session.createdAt) return false;
            
            const sessionDate = new Date(session.createdAt);
            return sessionDate >= oneWeekAgo;
        }).length;
    };

    // Fetch real data from backend
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Assuming single user application with userId = 1
            const userId = 1;
            
            // Fetch user's groups
            const groupsResponse = await groupAPI.getUserGroups(userId);
            const userGroups = groupsResponse.data || [];
            
            // Fetch all sessions for user's groups
            let allSessions = [];
            let activeSessions = [];
            
            for (const group of userGroups) {
                try {
                    const sessionsResponse = await sessionAPI.getGroupSessions(group.id);
                    // Handle different response formats - sessions endpoint returns direct array
                    const groupSessions = Array.isArray(sessionsResponse.data) 
                        ? sessionsResponse.data 
                        : (sessionsResponse.data?.data || []);
                    
                    // Add group information to each session since it's not included in the API response
                    const sessionsWithGroup = groupSessions.map(session => ({
                        ...session,
                        groupInfo: group // Add the full group object
                    }));
                    
                    allSessions = [...allSessions, ...sessionsWithGroup];
                    
                    // Filter for active (unlocked) sessions
                    const activeGroupSessions = sessionsWithGroup.filter(session => !session.locked);
                    activeSessions = [...activeSessions, ...activeGroupSessions];
                } catch (sessionError) {
                    console.warn(`Failed to fetch sessions for group ${group.id}:`, sessionError);
                    // Continue with other groups even if one fails
                }
            }

            // Calculate stats
            const weeklyWins = calculateWeeklyWins(allSessions);

            setStats({
                activeVotes: activeSessions.length,
                totalGroups: userGroups.length,
                weeklyWins: weeklyWins
            });

            // Generate recent activity from recent sessions
            const recentSessions = allSessions
                .filter(session => session.createdAt) // Only sessions with valid creation date
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                .map(session => {
                    const group = session.groupInfo; // Use the group info we added
                    const createdAt = new Date(session.createdAt);
                    const timeAgo = getTimeAgo(createdAt);
                    
                    return {
                        id: session.id,
                        type: session.locked ? 'result' : 'vote',
                        title: session.title || 'Untitled Session',
                        group: group ? `${group.name} ${group.emojiIcon || '🍽️'}` : 'Unknown Group',
                        time: timeAgo,
                        status: session.locked ? 'completed' : 'active'
                    };
                });

            setRecentActivity(recentSessions);

            // If no recent activity, show a placeholder
            if (recentSessions.length === 0) {
                setRecentActivity([
                    {
                        id: 'placeholder',
                        type: 'placeholder',
                        title: 'No recent activity',
                        group: 'Get started by creating a group!',
                        time: '',
                        status: 'pending'
                    }
                ]);
            }

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setError(error.message || 'Failed to load dashboard data');
            toast.error('Failed to load dashboard data');
            
            // Fallback to default data in case of error
            setStats({
                activeVotes: 0,
                totalGroups: 0,
                weeklyWins: 0
            });
            setRecentActivity([]);
            
        } finally {
            setLoading(false);
        }
    };

    // Helper function to calculate time ago
    const getTimeAgo = (date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    useEffect(() => {
        fetchDashboardData();
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
            action: () => navigate('/results')
        }
    ];

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
                <Box sx={{ py: 6 }}>
                    <WelcomeHero userName="Alex" />
                    <StatsCards stats={stats} />
                    <QuickActions quickActions={quickActions} />
                    <RecentActivity 
                        recentActivity={recentActivity} 
                        onViewAllGroups={() => navigate('/groups')}
                    />
                </Box>
            </motion.div>
        </Container>
    );
};

export default HomePage;
