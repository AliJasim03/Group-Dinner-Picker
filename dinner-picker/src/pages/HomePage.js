import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Box,
    Alert,
    Fab,
    Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProposalList from '../components/ProposalList';
import LoadingSpinner from '../components/LoadingSpinner';
import { dinnerAPI } from '../services/api';

const HomePage = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [votingLocked, setVotingLocked] = useState(false);
    const navigate = useNavigate();

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const response = await dinnerAPI.getOptions();
            setProposals(response.data);

            // Check voting status
            const statusResponse = await dinnerAPI.getStatus();
            setVotingLocked(statusResponse.data.locked);
        } catch (err) {
            setError('Failed to fetch proposals');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionId, delta) => {
        try {
            await dinnerAPI.vote(optionId, delta);
            await fetchProposals(); // Refresh data
            setSnackbar({
                open: true,
                message: delta > 0 ? 'Vote added!' : 'Vote removed!',
                severity: 'success'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to vote: ' + (err.response?.data?.error || 'Unknown error'),
                severity: 'error'
            });
        }
    };

    const handleLockToggle = async () => {
        try {
            const newLockState = !votingLocked;
            await dinnerAPI.lockVoting(newLockState);
            setVotingLocked(newLockState);
            setSnackbar({
                open: true,
                message: newLockState ? 'Voting locked!' : 'Voting unlocked!',
                severity: 'info'
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to toggle lock',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Current Proposals
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color={votingLocked ? "success" : "warning"}
                        onClick={handleLockToggle}
                    >
                        {votingLocked ? 'Unlock Voting' : 'Lock Voting'}
                    </Button>
                    {proposals.length > 0 && (
                        <Button
                            variant="contained"
                            onClick={() => navigate('/results')}
                            color="secondary"
                        >
                            View Results
                        </Button>
                    )}
                </Box>
            </Box>

            {votingLocked && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Voting is currently locked. No new proposals or votes can be added.
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <ProposalList
                proposals={proposals}
                onVote={handleVote}
                votingLocked={votingLocked}
            />

            {!votingLocked && (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => navigate('/add')}
                >
                    <AddIcon />
                </Fab>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default HomePage;
