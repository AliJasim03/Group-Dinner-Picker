import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';

const LockSessionDialog = ({ 
    open, 
    onClose, 
    session,
    onConfirm
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {session?.locked ? '🔓 Unlock Session?' : '🔒 Lock Session?'}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {session?.locked
                        ? 'Unlocking will allow members to add new restaurants and continue voting.'
                        : 'Locking will stop all voting and finalize the results. This action can be undone later.'
                    }
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={session?.locked ? "success" : "warning"}
                >
                    {session?.locked ? 'Unlock' : 'Lock'} Session
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LockSessionDialog;