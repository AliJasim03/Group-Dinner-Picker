import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { groupAPI, sessionAPI } from '../services/api';

// Import modular components
import GroupHeader from '../components/GroupHeader';
import GroupTabs from '../components/GroupTabs';
import ActiveSessionsTab from '../components/ActiveSessionsTab';
import HistoryTab from '../components/HistoryTab';
import MembersTab from '../components/MembersTab';
import GroupDetailSkeleton from '../components/GroupDetailSkeleton';
import FloatingActionButton from '../components/FloatingActionButton';

const GroupDetailPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const [groupResponse, sessionsResponse] = await Promise.all([
                groupAPI.getGroup(groupId),
                sessionAPI.getGroupSessions(groupId)
            ]);

            setGroup(groupResponse.data);
            setSessions(sessionsResponse.data);
        } catch (error) {
            toast.error('Failed to load group data');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    const getSessionStatus = (session) => {
        if (session.locked) return 'completed';
        if (session.deadline && new Date(session.deadline) < new Date()) return 'expired';
        return 'active';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#00d4aa';
            case 'completed': return '#ffa726';
            case 'expired': return '#f44336';
            default: return '#666';
        }
    };

    const activeSessions = sessions.filter(s => getSessionStatus(s) === 'active');
    const completedSessions = sessions.filter(s => getSessionStatus(s) === 'completed');

    const handleTabChange = (newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return <GroupDetailSkeleton />;
    }

    if (!group) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'white' }}>Group not found</Typography>
                    <Button onClick={() => navigate('/groups')} sx={{ mt: 2, color: 'white' }}>
                        Back to Groups
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Box sx={{ py: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/groups')}
                        sx={{ mb: 3, color: 'white' }}
                    >
                        Back to Groups
                    </Button>

                    <GroupHeader 
                        group={group}
                        activeSessions={activeSessions}
                        completedSessions={completedSessions}
                    />

                    <GroupTabs
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        activeSessions={activeSessions}
                        completedSessions={completedSessions}
                        members={group?.members || []}
                    />

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 0 && (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ActiveSessionsTab
                                    activeSessions={activeSessions}
                                    groupId={groupId}
                                    getSessionStatus={getSessionStatus}
                                    getStatusColor={getStatusColor}
                                />
                            </motion.div>
                        )}

                        {activeTab === 1 && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <HistoryTab completedSessions={completedSessions} />
                            </motion.div>
                        )}

                        {activeTab === 2 && (
                            <motion.div
                                key="members"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MembersTab members={group?.members || []} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </motion.div>

            <FloatingActionButton
                onClick={() => navigate(`/groups/${groupId}/sessions/create`)}
                ariaLabel="create session"
            />
        </Container>
    );
};

export default GroupDetailPage;
