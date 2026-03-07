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
    alpha,
    IconButton,
    Button,
    Collapse,
    InputAdornment,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SmsIcon from '@mui/icons-material/Sms';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface HeaderMenuProps {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    onInfoClick: () => void;
    onMyBoardsClick: () => void;
    symbol: string;
    name: string;
    onSymbolChange: (symbol: string) => void;
    onNameChange: (name: string) => void;
    symbolNames: Record<string, string>;
    onSmsClick: () => void;
    venmoUsername?: string;
    hasPaid: boolean;
    isAdmin: boolean;
}

// Detect if a string contains emoji characters
const containsEmoji = (str: string) => /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(str);

export default function HeaderMenu({
    anchorEl,
    onClose,
    onInfoClick,
    onMyBoardsClick,
    symbol,
    name,
    onSymbolChange,
    onNameChange,
    symbolNames,
    onSmsClick,
    venmoUsername,
    hasPaid,
    isAdmin
}: HeaderMenuProps) {
    const theme = useTheme();
    const open = Boolean(anchorEl);

    // Edit mode state
    const [isEditing, setIsEditing] = React.useState(false);
    const [editSymbol, setEditSymbol] = React.useState(symbol);
    const [editName, setEditName] = React.useState(name);
    const [errors, setErrors] = React.useState<{ symbol?: boolean; name?: boolean; symbolTaken?: string }>({});

    // Reset edit fields when menu opens
    React.useEffect(() => {
        if (open) {
            setEditSymbol(symbol);
            setEditName(name);
            setIsEditing(false);
            setErrors({});
        }
    }, [open, symbol, name]);

    const handleSymbolInputChange = (value: string) => {
        setErrors((prev) => ({ ...prev, symbol: false, symbolTaken: undefined }));
        if (containsEmoji(value)) {
            const emojiMatch = value.match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/u);
            setEditSymbol(emojiMatch ? emojiMatch[0] : value);
        } else {
            setEditSymbol(value.toUpperCase().slice(0, 3));
        }
    };

    const handleNameInputChange = (value: string) => {
        setErrors((prev) => ({ ...prev, name: false }));
        setEditName(value);
    };

    const handleSave = () => {
        const trimmedName = editName.trim();
        const newErrors: { symbol?: boolean; name?: boolean; symbolTaken?: string } = {};

        if (!editSymbol) newErrors.symbol = true;
        if (!trimmedName) newErrors.name = true;

        // Check uniqueness: is this symbol already taken by a different name?
        if (editSymbol && trimmedName) {
            const existingName = symbolNames[editSymbol];
            if (existingName && existingName !== trimmedName) {
                newErrors.symbolTaken = existingName;
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Update local identity (server will pick up mapping on next square selection)
        onSymbolChange(editSymbol);
        onNameChange(trimmedName);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditSymbol(symbol);
        setEditName(name);
        setErrors({});
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Stop ALL key events from bubbling to Menu
        // (Menu intercepts letter keys for typeahead navigation, stealing focus from TextFields)
        e.stopPropagation();
        if (e.key === 'Enter') {
            handleSave();
        }
        if (e.key === 'Escape') {
            handleCancelEdit();
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
                <Box
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        borderRadius: '10px',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {/* Read-only profile display */}
                    <Box
                        onClick={() => !isEditing && setIsEditing(true)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            cursor: isEditing ? 'default' : 'pointer',
                            '&:hover': !isEditing ? {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                            } : {},
                        }}
                    >
                        <AccountCircle sx={{ color: theme.palette.primary.main, fontSize: 28, flexShrink: 0 }} />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            {(name || symbol) ? (
                                <>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            lineHeight: 1.2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {name || symbol}
                                    </Typography>
                                    {name && symbol && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                color: 'text.secondary',
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {symbol}
                                        </Typography>
                                    )}
                                </>
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.85rem' }}
                                >
                                    Tap to set your identity
                                </Typography>
                            )}
                        </Box>
                        {!isEditing && (
                            <EditIcon
                                sx={{
                                    fontSize: 16,
                                    color: 'text.disabled',
                                    flexShrink: 0,
                                }}
                            />
                        )}
                    </Box>

                    {/* Expandable edit form */}
                    <Collapse in={isEditing}>
                        <Box
                            sx={{
                                px: 1.5,
                                pb: 1.5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.25,
                                borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                                pt: 1.5,
                            }}
                        >
                            <TextField
                                placeholder="Your Name"
                                size="small"
                                fullWidth
                                error={errors.name}
                                value={editName}
                                onChange={(e) => handleNameInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                helperText={errors.name ? 'Name is required.' : ''}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' },
                                    '& .MuiFormHelperText-root': { mx: 0.5, mt: 0.5 },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                placeholder="Your Symbol"
                                size="small"
                                fullWidth
                                error={errors.symbol || !!errors.symbolTaken}
                                value={editSymbol}
                                onChange={(e) => handleSymbolInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                helperText={
                                    errors.symbol
                                        ? 'Symbol is required.'
                                        : errors.symbolTaken
                                            ? `Already used by ${errors.symbolTaken}.`
                                            : 'Initials or emoji'
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' },
                                    '& .MuiFormHelperText-root': { mx: 0.5, mt: 0.5 },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle sx={{ fontSize: 18, color: 'primary.main' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button
                                    size="small"
                                    onClick={handleCancelEdit}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        borderRadius: '8px',
                                        minWidth: 0,
                                        px: 1.5,
                                        color: 'text.secondary',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleSave}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        borderRadius: '8px',
                                        minWidth: 0,
                                        px: 2,
                                        boxShadow: 'none',
                                        '&:hover': { boxShadow: 'none' },
                                    }}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
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

                {venmoUsername && (
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
                        {!isAdmin && !hasPaid && (
                            <Typography
                                variant="caption"
                                sx={{
                                    ml: 1,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: '6px',
                                    bgcolor: alpha(theme.palette.warning.main, 0.12),
                                    color: 'warning.dark',
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                }}
                            >
                                Unpaid
                            </Typography>
                        )}
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
