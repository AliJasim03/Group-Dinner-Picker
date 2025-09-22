import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { theme } from './theme/theme';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import VotingSessionPage from './pages/VotingSessionPage';
import CreateSessionPage from './pages/CreateSessionPage';
import AddProposalPage from './pages/AddProposalPage';
import ResultsPage from './pages/ResultsPage';
import './styles/animations.css';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Box sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
            `,
                        pointerEvents: 'none',
                    }
                }}>
                    <Navigation />

                    <Box sx={{
                        position: 'relative',
                        zIndex: 1,
                        minHeight: 'calc(100vh - 80px)',
                        pt: 2
                    }}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/groups" element={<GroupsPage />} />
                            <Route path="/groups/create" element={<CreateGroupPage />} />
                            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
                            <Route path="/groups/:groupId/sessions/create" element={<CreateSessionPage />} />
                            <Route path="/sessions/:sessionId" element={<VotingSessionPage />} />
                            <Route path="/sessions/:sessionId/add" element={<AddProposalPage />} />
                            <Route path="/sessions/:sessionId/results" element={<ResultsPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                    },
                }}
            />
        </ThemeProvider>
    );
}

export default App;
