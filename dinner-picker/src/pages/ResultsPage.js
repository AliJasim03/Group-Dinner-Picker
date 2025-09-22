import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Box,
    Paper,
    Alert,
    Card,
    CardContent,
    Chip,
    Link,
    Divider
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    EmojiEvents as TrophyIcon,
    Launch as LaunchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { dinnerAPI } from '../services/api';

const ResultsPage = () => {
    const [winner, setWinner] = useState(null);
    const [allProposals, setAllProposals] = useState([]);
    const [votingLocked, setVotingLocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchResults = async () => {
        try {
            setLoading(true);
            const [winnerResponse, proposalsResponse, statusResponse] = await Promise.all([
                dinnerAPI.getWinner(),
                dinnerAPI.getOptions(),
                dinnerAPI.getStatus()
            ]);

            setWinner(winnerResponse.data.winner);
            setAllProposals(proposalsResponse.data.sort((a, b) => b.votes - a.votes));
            setVotingLocked(statusResponse.data.locked);
        } catch (err) {
            setError('Failed to fetch results');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 3 }}
                >
                    Back to Proposals
                </Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const hasVotes = allProposals.some(p => p.votes > 0);

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 3 }}
            >
                Back to Proposals
            </Button>

            <Typography variant="h4" component="h1" gutterBottom>
                🏆 Results
            </Typography>

            {votingLocked && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Voting has been locked. These are the final results!
                </Alert>
            )}

            {!hasVotes ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No votes yet!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Go back and start voting to see results.
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* Winner Card */}
                    {winner && winner.votes > 0 && (
                        <Card sx={{
                            mb: 4,
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: 'black',
                            position: 'relative'
                        }}>
                            <CardContent sx={{ pb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TrophyIcon sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            🎉 Winner!
                                        </Typography>
                                        <Typography variant="body2">
                                            The group has chosen
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {winner.name}
                                </Typography>

                                <Link
                                    href={winner.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'primary.dark',
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' }
                                    }}
                                >
                                    <Typography variant="body1" sx={{ mr: 1 }}>
                                        Visit Website
                                    </Typography>
                                    <LaunchIcon />
                                </Link>

                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 2 }}>
                                        {winner.votes}
                                    </Typography>
                                    <Typography variant="body1">
                                        {winner.votes === 1 ? 'vote' : 'votes'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Full Results */}
                    <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                        All Results
                    </Typography>

                    {allProposals.map((proposal, index) => (
                        <Card
                            key={proposal.id}
                            sx={{
                                mb: 2,
                                opacity: proposal.votes === 0 ? 0.6 : 1,
                                border: index === 0 && proposal.votes > 0 ? '2px solid gold' : 'none'
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                label={`#${index + 1}`}
                                                size="small"
                                                color={index === 0 && proposal.votes > 0 ? "warning" : "default"}
                                                sx={{ mr: 2, fontWeight: 'bold' }}
                                            />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {proposal.name}
                                            </Typography>
                                        </Box>

                                        <Link
                                            href={proposal.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'primary.main',
                                                textDecoration: 'none',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ mr: 1 }}>
                                                {proposal.link}
                                            </Typography>
                                            <LaunchIcon fontSize="small" />
                                        </Link>
                                    </Box>

                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: proposal.votes > 0 ? 'success.main' : 'text.secondary'
                                            }}
                                        >
                                            {proposal.votes}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {proposal.votes === 1 ? 'vote' : 'votes'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}

                    <Divider sx={{ my: 3 }} />

                    <Alert severity="info">
                        <Typography variant="body2">
                            <strong>Total votes:</strong> {allProposals.reduce((sum, p) => sum + p.votes, 0)}
                            <br />
                            <strong>Proposals:</strong> {allProposals.length}
                            <br />
                            <strong>Status:</strong> {votingLocked ? 'Voting locked - Final results' : 'Voting still open'}
                        </Typography>
                    </Alert>
                </>
            )}
        </Box>
    );
};

export default ResultsPage;
