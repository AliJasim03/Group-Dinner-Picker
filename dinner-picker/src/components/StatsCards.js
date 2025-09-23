import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Poll as PollIcon, Group as GroupIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { theme } from '../theme/theme';

const StatsCards = ({ stats }) => {
    const statsData = [
        {
            icon: <PollIcon sx={{ fontSize: 40, mb: 2 }} />,
            value: stats.activeVotes,
            label: 'Active Votes',
            background: theme.palette.primary.light
        },
        {
            icon: <GroupIcon sx={{ fontSize: 40, mb: 2 }} />,
            value: stats.totalGroups,
            label: 'Your Groups',
            background: theme.palette.secondary.main
        },
        {
            icon: <TrophyIcon sx={{ fontSize: 40, mb: 2 }} />,
            value: stats.weeklyWins,
            label: 'Weekly Wins',
            background: '#00f2fe'
        }
    ];

    return (
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
            {statsData.map((stat, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }}>
                    <Card sx={{
                        background: stat.background,
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            {stat.icon}
                            <Typography variant="h3" component="div" gutterBottom>
                                {stat.value}
                            </Typography>
                            <Typography variant="body1">
                                {stat.label}
                            </Typography>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </Box>
    );
};

export default StatsCards;