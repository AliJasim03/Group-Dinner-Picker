import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Avatar,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material';
import {
    Add as AddIcon,
    Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ActiveSessionsTab = ({ 
    activeSessions = [], 
    groupId, 
    getSessionStatus,
    getStatusColor 
}) => {
    const navigate = useNavigate();

    const EmptyState = () => (
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
    );

    const SessionsList = () => (
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
                                        <Chip 
                                            size="small" 
                                            label={`${session.options?.length || 0} options`} 
                                        />
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
    );

    return (
        <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent>
                {activeSessions.length === 0 ? <EmptyState /> : <SessionsList />}
            </CardContent>
        </Card>
    );
};

export default ActiveSessionsTab;