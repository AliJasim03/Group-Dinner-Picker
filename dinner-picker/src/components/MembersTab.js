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
    ListItemAvatar,
    Chip
} from '@mui/material';
import {
    People as PeopleIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';

const MembersTab = ({ members = [] }) => {
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
                👥
            </Avatar>
            <Typography variant="h6" color="text.secondary">
                No members found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Invite people to join your group to get started with voting!
            </Typography>
            <Chip
                icon={<PersonAddIcon />}
                label="Invite Members"
                variant="outlined"
                sx={{ mt: 2 }}
                clickable
            />
        </Box>
    );

    const MembersList = () => (
        <List>
            {members.map((member) => (
                <ListItem 
                    key={member.id} 
                    sx={{ 
                        borderRadius: 2, 
                        mb: 1, 
                        backgroundColor: 'grey.50',
                        '&:hover': {
                            backgroundColor: 'grey.100',
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    <ListItemAvatar>
                        <Avatar sx={{ 
                            bgcolor: 'primary.main',
                            color: 'white'
                        }}>
                            {member.avatar || member.name?.charAt(0) || '👤'}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {member.name || 'Unknown User'}
                                </Typography>
                                {member.isAdmin && (
                                    <Chip 
                                        label="Admin" 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        }
                        secondary={
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    {member.email || 'No email provided'}
                                </Typography>
                                {member.joinedAt && (
                                    <Typography variant="caption" color="text.secondary">
                                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                                    </Typography>
                                )}
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon color="primary" />
                        Group Members ({members.length})
                    </Typography>
                    {members.length > 0 && (
                        <Chip
                            icon={<PersonAddIcon />}
                            label="Invite More"
                            variant="outlined"
                            size="small"
                            clickable
                        />
                    )}
                </Box>
                {members.length === 0 ? <EmptyState /> : <MembersList />}
            </CardContent>
        </Card>
    );
};

export default MembersTab;