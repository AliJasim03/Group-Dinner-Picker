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
    Collapse
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

    const handleVote = async (delta) => {
        if (isVoting || votingLocked || sessionLocked) return;

        setIsVoting(true);
        await onVote(proposal.id, delta);

        if (delta > 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        setTimeout(() => setIsVoting(false), 500);
    };

    const getPriceColor = (priceRange) => {
        switch(priceRange) {
            case '$': return '#4caf50';
            case '$$': return '#ff9800';
            case '$$$': return '#f44336';
            default: return '#666';
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
                whileHover={!votingLocked && !sessionLocked ? { y: -8 } : {}}
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
                            '0 20px 60px rgba(255, 215, 0, 0.4)' :
                            '0 8px 32px rgba(0,0,0,0.08)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Winner Badge */}
                    {isWinning && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, type: 'spring' }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                zIndex: 10,
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                                borderRadius: '50%',
                                width: 60,
                                height: 60,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)'
                            }}>
                                <TrophyIcon sx={{ color: 'white', fontSize: 30 }} />
                            </Box>
                        </motion.div>
                    )}

                    <Box sx={{ display: 'flex', minHeight: hasImage ? 180 : 'auto' }}>
                        {/* Image Section */}
                        {hasImage && (
                            <CardMedia
                                component="img"
                                sx={{
                                    width: 200,
                                    height: 180,
                                    objectFit: 'cover',
                                    borderRadius: '16px 0 0 16px'
                                }}
                                image={proposal.imageUrl}
                                alt={proposal.name}
                            />
                        )}

                        {/* Content Section */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                            <Chip
                                                label={`#${rank}`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    bgcolor: isWinning ? 'rgba(0,0,0,0.1)' : 'primary.main',
                                                    color: isWinning ? 'black' : 'white'
                                                }}
                                            />

                                            {proposal.cuisine && (
                                                <Chip
                                                    icon={<RestaurantIcon />}
                                                    label={proposal.cuisine}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.75rem' }}
                                                />
                                            )}

                                            {proposal.priceRange && (
                                                <Chip
                                                    icon={<MoneyIcon />}
                                                    label={proposal.priceRange}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: getPriceColor(proposal.priceRange),
                                                        color: 'white',
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="h5" component="h2" sx={{
                                            fontWeight: 700,
                                            color: isWinning ? 'black' : 'inherit',
                                            mb: 1
                                        }}>
                                            {proposal.name}
                                        </Typography>

                                        <Link
                                            href={proposal.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2,
                                                textDecoration: 'none',
                                                color: 'primary.main',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    color: 'primary.dark'
                                                }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ mr: 1 }}>
                                                View Menu & Info
                                            </Typography>
                                            <LaunchIcon fontSize="small" />
                                        </Link>
                                    </Box>

                                    {/* Vote Display */}
                                    <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                                        <motion.div
                                            animate={{ scale: isVoting ? 1.2 : 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: proposal.votes > 0 ? '#00d4aa' : 'text.secondary',
                                                    textShadow: proposal.votes > 10 ? '0 2px 10px rgba(0, 212, 170, 0.3)' : 'none'
                                                }}
                                            >
                                                {proposal.votes}
                                            </Typography>
                                        </motion.div>
                                        <Typography variant="caption" color="text.secondary">
                                            {proposal.votes === 1 ? 'vote' : 'votes'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Voting Buttons */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {!votingLocked && !sessionLocked && (
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
                                                            disabled={isVoting || proposal.votes === 0}
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
                                        )}
                                    </Box>

                                    {(votingLocked || sessionLocked) && (
                                        <Chip
                                            label={sessionLocked ? "Session Locked" : "Voting Locked"}
                                            size="small"
                                            color="warning"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    )}

                                    <Typography variant="caption" color="text.secondary">
                                        Added {new Date(proposal.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Box>
                    </Box>
                </Card>
            </motion.div>
        </>
    );
};

export default ModernProposalCard;
