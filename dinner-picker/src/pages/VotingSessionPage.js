import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    Fab,
    LinearProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Countdown
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Lock as LockIcon,
    LockOpen as UnlockIcon,
    Poll as PollIcon,
    EmojiEvents as TrophyIcon,
    Schedule as ScheduleIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import ModernProposalCard from '../components/ModernProposalCard';
import { sessionAPI, optionAPI } from '../services/api';

const VotingSessionPage = () => {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lockDialogOpen, setLockDialogOpen] = useState(false);
    const [showWinnerConfetti, setShowWinnerConfetti] = useState(false);
    const navigate = useNavigate();

    const fetchSessionData = async () => {
        try {
            setLoading(true);
            const [sessionResponse, optionsResponse] = await Promise.all([
                sessionAPI.getSession(sessionId),
                //optionAPI.getSessionOptions(sessionId)
            ]);

            setSession(sessionResponse.data);
            setOptions(sessionResponse.data.options || []);
            console.log(sessionResponse.data);
        } catch (error) {
            toast.error('Failed to load session data');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionId, delta) => {
        try {
            await optionAPI.vote(optionId, delta);
            await fetchSessionData(); // Refresh data

            if (delta > 0) {
                toast.success('Vote added! 🗳️');
            } else {
                toast.success('Vote removed 👍');
            }
        } catch (error) {
            toast.error('Failed to vote: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    const handleLockToggle = async () => {
        try {
            const newLockState = !session.locked;
            await sessionAPI.lockSession(sessionId, newLockState);

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
            toast.error('Failed to toggle lock');
        }
    };

    useEffect(() => {
        fetchSessionData();
        // Set up polling for real-time updates
        const interval = setInterval(fetchSessionData, 100000); // Poll every 100 seconds
        return () => clearInterval(interval);
    }, [sessionId]);

    const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
    const winner = sortedOptions.length > 0 && sortedOptions[0].votes > 0 ? sortedOptions[0] : null;
    const hasDeadlinePassed = session?.deadline && new Date(session.deadline) < new Date();
    const isSessionLocked = session?.locked || hasDeadlinePassed;

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
                    <Typography variant="h4" sx={{ color: 'white' }}>Session not found</Typography>
                    <Button onClick={() => navigate('/groups')} sx={{ mt: 2, color: 'white' }}>
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
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/groups/${session.group?.id || ''}`)}
                        sx={{ mb: 3, color: 'white' }}
                    >
                        Back to {session.group?.name || 'Group'}
                    </Button>

                    {/* Session Header */}
                    <Card sx={{
                        mb: 4,
                        background: session.group?.colorTheme ?
                            `linear-gradient(135deg, ${session.group.colorTheme} 0%, ${session.group.colorTheme}90 100%)` :
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        width: 70,
                                        height: 70,
                                        fontSize: 30,
                                        mr: 3
                                    }}>
                                        {session.group?.emojiIcon || '🗳️'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                                            {session.title}
                                        </Typography>
                                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                                            {session.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Chip
                                                icon={<GroupIcon />}
                                                label={session.group?.name || 'Unknown Group'}
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    '& .MuiChip-icon': { color: 'white' }
                                                }}
                                            />
                                            <Chip
                                                icon={<PollIcon />}
                                                label={`${options.length} options`}
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    '& .MuiChip-icon': { color: 'white' }
                                                }}
                                            />
                                            <Chip
                                                icon={<TrophyIcon />}
                                                label={`${totalVotes} total votes`}
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    '& .MuiChip-icon': { color: 'white' }
                                                }}
                                            />
                                            {session.deadline && (
                                                <Chip
                                                    icon={<ScheduleIcon />}
                                                    label={`Ends ${new Date(session.deadline).toLocaleDateString()}`}
                                                    sx={{
                                                        bgcolor: hasDeadlinePassed ? 'rgba(244, 67, 54, 0.8)' : 'rgba(255, 193, 7, 0.8)',
                                                        color: 'white',
                                                        '& .MuiChip-icon': { color: 'white' }
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={() => setLockDialogOpen(true)}
                                    startIcon={isSessionLocked ? <LockIcon /> : <UnlockIcon />}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.3)',
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
                                                '&:hover': { bgcolor: '#ee5a24' }
                                            }}
                                        >
                                            View Full Results
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Options List */}
                    <Box>
                        {options.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    background: 'rgba(255, 255, 255, 0.95)'
                                }}>
                                    <CardContent>
                                        <Avatar sx={{
                                            width: 120,
                                            height: 120,
                                            mx: 'auto',
                                            mb: 4,
                                            bgcolor: 'primary.main',
                                            fontSize: 60
                                        }}>
                                            🍽️
                                        </Avatar>
                                        <Typography variant="h4" gutterBottom>
                                            No restaurants yet!
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
                                        votingLocked={false}
                                        sessionLocked={isSessionLocked}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </motion.div>

            {/* Add Restaurant FAB */}
            {!isSessionLocked && (
                <Fab
                    color="primary"
                    aria-label="add restaurant"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                    onClick={() => navigate(`/sessions/${sessionId}/add`)}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Lock Confirmation Dialog */}
            <Dialog
                open={lockDialogOpen}
                onClose={() => setLockDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {session.locked ? '🔓 Unlock Session?' : '🔒 Lock Session?'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {session.locked
                            ? 'Unlocking will allow members to add new restaurants and continue voting.'
                            : 'Locking will stop all voting and finalize the results. This action can be undone later.'
                        }
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLockDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLockToggle}
                        variant="contained"
                        color={session.locked ? "success" : "warning"}
                    >
                        {session.locked ? 'Unlock' : 'Lock'} Session
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VotingSessionPage;
