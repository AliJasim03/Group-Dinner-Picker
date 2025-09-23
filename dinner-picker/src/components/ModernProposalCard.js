import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    IconButton,
    Link,
    Avatar,
    Tooltip,
    Zoom,
    Collapse,
    LinearProgress
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Launch as LaunchIcon,
    EmojiEvents as TrophyIcon,
    Restaurant as RestaurantIcon,
    AttachMoney as MoneyIcon,
    Expand as ExpandIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const ModernProposalCard = ({ proposal, rank, onVote, votingLocked, sessionLocked }) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isVoting, setIsVoting] = useState(false);

    const isWinning = rank === 1 && proposal.votes > 0;
    const hasImage = proposal.imageUrl && proposal.imageUrl.trim() !== '';
    const votes = proposal.votes || 0;

    const handleVote = async (delta) => {
        if (isVoting || votingLocked || sessionLocked) {
            console.log('Vote blocked:', { isVoting, votingLocked, sessionLocked });
            return;
        }

        console.log('Processing vote:', { proposalId: proposal.id, delta });

        setIsVoting(true);

        try {
            await onVote(proposal.id, delta);

            if (delta > 0) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2000);
            }
        } catch (error) {
            console.error('Error in vote handler:', error);
        } finally {
            // Add a small delay to prevent rapid clicking
            setTimeout(() => setIsVoting(false), 800);
        }
    };

    const getPriceColor = (priceRange) => {
        switch(priceRange) {
            case '$': return '#4caf50';
            case '$$': return '#ff9800';
            case '$$$': return '#f44336';
            default: return '#666';
        }
    };

    const getRankColor = (rank) => {
        switch(rank) {
            case 1: return '#ffd700'; // Gold
            case 2: return '#c0c0c0'; // Silver
            case 3: return '#cd7f32'; // Bronze
            default: return '#667eea';
        }
    };

    const getRankEmoji = (rank) => {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    return (
        <>
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={50}
                    recycle={false}
                    gravity={0.3}
                />
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={!votingLocked && !sessionLocked ? { y: -4 } : {}}
            >
                <Card
                    sx={{
                        mb: 3,
                        position: 'relative',
                        background: isWinning ?
                            'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)' :
                            'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: isWinning ? '3px solid gold' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: isWinning ?
                            '0 20px 40px rgba(255, 215, 0, 0.3)' :
                            '0 8px 32px rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >


                    {/* Winner Trophy */}
                    {isWinning && (
                        <motion.div
                            animate={{
                                rotate: [0, -10, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                zIndex: 2
                            }}
                        >
                            <TrophyIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />
                        </motion.div>
                    )}

                    <CardContent sx={{ p: 3 }}>
                        {/* Restaurant Image */}
                        {hasImage && (
                            <Box sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={proposal.imageUrl}
                                    alt={proposal.name}
                                    sx={{
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {/* Restaurant Info */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ flex: 1, mr: 2 }}>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        color: isWinning ? '#000' : 'text.primary',
                                        lineHeight: 1.2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {proposal.name}
                                    <Box
                                        sx={{
                                            bgcolor: getRankColor(rank),
                                            color: rank <= 3 ? '#000' : '#fff',
                                            borderRadius: '50%',
                                            width: 32,
                                            height: 32,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                            flexShrink: 0
                                        }}
                                    >
                                        {getRankEmoji(rank)}
                                    </Box>
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                    {proposal.cuisine && (
                                        <Chip
                                            label={proposal.cuisine}
                                            size="small"
                                            sx={{ bgcolor: 'primary.light', color: 'white' }}
                                        />
                                    )}
                                    {proposal.priceRange && (
                                        <Chip
                                            icon={<MoneyIcon />}
                                            label={proposal.priceRange}
                                            size="small"
                                            sx={{
                                                bgcolor: getPriceColor(proposal.priceRange),
                                                color: 'white'
                                            }}
                                        />
                                    )}
                                </Box>

                                <Link
                                    href={proposal.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: isWinning ? '#000' : 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Visit Website <LaunchIcon fontSize="small" />
                                </Link>
                            </Box>

                            {/* Vote Display */}
                            <Box sx={{
                                textAlign: 'center',
                                minWidth: 80,
                                bgcolor: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 2,
                                p: 2
                            }}>
                                <motion.div
                                    animate={votes > 10 ? {
                                        scale: [1, 1.1, 1],
                                        textShadow: [
                                            '0 2px 10px rgba(0, 212, 170, 0.3)',
                                            '0 4px 20px rgba(0, 212, 170, 0.6)',
                                            '0 2px 10px rgba(0, 212, 170, 0.3)'
                                        ]
                                    } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            fontWeight: 800,
                                            color: votes > 0 ? '#00d4aa' : 'text.secondary',
                                            textShadow: votes > 10 ? '0 2px 10px rgba(0, 212, 170, 0.3)' : 'none'
                                        }}
                                    >
                                        {votes}
                                    </Typography>
                                </motion.div>
                                <Typography variant="caption" color="text.secondary">
                                    {votes === 1 ? 'vote' : 'votes'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Voting Progress Bar */}
                        {votes > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(votes * 10, 100)} // Scale for visual effect
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: isWinning ? '#ff6b6b' : '#00d4aa',
                                            borderRadius: 3
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {/* Voting Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {!votingLocked && !sessionLocked ? (
                                    <>
                                        <Tooltip title="Vote up" TransitionComponent={Zoom}>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <IconButton
                                                    onClick={() => handleVote(1)}
                                                    disabled={isVoting}
                                                    sx={{
                                                        bgcolor: 'success.main',
                                                        color: 'white',
                                                        '&:hover': {
                                                            bgcolor: 'success.dark',
                                                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                                                        },
                                                        '&:disabled': {
                                                            bgcolor: 'grey.300'
                                                        }
                                                    }}
                                                >
                                                    <ThumbUpIcon />
                                                </IconButton>
                                            </motion.div>
                                        </Tooltip>

                                        <Tooltip title="Vote down" TransitionComponent={Zoom}>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <IconButton
                                                    onClick={() => handleVote(-1)}
                                                    disabled={isVoting || votes === 0}
                                                    sx={{
                                                        bgcolor: 'error.main',
                                                        color: 'white',
                                                        '&:hover': {
                                                            bgcolor: 'error.dark',
                                                            boxShadow: '0 6px 20px rgba(244, 67, 54, 0.4)'
                                                        },
                                                        '&:disabled': {
                                                            bgcolor: 'grey.300'
                                                        }
                                                    }}
                                                >
                                                    <ThumbDownIcon />
                                                </IconButton>
                                            </motion.div>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <Chip
                                        label={sessionLocked ? "Session Locked" : "Voting Locked"}
                                        size="small"
                                        color="warning"
                                        icon={<RestaurantIcon />}
                                    />
                                )}
                            </Box>

                            {/* Status Indicators */}
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                {isVoting && (
                                    <Chip
                                        label="Processing..."
                                        size="small"
                                        color="info"
                                        sx={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                                    />
                                )}
                                {isWinning && (
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                    >
                                        <Chip
                                            label="Leading!"
                                            size="small"
                                            sx={{
                                                bgcolor: '#ff6b6b',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </>
    );
};

export default ModernProposalCard;