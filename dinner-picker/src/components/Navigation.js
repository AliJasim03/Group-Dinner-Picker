import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Chip
} from '@mui/material';
import {
    Restaurant as RestaurantIcon,
    Group as GroupIcon,
    Home as HomeIcon,
    AccountCircle as AccountIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                         onClick={() => navigate('/')}>
                        <RestaurantIcon sx={{ mr: 2, fontSize: 32, color: 'white' }} />
                        <Typography variant="h5" component="div" sx={{
                            fontWeight: 700,
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            🍜 DinePick
                        </Typography>
                    </Box>
                </motion.div>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        color="inherit"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'white',
                            borderRadius: '20px',
                            px: 2,
                            background: isActive('/') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        Home
                    </Button>

                    <Button
                        color="inherit"
                        startIcon={<GroupIcon />}
                        onClick={() => navigate('/groups')}
                        sx={{
                            color: 'white',
                            borderRadius: '20px',
                            px: 2,
                            background: isActive('/groups') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        Groups
                    </Button>

                    <IconButton
                        color="inherit"
                        sx={{
                            color: 'white',
                            position: 'relative',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <NotificationsIcon />
                        <Chip
                            label="3"
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                minWidth: 20,
                                height: 20,
                                fontSize: '0.75rem',
                                background: '#ff4757',
                                color: 'white'
                            }}
                        />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        onClick={handleProfileMenuOpen}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                            🧑‍💻
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                            },
                        }}
                    >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;
