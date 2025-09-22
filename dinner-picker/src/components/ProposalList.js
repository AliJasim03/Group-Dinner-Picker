import React from 'react';
import {
    Typography,
    Box,
    Paper,
    Alert
} from '@mui/material';
import ProposalCard from './ProposalCard';

const ProposalList = ({ proposals, onVote, votingLocked }) => {
    const sortedProposals = [...proposals].sort((a, b) => b.votes - a.votes);

    if (proposals.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No proposals yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Be the first to suggest a restaurant!
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            {sortedProposals.map((proposal, index) => (
                <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    rank={index + 1}
                    onVote={onVote}
                    votingLocked={votingLocked}
                />
            ))}

            {proposals.length > 0 && !votingLocked && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Vote for your favorite restaurants! The one with the most votes will be chosen.
                </Alert>
            )}
        </Box>
    );
};

export default ProposalList;
