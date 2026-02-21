'use client';
import * as React from 'react';
import {
    Divider,
    MenuList,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Menu,
    Box,
    TextField,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SmsIcon from '@mui/icons-material/Sms';

interface HeaderMenuProps {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    onInfoClick: () => void;
    onMyBoardsClick: () => void;
    initials: string;
    onInitialsChange: (initials: string) => void;
    onSmsClick: () => void;
    venmoUsername?: string;
    hasPaid: boolean;
    isAdmin: boolean;
}

export default function HeaderMenu({
    anchorEl,
    onClose,
    onInfoClick,
    onMyBoardsClick,
    initials,
    onInitialsChange,
    onSmsClick,
    venmoUsername,
    hasPaid,
    isAdmin
}: HeaderMenuProps) {
    const theme = useTheme();
    const open = Boolean(anchorEl);
    const [initialsUnderChange, setInitialsUnderChange] = React.useState(initials);

    React.useEffect(() => {
        setInitialsUnderChange(initials);
    }, [initials]);

    const handleInitialsBlur = () => {
        if (initialsUnderChange !== initials) {
            onInitialsChange(initialsUnderChange);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === ' ') {
            e.stopPropagation();
        }
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    const handleClick = (item: string) => {
        onClose();
        switch (item) {
            case 'myBoards':
                return onMyBoardsClick();
            case 'info':
                return onInfoClick();
            case 'feedback':
                window.location.href = `mailto:CouganApps@gmail.com`;
                return;
            case 'coffee':
                return window.open('https://www.buymeacoffee.com/wpcougan', '_blank');
        }
    };

    const venmoUrl = venmoUsername ? (
        venmoUsername.toLowerCase().includes('https://venmo.com')
            ? venmoUsername
            : `https://venmo.com/u/${venmoUsername}`
    ) : null;

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            disableScrollLock
            PaperProps={{
                elevation: 4,
                sx: {
                    minWidth: 280,
                    borderRadius: '12px',
                    mt: 1.5,
                    overflow: 'visible',
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Box sx={{ p: 2, pb: 1.5 }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 0.5, mb: 1, display: 'block' }}>
                    User Settings
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    p: 1.5,
                    borderRadius: '8px',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                    <AccountCircle sx={{ color: theme.palette.primary.main }} />
                    <TextField
                        placeholder="Initials"
                        size="small"
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: { fontWeight: 700, fontSize: '0.9rem' }
                        }}
                        value={initialsUnderChange}
                        onChange={(e) => setInitialsUnderChange(e.target.value.toUpperCase())}
                        onBlur={handleInitialsBlur}
                        onKeyDown={handleKeyDown}
                        sx={{ flexGrow: 1 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <MenuItem
                        onClick={() => {
                            onClose();
                            onSmsClick();
                        }}
                        sx={{
                            flex: 1,
                            borderRadius: '8px',
                            border: `1px solid ${theme.palette.divider}`,
                            justifyContent: 'center',
                            py: 1
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 'auto !important', mr: 1 }}>
                            <SmsIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Notifications"
                            primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                        />
                    </MenuItem>

                    {(isAdmin || hasPaid) && venmoUsername && (
                        <MenuItem
                            component="a"
                            href={venmoUrl || '#'}
                            target="_blank"
                            onClick={onClose}
                            sx={{
                                flex: 1,
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                justifyContent: 'center',
                                py: 1,
                                '&:hover': {
                                    bgcolor: theme.palette.primary.dark,
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <img src="/venmo.svg" width="18" height="18" alt="Venmo" style={{ filter: 'brightness(0) invert(1)' }} />
                                <Typography variant="caption" fontWeight={600}>Venmo</Typography>
                            </Box>
                        </MenuItem>
                    )}
                </Box>
            </Box>

            <Divider />

            <MenuList dense sx={{ py: 0.5 }}>
                <MenuItem onClick={() => handleClick('myBoards')} sx={{ py: 1 }}>
                    <ListItemIcon>
                        <DashboardIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Boards" />
                </MenuItem>
                <MenuItem onClick={() => handleClick('info')} sx={{ py: 1 }}>
                    <ListItemIcon>
                        <InfoIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Board Introduction" />
                </MenuItem>
                <MenuItem onClick={() => handleClick('feedback')} sx={{ py: 1 }}>
                    <ListItemIcon>
                        <ThumbUpAltIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="App Feedback" />
                </MenuItem>
                <MenuItem onClick={() => handleClick('coffee')} sx={{ py: 1 }}>
                    <ListItemIcon>
                        <VolunteerActivismIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Support the Developer" />
                </MenuItem>
            </MenuList>

            <Divider />

            <Box sx={{ px: 2, py: 1, bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', fontSize: '0.65rem', color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em' }}>
                    VERSION 02-20-2026
                </Typography>
            </Box>
        </Menu>
    );
}
