import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import {
    WhatsApp as WhatsAppIcon,
    Twitter as TwitterIcon,
    Facebook as FacebookIcon
} from '@mui/icons-material';

const ShareResultsDialog = ({ 
    open, 
    onClose, 
    session, 
    winner 
}) => {
    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `🎉 ${winner ? `${winner.name} won our dining vote` : 'Check out our dining vote results'}! ${session?.title || ''}`;

        let shareUrl = '';
        switch(platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                📤 Share Results
            </DialogTitle>
            <DialogContent>
                <Typography gutterBottom>
                    Share these exciting results with your friends!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleShare('whatsapp')}
                        sx={{ bgcolor: '#25d366' }}
                    >
                        WhatsApp
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<TwitterIcon />}
                        onClick={() => handleShare('twitter')}
                        sx={{ bgcolor: '#1da1f2' }}
                    >
                        Twitter
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<FacebookIcon />}
                        onClick={() => handleShare('facebook')}
                        sx={{ bgcolor: '#4267b2' }}
                    >
                        Facebook
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareResultsDialog;