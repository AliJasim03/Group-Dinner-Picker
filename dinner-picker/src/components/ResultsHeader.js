import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button
} from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    Share as ShareIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { theme } from '../theme/theme';

const ResultsHeader = ({ 
    session, 
    options, 
    totalVotes, 
    onShareClick, 
    onExportClick 
}) => {
    return (
        <Card sx={{
            mb: 4,
            background: session.group?.colorTheme ?
                `linear-gradient(135deg, ${session.group.colorTheme} 0%, ${session.group.colorTheme}90 100%)` :
                'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            color: theme.palette.getContrastText(session.group?.colorTheme || '#f8f9fa'),
            borderRadius: 3
        }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, ease: "linear" }}
                    style={{ display: 'inline-block' }}
                >
                    <TrophyIcon sx={{ fontSize: 80, mb: 2, color: '#ffd700' }} />
                </motion.div>
                
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                    🎉 Final Results 🎉
                </Typography>
                
                <Typography variant="h5" gutterBottom>
                    {session.title}
                </Typography>
                
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                    {session.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                        label={`${options.length} restaurants`}
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.9)', 
                            color: session.group?.colorTheme || '#1976d2',
                            fontWeight: 'bold'
                        }}
                    />
                    <Chip
                        label={`${totalVotes} total votes`}
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.9)', 
                            color: session.group?.colorTheme || '#1976d2',
                            fontWeight: 'bold'
                        }}
                    />
                    <Chip
                        label={new Date().toLocaleDateString()}
                        sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.9)', 
                            color: session.group?.colorTheme || '#1976d2',
                            fontWeight: 'bold'
                        }}
                    />
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<ShareIcon />}
                        onClick={onShareClick}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}
                    >
                        Share Results
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={onExportClick}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }}
                    >
                        Export
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ResultsHeader;