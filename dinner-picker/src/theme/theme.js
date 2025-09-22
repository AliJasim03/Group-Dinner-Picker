import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#667eea',
            light: '#99a9f4',
            dark: '#4c63d2',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f093fb',
            light: '#f4b3fc',
            dark: '#ec6ef8',
            contrastText: '#000000',
        },
        success: {
            main: '#00d4aa',
            light: '#4fffcd',
            dark: '#00a085',
        },
        warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#ff9800',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
        },
        background: {
            default: '#f8faff',
            paper: '#ffffff',
        },
        text: {
            primary: '#2d3748',
            secondary: '#718096',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',

            backgroundClip: 'text',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#2d3748',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#2d3748',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#2d3748',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#2d3748',
        },
        h6: {
            fontSize: '1.1rem',
            fontWeight: 500,
            color: '#2d3748',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#4a5568',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '12px',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        '&:hover fieldset': {
                            borderColor: '#667eea',
                        },
                    },
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'scale(1.05)',
                    },
                },
            },
        },
    },
});
