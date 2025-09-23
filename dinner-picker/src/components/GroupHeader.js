import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip
} from '@mui/material';
import {
    People as PeopleIcon,
    Schedule as ScheduleIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';

const GroupHeader = ({ 
    group, 
    activeSessions = [], 
    completedSessions = [] 
}) => {
    if (!group) return null;

    return (
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
    );
};

export default GroupHeader;