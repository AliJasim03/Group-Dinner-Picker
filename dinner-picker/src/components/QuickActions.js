import React from 'react';
import { Typography, Box, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const QuickActions = ({ quickActions }) => {
    return (
        <>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    mb: 3, 
                    color: 'white', 
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    fontWeight: 600
                }}
            >
                ⚡ Quick Actions
            </Typography>

            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                gap: 3, 
                mb: 6,
                flexWrap: 'wrap',
                '& > *': {
                    flex: '1 1 300px',
                    minWidth: '280px'
                }
            }}>
                {quickActions.map((action, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        style={{ flex: '1 1 300px', minWidth: '280px' }}
                    >
                        <Card
                            sx={{
                                cursor: 'pointer',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 4,
                                transition: 'all 0.3s ease-in-out',
                                height: '100%',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 1)',
                                    boxShadow: `0 12px 48px ${action.color}40`,
                                    transform: 'translateY(-4px)',
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
                ))}
            </Box>
        </>
    );
};

export default QuickActions;