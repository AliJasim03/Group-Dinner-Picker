import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Link,
    Divider
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Launch as LaunchIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';

const ProposalCard = ({ proposal, rank, onVote, votingLocked }) => {
    const isWinning = rank === 1 && proposal.votes > 0;

    return (
        <Card
            sx={{
                mb: 2,
                position: 'relative',
                border: isWinning ? '2px solid gold' : 'none',
                boxShadow: isWinning ? '0 4px 20px rgba(255, 215, 0, 0.3)' : 1,
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip
                                label={`#${rank}`}
                                size="small"
                                color={isWinning ? "warning" : "primary"}
                                sx={{ mr: 1, fontWeight: 'bold' }}
                            />
                            {isWinning && <TrophyIcon sx={{ color: 'gold', mr: 1 }} />}
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
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
                                mb: 2,
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
                                {proposal.link}
                            </Typography>
                            <LaunchIcon fontSize="small" />
                        </Link>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: proposal.votes > 0 ? 'success.main' : 'text.secondary',
                                mr: 2
                            }}
                        >
                            {proposal.votes}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        {proposal.votes} {proposal.votes === 1 ? 'vote' : 'votes'}
                    </Typography>

                    {!votingLocked && (
                        <Box>
                            <IconButton
                                color="success"
                                onClick={() => onVote(proposal.id, 1)}
                                disabled={votingLocked}
                                sx={{ mr: 1 }}
                            >
                                <ThumbUpIcon />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => onVote(proposal.id, -1)}
                                disabled={votingLocked || proposal.votes === 0}
                            >
                                <ThumbDownIcon />
                            </IconButton>
                        </Box>
                    )}

                    {votingLocked && (
                        <Chip label="Voting Locked" size="small" color="warning" />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProposalCard;
