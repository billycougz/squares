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
                    minWidth: 260,
                    maxWidth: 300,
                    borderRadius: '14px',
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
            {/* ── Profile ── */}
            <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    p: 1.5,
                    borderRadius: '10px',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                    <AccountCircle sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
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
            </Box>

            <Divider sx={{ mx: 1.5 }} />

            {/* ── Actions ── */}
            <MenuList dense sx={{ py: 0.5 }}>
                <MenuItem
                    onClick={() => {
                        onClose();
                        onSmsClick();
                    }}
                    sx={{ py: 1, mx: 0.5, borderRadius: '8px' }}
                >
                    <ListItemIcon>
                        <SmsIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                </MenuItem>

                {(isAdmin || hasPaid) && venmoUsername && (
                    <MenuItem
                        component="a"
                        href={venmoUrl || '#'}
                        target="_blank"
                        onClick={onClose}
                        sx={{ py: 1, mx: 0.5, borderRadius: '8px' }}
                    >
                        <ListItemIcon>
                            <Box
                                component="img"
                                src="/venmo.svg"
                                alt="Venmo"
                                sx={{ width: 20, height: 20, filter: 'none' }}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Venmo" />
                    </MenuItem>
                )}
            </MenuList>

            <Divider sx={{ mx: 1.5 }} />

            {/* ── Navigate ── */}
            <MenuList dense sx={{ py: 0.5 }}>
                <MenuItem onClick={() => handleClick('myBoards')} sx={{ py: 1, mx: 0.5, borderRadius: '8px' }}>
                    <ListItemIcon>
                        <DashboardIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Boards" />
                </MenuItem>
                <MenuItem onClick={() => handleClick('info')} sx={{ py: 1, mx: 0.5, borderRadius: '8px' }}>
                    <ListItemIcon>
                        <InfoIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Board Info" />
                </MenuItem>
            </MenuList>

            <Divider sx={{ mx: 1.5 }} />

            {/* ── More ── */}
            <MenuList dense sx={{ py: 0.5 }}>
                <MenuItem onClick={() => handleClick('feedback')} sx={{ py: 1, mx: 0.5, borderRadius: '8px' }}>
                    <ListItemIcon>
                        <ThumbUpAltIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="App Feedback" />
                </MenuItem>
                <MenuItem onClick={() => handleClick('coffee')} sx={{ py: 1, mx: 0.5, borderRadius: '8px' }}>
                    <ListItemIcon>
                        <VolunteerActivismIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Support the Developer" />
                </MenuItem>
            </MenuList>

            {/* ── Footer ── */}
            <Box sx={{ px: 2, py: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        textAlign: 'center',
                        fontSize: '0.65rem',
                        color: 'text.disabled',
                        fontWeight: 500,
                        letterSpacing: '0.06em'
                    }}
                >
                    VERSION 02-20-2026
                </Typography>
            </Box>
        </Menu>
    );
}
