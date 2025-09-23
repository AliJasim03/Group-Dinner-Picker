import React from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    Skeleton,
    Avatar,
    LinearProgress
} from '@mui/material';

const GroupDetailSkeleton = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <LinearProgress sx={{ mb: 4, borderRadius: 2, height: 4 }} />
                
                {/* Back button skeleton */}
                <Skeleton variant="text" width={150} height={40} sx={{ mb: 3 }} />

                {/* Group Header Skeleton */}
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Skeleton variant="circular" width={80} height={80} sx={{ mr: 3 }} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width={300} height={50} />
                                <Skeleton variant="text" width={400} height={30} sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Skeleton variant="rounded" width={120} height={32} />
                                    <Skeleton variant="rounded" width={140} height={32} />
                                    <Skeleton variant="rounded" width={130} height={32} />
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Tabs Skeleton */}
                <Card sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', p: 2, gap: 4 }}>
                        <Skeleton variant="text" width={150} height={48} />
                        <Skeleton variant="text" width={120} height={48} />
                        <Skeleton variant="text" width={130} height={48} />
                    </Box>
                </Card>

                {/* Content Skeleton */}
                <Card>
                    <CardContent>
                        {/* List items skeleton */}
                        {[...Array(3)].map((_, index) => (
                            <Box key={index} sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                py: 2, 
                                borderRadius: 2,
                                mb: 2,
                                backgroundColor: 'grey.50'
                            }}>
                                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 3 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Skeleton variant="rounded" width={80} height={24} />
                                        <Skeleton variant="rounded" width={120} height={24} />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default GroupDetailSkeleton;