import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material';
import {
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';

const HistoryTab = ({ completedSessions = [] }) => {
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
                📚
            </Avatar>
            <Typography variant="h6" color="text.secondary">
                No completed sessions yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your group's voting history will appear here once sessions are completed.
            </Typography>
        </Box>
    );

    const HistoryList = () => (
        <List>
            {completedSessions.map((session) => (
                <ListItem 
                    key={session.id} 
                    sx={{ 
                        borderRadius: 2, 
                        mb: 2, 
                        backgroundColor: 'grey.50',
                        '&:hover': {
                            backgroundColor: 'grey.100',
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#ffa726' }}>
                            <TrophyIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={session.title}
                        secondary={
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    {session.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Completed on {new Date(session.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Card sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrophyIcon color="warning" />
                    Session History ({completedSessions.length})
                </Typography>
                {completedSessions.length === 0 ? <EmptyState /> : <HistoryList />}
            </CardContent>
        </Card>
    );
};

export default HistoryTab;