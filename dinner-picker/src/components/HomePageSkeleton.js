import React from 'react';
import { Container, Box, Grid, Skeleton } from '@mui/material';

const HomePageSkeleton = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Skeleton 
                    variant="text" 
                    width="60%" 
                    height={60} 
                    sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        mx: 'auto'
                    }} 
                />
                <Skeleton 
                    variant="text" 
                    width="40%" 
                    height={30} 
                    sx={{ 
                        mt: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        mx: 'auto'
                    }} 
                />
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {[1, 2, 3].map((item) => (
                        <Grid item xs={12} md={4} key={item}>
                            <Skeleton 
                                variant="rectangular" 
                                height={120} 
                                sx={{ 
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }} 
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default HomePageSkeleton;