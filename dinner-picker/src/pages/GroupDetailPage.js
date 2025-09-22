import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Grid,
    Avatar,
    Chip,
    Fab,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Badge,
    LinearProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Poll as PollIcon,
    History as HistoryIcon,
    People as PeopleIcon,
    Schedule as ScheduleIcon,
    EmojiEvents as TrophyIcon,
    Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { groupAPI, sessionAPI } from '../services/api';

const GroupDetailPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const [groupResponse, sessionsResponse] = await Promise.all([
                groupAPI.getGroup(groupId),
                sessionAPI.getGroupSessions(groupId)
            ]);

            setGroup(groupResponse.data);
            setSessions(sessionsResponse.data);
        } catch (error) {
            toast.error('Failed to load group data');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    const getSessionStatus = (session) => {
        if (session.locked) return 'completed';
        if (session.deadline && new Date(session.deadline) < new Date()) return 'expired';
        return 'active';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#00d4aa';
            case 'completed': return '#ffa726';
            case 'expired': return '#f44336';
            default: return '#666';
        }
    };

    const activeSessions = sessions.filter(s => getSessionStatus(s) === 'active');
    const completedSessions = sessions.filter(s => getSessionStatus(s) === 'completed');

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <LinearProgress sx={{ mb: 4, borderRadius: 2, height: 4 }} />
                    <Typography variant="h4" sx={{ color: 'white' }}>Loading group...</Typography>
                </Box>
            </Container>
        );
    }

    if (!group) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'white' }}>Group not found</Typography>
                    <Button onClick={() => navigate('/groups')} sx={{ mt: 2, color: 'white' }}>
                        Back to Groups
                    </Button>
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
                <Box sx={{ py: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/groups')}
                        sx={{ mb: 3, color: 'white' }}
                    >
                        Back to Groups
                    </Button>

                    {/* Group Header */}
                    <Card sx={{
                        mb: 4,
                        background: group.colorTheme ?
                            `linear-gradient(135deg, ${group.colorTheme} 0%, ${group.colorTheme}90 100%)` :
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    width: 80,
                                    height: 80,
                                    fontSize: 40,
                                    mr: 3
                                }}>
                                    {group.emojiIcon || '🍽️'}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                        {group.name}
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                                        {group.description || 'No description'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            icon={<PeopleIcon />}
                                            label={`${group.members?.length || 0} members`}
                                            sx={{
                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                color: 'white',
                                                '& .MuiChip-icon': { color: 'white' }
                                            }}
                                        />
                                        <Chip
                                            icon={<ScheduleIcon />}
                                            label={`${activeSessions.length} active sessions`}
                                            sx={{
                                                bgcolor: 'rgba(76, 217, 100, 0.8)',
                                                color: 'white',
                                                '& .MuiChip-icon': { color: 'white' }
                                            }}
                                        />
                                        <Chip
                                            icon={<TrophyIcon />}
                                            label={`${completedSessions.length} completed`}
                                            sx={{
                                                bgcolor: 'rgba(255, 167, 38, 0.8)',
                                                color: 'white',
                                                '& .MuiChip-icon': { color: 'white' }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => setActiveTab(newValue)}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    height: 3,
                                    borderRadius: 2
                                }
                            }}
                        >
                            <Tab
                                label={
                                    <Badge badgeContent={activeSessions.length} color="success">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PollIcon />
                                            Active Sessions
                                        </Box>
                                    </Badge>
                                }
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HistoryIcon />
                                        History
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PeopleIcon />
                                        Members
                                    </Box>
                                }
                            />
                        </Tabs>
                    </Card>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 0 && (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                    <CardContent>
                                        {activeSessions.length === 0 ? (
                                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                                <Avatar sx={{
                                                    width: 100,
                                                    height: 100,
                                                    mx: 'auto',
                                                    mb: 3,
                                                    bgcolor: 'grey.200',
                                                    fontSize: 50
                                                }}>
                                                    📊
                                                </Avatar>
                                                <Typography variant="h5" gutterBottom>
                                                    No active sessions
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                                    Start a new voting session to help your group decide where to eat!
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => navigate(`/groups/${groupId}/sessions/create`)}
                                                    sx={{
                                                        borderRadius: '25px',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    }}
                                                >
                                                    Create Session
                                                </Button>
                                            </Box>
                                        ) : (
                                            <List>
                                                {activeSessions.map((session, index) => (
                                                    <motion.div
                                                        key={session.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                                    >
                                                        <ListItem
                                                            sx={{
                                                                borderRadius: 2,
                                                                mb: 2,
                                                                backgroundColor: 'grey.50',
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    backgroundColor: 'grey.100',
                                                                    transform: 'translateX(8px)',
                                                                },
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onClick={() => navigate(`/sessions/${session.id}`)}
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: getStatusColor(getSessionStatus(session)) }}>
                                                                    <RestaurantIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={session.title}
                                                                secondary={
                                                                    <Box>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {session.description}
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                                            <Chip size="small" label={`${session.options?.length || 0} options`} />
                                                                            {session.deadline && (
                                                                                <Chip
                                                                                    size="small"
                                                                                    label={`Ends ${new Date(session.deadline).toLocaleDateString()}`}
                                                                                    color="warning"
                                                                                />
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                    </motion.div>
                                                ))}
                                            </List>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 1 && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                    <CardContent>
                                        {completedSessions.length === 0 ? (
                                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                                <Typography variant="h6" color="text.secondary">
                                                    No completed sessions yet
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <List>
                                                {completedSessions.map((session) => (
                                                    <ListItem key={session.id} sx={{ borderRadius: 2, mb: 2, backgroundColor: 'grey.50' }}>
                                                        <ListItemAvatar>
                                                            <Avatar sx={{ bgcolor: '#ffa726' }}>
                                                                <TrophyIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={session.title}
                                                            secondary={`Completed on ${new Date(session.createdAt).toLocaleDateString()}`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 2 && (
                            <motion.div
                                key="members"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Group Members ({group.members?.length || 0})
                                        </Typography>
                                        <List>
                                            {group.members?.map((member) => (
                                                <ListItem key={member.id}>
                                                    <ListItemAvatar>
                                                        <Avatar>{member.avatar || '👤'}</Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={member.name}
                                                        secondary={member.email}
                                                    />
                                                </ListItem>
                                            )) || (
                                                <Typography color="text.secondary">No members found</Typography>
                                            )}
                                        </List>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </motion.div>

            <Fab
                color="primary"
                aria-label="create session"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                onClick={() => navigate(`/groups/${groupId}/sessions/create`)}
            >
                <AddIcon />
            </Fab>
        </Container>
    );
};

export default GroupDetailPage;
