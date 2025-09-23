import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Chip, Button } from '@mui/material';
import { TrendingUp as TrendingIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { theme } from '../theme/theme';

const RecentActivity = ({ recentActivity, onViewAllGroups }) => {
    return (
        <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
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
                            borderBottom: index < recentActivity.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                            borderRadius: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                transform: 'translateX(4px)'
                            }
                        }}>
                            <Avatar sx={{
                                bgcolor: activity.status === 'active' ? theme.palette.success.main :
                                    activity.status === 'completed' ? theme.palette.warning.main : 
                                    theme.palette.primary.main,
                                mr: 3,
                                width: 48,
                                height: 48,
                                fontSize: '1.2rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
                                        sx={{ 
                                            mt: 1, 
                                            bgcolor: '#ffd700', 
                                            color: '#000',
                                            fontWeight: 600,
                                            '&:hover': {
                                                bgcolor: '#ffed4e'
                                            }
                                        }}
                                    />
                                )}
                            </Box>

                            <Chip
                                label={activity.status}
                                size="small"
                                sx={{
                                    backgroundColor: activity.status === 'active' ? theme.palette.success.light :
                                        activity.status === 'completed' ? theme.palette.warning.light : 
                                        theme.palette.primary.light,
                                    color: activity.status === 'active' ? theme.palette.success.dark :
                                        activity.status === 'completed' ? theme.palette.warning.dark : 
                                        theme.palette.primary.dark,
                                    fontWeight: 600,
                                    textTransform: 'capitalize'
                                }}
                            />
                        </Box>
                    </motion.div>
                ))}

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={onViewAllGroups}
                        sx={{ 
                            borderRadius: '20px',
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                borderColor: theme.palette.primary.dark,
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        View All Groups
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RecentActivity;