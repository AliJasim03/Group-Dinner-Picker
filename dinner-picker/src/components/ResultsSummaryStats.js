import React from 'react';
import {
    Typography,
    Paper,
    Grid,
    Divider,
    Box
} from '@mui/material';

const ResultsSummaryStats = ({ options, totalVotes, winner }) => {
    return (
        <Box>
            <Divider sx={{ my: 3 }} />

            {/* Summary Stats */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        borderRadius: 2
                    }}>
                        <Typography variant="h4" gutterBottom>
                            {options.length}
                        </Typography>
                        <Typography variant="body1">
                            Total Restaurants
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: 'success.main', 
                        color: 'white',
                        borderRadius: 2
                    }}>
                        <Typography variant="h4" gutterBottom>
                            {totalVotes}
                        </Typography>
                        <Typography variant="body1">
                            Total Votes Cast
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: 'warning.main', 
                        color: 'white',
                        borderRadius: 2
                    }}>
                        <Typography variant="h4" gutterBottom>
                            {winner ? Math.round((winner.votes / totalVotes) * 100) : 0}%
                        </Typography>
                        <Typography variant="body1">
                            Winner's Share
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ResultsSummaryStats;