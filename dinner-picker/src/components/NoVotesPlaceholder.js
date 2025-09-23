import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar
} from '@mui/material';

const NoVotesPlaceholder = () => {
    return (
        <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3
        }}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Avatar sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 3,
                    bgcolor: 'grey.200',
                    fontSize: 60
                }}>
                    🤷‍♂️
                </Avatar>
                <Typography variant="h4" gutterBottom>
                    No votes yet!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    It looks like no one voted in this session.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NoVotesPlaceholder;