import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    LinearProgress
} from '@mui/material';
import {
    Launch as LaunchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ResultsList = ({ options, getPercentage }) => {
    const getMedalEmoji = (rank) => {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    const getGradientColor = (rank, votes) => {
        if (votes === 0) return 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)';

        switch(rank) {
            case 1: return 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)';
            case 2: return 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)';
            case 3: return 'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)';
            default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };

    return (
        <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3
        }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    📊 Complete Results
                </Typography>

                <List>
                    {options.map((option, index) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Paper
                                sx={{
                                    mb: 2,
                                    background: getGradientColor(index + 1, option.votes),
                                    color: option.votes === 0 ? 'text.secondary' : index < 3 ? 'black' : 'white',
                                    borderRadius: 2
                                }}
                            >
                                <ListItem sx={{ p: 3 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            fontSize: 24,
                                            fontWeight: 'bold'
                                        }}>
                                            {getMedalEmoji(index + 1)}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {option.name}
                                                </Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                    {option.votes} ({getPercentage(option.votes)}%)
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                {option.cuisine && (
                                                    <Chip
                                                        size="small"
                                                        label={option.cuisine}
                                                        sx={{
                                                            mr: 1,
                                                            mt: 1,
                                                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                                                            color: 'inherit'
                                                        }}
                                                    />
                                                )}
                                                {option.priceRange && (
                                                    <Chip
                                                        size="small"
                                                        label={option.priceRange}
                                                        sx={{
                                                            mr: 1,
                                                            mt: 1,
                                                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                                                            color: 'inherit'
                                                        }}
                                                    />
                                                )}

                                                <Box sx={{ mt: 2 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={getPercentage(option.votes)}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: option.votes === 0 ? 'grey.400' : 'rgba(255, 255, 255, 0.8)',
                                                                borderRadius: 4
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        }
                                    />

                                    <IconButton
                                        href={option.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ color: 'inherit' }}
                                    >
                                        <LaunchIcon />
                                    </IconButton>
                                </ListItem>
                            </Paper>
                        </motion.div>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default ResultsList;