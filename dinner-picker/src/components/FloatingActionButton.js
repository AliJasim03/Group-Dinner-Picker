import React from 'react';
import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const FloatingActionButton = ({ 
    onClick, 
    ariaLabel = "add", 
    icon = <AddIcon />, 
    visible = true,
    disabled = false,
    bottom = 24,
    right = 24,
    color = "primary",
    size = "large"
}) => {
    if (!visible) return null;

    return (
        <Fab
            color={color}
            aria-label={ariaLabel}
            disabled={disabled}
            size={size}
            sx={{
                position: 'fixed',
                bottom: bottom,
                right: right,
                background: 'linear-gradient(135deg, #00d4aa 0%, #01a085 100%)',
                color: 'white',
                '&:hover': {
                    background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
                },
                '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                }
            }}
            onClick={onClick}
        >
            {icon}
        </Fab>
    );
};

export default FloatingActionButton;