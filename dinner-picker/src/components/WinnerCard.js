import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip,
    Button,
    Grid
} from '@mui/material';
import {
    Launch as LaunchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const WinnerCard = ({ winner, getPercentage }) => {
    if (!winner) return null;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
        >
            <Card sx={{
                mb: 4,
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
                color: 'black',
                border: '4px solid gold',
                position: 'relative',
                borderRadius: 3
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                            🏆 WINNER! 🏆
                        </Typography>
                    </Box>

                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4} textAlign="center">
                            <Avatar sx={{
                                width: 100,
                                height: 100,
                                mx: 'auto',
                                mb: 2,
                                bgcolor: 'rgba(0, 0, 0, 0.1)',
                                fontSize: 40
                            }}>
                                🥇
                            </Avatar>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                                {winner.name}
                            </Typography>

                            {winner.cuisine && (
                                <Chip
                                    label={winner.cuisine}
                                    sx={{ mr: 1, mb: 1, bgcolor: 'rgba(0, 0, 0, 0.1)' }}
                                />
                            )}
                            {winner.priceRange && (
                                <Chip
                                    label={winner.priceRange}
                                    sx={{ mr: 1, mb: 1, bgcolor: 'rgba(0, 0, 0, 0.1)' }}
                                />
                            )}

                            <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
                                🗳️ {winner.votes} votes ({getPercentage(winner.votes)}%)
                            </Typography>

                            <Button
                                variant="contained"
                                endIcon={<LaunchIcon />}
                                href={winner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: '#ff6b6b',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#ee5a24' }
                                }}
                            >
                                Visit Restaurant
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default WinnerCard;