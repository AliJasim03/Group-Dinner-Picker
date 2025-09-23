import React from 'react';
import {
    Card,
    Tabs,
    Tab,
    Box,
    Badge
} from '@mui/material';
import {
    Poll as PollIcon,
    History as HistoryIcon,
    People as PeopleIcon
} from '@mui/icons-material';

const GroupTabs = ({ 
    activeTab, 
    onTabChange, 
    activeSessions = [], 
    completedSessions = [], 
    members = [] 
}) => {
    return (
        <Card sx={{ mb: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
            <Tabs
                value={activeTab}
                onChange={(e, newValue) => onTabChange(newValue)}
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
                        <Badge badgeContent={completedSessions.length} color="warning">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HistoryIcon />
                                History
                            </Box>
                        </Badge>
                    }
                />
                <Tab
                    label={
                        <Badge badgeContent={members.length} color="primary">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PeopleIcon />
                                Members
                            </Box>
                        </Badge>
                    }
                />
            </Tabs>
        </Card>
    );
};

export default GroupTabs;