import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    LinearProgress,
    Alert,
    Snackbar
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Lock as LockIcon,
    LockOpen as UnlockIcon,
    Poll as PollIcon,
    EmojiEvents as TrophyIcon,
    Schedule as ScheduleIcon,
    Group as GroupIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import ModernProposalCard from '../components/ModernProposalCard';
import { sessionAPI, optionAPI } from '../services/api';
import LockSessionDialog from '../dialogs/LockSessionDialog';
import FloatingActionButton from '../components/FloatingActionButton';

const VotingSessionPage = () => {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lockDialogOpen, setLockDialogOpen] = useState(false);
    const [showWinnerConfetti, setShowWinnerConfetti] = useState(false);
    const [votingInProgress, setVotingInProgress] = useState(false);
    const navigate = useNavigate();

    // Function to determine if a color is light or dark
    const isLightColor = (hexColor) => {
        if (!hexColor) return true; // Default light background
        
        // Remove # if present
        const color = hexColor.replace('#', '');
        
        // Convert to RGB
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        
        // Calculate relative luminance using W3C formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return true only for very light colors (luminance > 0.8)
        return luminance > 0.8;
    };

    const getHeaderColors = (colorTheme) => {
        const isLight = isLightColor(colorTheme);
        
        return {
            text: isLight ? '#1a1a1a' : 'white',
            chipBg: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            chipText: isLight ? '#1a1a1a' : 'white',
            avatarBg: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            buttonBg: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            buttonHover: isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)'
        };
    };

    const fetchSessionData = useCallback(async (showLoadingState = true) => {
        try {
            if (showLoadingState) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            console.log('Fetching session data for ID:', sessionId);

            const [sessionResponse, optionsResponse] = await Promise.all([
                sessionAPI.getSession(sessionId),
                optionAPI.getSessionOptions(sessionId)
            ]);

            console.log('Session response:', sessionResponse.data);
            console.log('Options response:', optionsResponse.data);

            // Handle both old format (direct data) and new format (with success flag)
            const sessionData = sessionResponse.data.success ? sessionResponse.data.data : sessionResponse.data;
            const optionsData = optionsResponse.data.success ? optionsResponse.data.data : optionsResponse.data;

            setSession(sessionData);
            setOptions(Array.isArray(optionsData) ? optionsData : []);

        } catch (error) {
            console.error('Error fetching session data:', error);

            if (error.response?.status === 404) {
                toast.error('Session not found');
                navigate('/groups');
            } else {
                toast.error('Failed to load session data');
                if (showLoadingState) {
                    // Only navigate away if this is the initial load
                    navigate('/groups');
                }
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [sessionId, navigate]);

    const handleVote = async (optionId, delta) => {
        if (votingInProgress) {
            toast.error('Please wait, processing previous vote...');
            return;
        }

        try {
            setVotingInProgress(true);
            console.log('Voting:', { optionId, delta });

            const response = await optionAPI.vote(optionId, delta);
            console.log('Vote response:', response.data);

            // Refresh data after successful vote
            await fetchSessionData(false);

            if (delta > 0) {
                toast.success('Vote added! 🗳️');
            } else {
                toast.success('Vote removed! 👍');
            }

        } catch (error) {
            console.error('Error voting:', error);

            let errorMessage = 'Failed to vote';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid vote request';
            } else if (error.response?.status === 403) {
                errorMessage = 'Voting is not allowed';
            } else if (error.response?.status === 404) {
                errorMessage = 'Restaurant not found';
            }

            toast.error(errorMessage);
        } finally {
            setVotingInProgress(false);
        }
    };

    const handleLockToggle = async () => {
        try {
            const newLockState = !session.locked;
            console.log('Toggling lock state to:', newLockState);

            const response = await sessionAPI.lockSession(sessionId, newLockState);
            console.log('Lock toggle response:', response.data);

            setSession(prev => ({ ...prev, locked: newLockState }));
            setLockDialogOpen(false);

            if (newLockState) {
                toast.success('🔒 Session locked! Results are final.');
                setShowWinnerConfetti(true);
                setTimeout(() => setShowWinnerConfetti(false), 5000);
            } else {
                toast.success('🔓 Session unlocked! Voting resumed.');
            }
        } catch (error) {
            console.error('Error toggling lock:', error);
            toast.error('Failed to ' + (session.locked ? 'unlock' : 'lock') + ' session');
        }
    };

    const handleRefresh = () => {
        fetchSessionData(false);
        toast.success('Data refreshed!');
    };

    useEffect(() => {
        if (sessionId) {
            fetchSessionData();
        }
    }, [sessionId, fetchSessionData]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading && !votingInProgress) {
                fetchSessionData(false);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchSessionData, loading, votingInProgress]);

    const sortedOptions = [...options].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const totalVotes = options.reduce((sum, option) => sum + (option.votes || 0), 0);
    const winner = sortedOptions.length > 0 && sortedOptions[0].votes > 0 ? sortedOptions[0] : null;
    const hasDeadlinePassed = session?.deadline && new Date(session.deadline) < new Date();
    const isSessionLocked = session?.locked || hasDeadlinePassed;
    const headerColors = getHeaderColors(session?.group?.colorTheme);

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <LinearProgress sx={{ mb: 4, borderRadius: 2, height: 6 }} />
                    <Typography variant="h5" sx={{ color: 'white', textAlign: 'center' }}>
                        Loading session...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!session) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                        Session not found
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/groups')}
                        sx={{ color: 'white' }}
                    >
                        Back to Groups
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            {showWinnerConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={200}
                    gravity={0.1}
                />
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(`/groups/${session.group?.id || ''}`)}
                            sx={{ color: 'white' }}
                        >
                            Back to {session.group?.name || 'Group'}
                        </Button>

                        <Button
                            startIcon={<RefreshIcon />}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{ color: 'white' }}
                        >
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </Button>
                    </Box>

                    {/* Session Header */}
                    <Card sx={{
                        mb: 4,
                        background: session.group?.colorTheme ?
                            `linear-gradient(135deg, ${session.group.colorTheme} 0%, ${session.group.colorTheme}90 100%)` :
                            'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        color: headerColors.text,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h3" gutterBottom sx={{ 
                                        fontWeight: 700,
                                        color: headerColors.text 
                                    }}>
                                        {session.title}
                                    </Typography>
                                    {session.description && (
                                        <Typography variant="h6" sx={{ 
                                            color: headerColors.text, 
                                            opacity: 0.8, 
                                            mb: 2 
                                        }}>
                                            {session.description}
                                        </Typography>
                                    )}
                                </Box>

                                <Avatar sx={{
                                    bgcolor: headerColors.avatarBg,
                                    color: headerColors.text,
                                    width: 80,
                                    height: 80,
                                    fontSize: 40,
                                    ml: 2
                                }}>
                                    🍽️
                                </Avatar>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                <Chip
                                    icon={<PollIcon />}
                                    label={`${totalVotes} Total Votes`}
                                    sx={{ 
                                        bgcolor: headerColors.chipBg, 
                                        color: headerColors.chipText,
                                        '& .MuiChip-icon': { color: headerColors.chipText }
                                    }}
                                />
                                <Chip
                                    icon={<GroupIcon />}
                                    label={`${options.length} Options`}
                                    sx={{ 
                                        bgcolor: headerColors.chipBg, 
                                        color: headerColors.chipText,
                                        '& .MuiChip-icon': { color: headerColors.chipText }
                                    }}
                                />
                                {session.deadline && (
                                    <Chip
                                        icon={<ScheduleIcon />}
                                        label={hasDeadlinePassed ? 'Deadline Passed' : `Ends ${new Date(session.deadline).toLocaleDateString()}`}
                                        color={hasDeadlinePassed ? 'error' : 'default'}
                                        sx={{ 
                                            bgcolor: headerColors.chipBg, 
                                            color: headerColors.chipText,
                                            '& .MuiChip-icon': { color: headerColors.chipText }
                                        }}
                                    />
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ 
                                        color: headerColors.text, 
                                        opacity: 0.7 
                                    }}>
                                        Created {new Date(session.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    startIcon={isSessionLocked ? <LockIcon /> : <UnlockIcon />}
                                    onClick={() => setLockDialogOpen(true)}
                                    sx={{
                                        bgcolor: headerColors.buttonBg,
                                        color: headerColors.text,
                                        '&:hover': {
                                            bgcolor: headerColors.buttonHover,
                                        }
                                    }}
                                >
                                    {isSessionLocked ? 'Locked' : 'Lock Session'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Status Alerts */}
                    <AnimatePresence>
                        {isSessionLocked && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Alert
                                    severity={session.locked ? "warning" : "error"}
                                    sx={{ mb: 3 }}
                                    icon={<LockIcon />}
                                >
                                    {session.locked
                                        ? "🔒 This session has been manually locked. Voting is closed and results are final."
                                        : "⏰ The deadline has passed. Voting is now closed."
                                    }
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Winner Announcement */}
                    <AnimatePresence>
                        {winner && isSessionLocked && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, type: 'spring' }}
                            >
                                <Card sx={{
                                    mb: 4,
                                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
                                    color: 'black',
                                    border: '3px solid gold',
                                    position: 'relative'
                                }}>
                                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            style={{ display: 'inline-block' }}
                                        >
                                            <TrophyIcon sx={{ fontSize: 60, color: '#ff6b6b', mb: 2 }} />
                                        </motion.div>
                                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                                            🎉 We have a winner! 🎉
                                        </Typography>
                                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                                            {winner.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            with {winner.votes} votes!
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => navigate(`/sessions/${sessionId}/results`)}
                                            sx={{
                                                bgcolor: '#ff6b6b',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: '#ff5252'
                                                }
                                            }}
                                        >
                                            View Full Results
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Voting Options */}
                    <Box sx={{ position: 'relative' }}>
                        {options.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Card sx={{ textAlign: 'center', py: 8 }}>
                                    <CardContent>
                                        <Typography variant="h4" gutterBottom sx={{ opacity: 0.7 }}>
                                            🍽️ No restaurants yet!
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                                            Be the first to add a restaurant proposal to get the voting started!
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<AddIcon />}
                                            onClick={() => navigate(`/sessions/${sessionId}/add`)}
                                            disabled={isSessionLocked}
                                            sx={{ borderRadius: '25px', px: 4 }}
                                        >
                                            Add First Restaurant
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
                                    🏆 Current Rankings ({totalVotes} total votes)
                                </Typography>
                                    {/** TODO : fix ranking display, the winning proposal is highlighted but  */}
                                {sortedOptions.map((option, index) => (
                                    <ModernProposalCard
                                        key={option.id}
                                        proposal={option}
                                        rank={index + 1}
                                        onVote={handleVote}
                                        votingLocked={votingInProgress}
                                        sessionLocked={isSessionLocked}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </motion.div>

            {/* Add Restaurant FAB */}
            <FloatingActionButton
                onClick={() => navigate(`/sessions/${sessionId}/add`)}
                ariaLabel="add restaurant"
                visible={!isSessionLocked}
            />

            <LockSessionDialog
                open={lockDialogOpen}
                onClose={() => setLockDialogOpen(false)}
                session={session}
                onConfirm={handleLockToggle}
            />
        </Container>
    );
};

export default VotingSessionPage;