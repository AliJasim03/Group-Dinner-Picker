import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const WelcomeHero = ({ userName = 'Alex' }) => {
    return (
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography 
                    variant="h1" 
                    component="h1" 
                    gutterBottom
                    sx={{
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        fontWeight: 700
                    }}
                >
                    Welcome back, {userName}! 👋
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 4, 
                        maxWidth: 600, 
                        mx: 'auto',
                        color: 'rgba(255, 255, 255, 0.9)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                >
                    Ready to discover your next amazing dining experience? Let's see what your groups are up to!
                </Typography>
            </motion.div>
        </Box>
    );
};

export default WelcomeHero;