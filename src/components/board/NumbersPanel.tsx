'use client';
import { useState, useEffect, useRef } from 'react';
import { Avatar, Box, ButtonBase, Menu, MenuItem, ListItemAvatar, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

interface NumbersPanelProps {
    boardData: any;
    initials: string;
    squareMap: Record<string, number>;
    onRefresh: () => Promise<void>;
    selectedPlayer?: string | null;
}

export default function NumbersPanel({ boardData, initials, squareMap, onRefresh, selectedPlayer }: NumbersPanelProps) {
    const isMobileWidth = useMediaQuery('(max-width: 600px)');
    const isMobileHeight = useMediaQuery('(max-height: 600px)');
    const isMobile = isMobileWidth || isMobileHeight;
    const { gridData, teams } = boardData;
    const horizontalCode = teams?.horizontal?.code || 'H';
    const verticalCode = teams?.vertical?.code || 'V';

    const [activePlayer, setActivePlayer] = useState<string>(selectedPlayer || initials || '');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    useEffect(() => {
        if (selectedPlayer) {
            setActivePlayer(selectedPlayer);
        }
    }, [selectedPlayer]);

    const numbersSet = gridData && gridData[0] && gridData[0][1] !== null && gridData[0][1] !== undefined && gridData[0][1] !== '';

    const sortedPlayers = Object.keys(squareMap)
        .filter((key) => key !== '_remaining')
        .sort((a, b) => a.localeCompare(b));

    const getPlayerNumbers = (player: string) => {
        const numbers: { h: number; v: number }[] = [];
        if (!gridData) return numbers;

        gridData.forEach((row: any[], r: number) => {
            if (r === 0) return;
            row.forEach((cell: string, c: number) => {
                if (c === 0) return;
                if (cell === player) {
                    numbers.push({
                        h: gridData[0][c],
                        v: gridData[r][0]
                    });
                }
            });
        });

        return numbers.sort((a, b) => {
            if (a.h !== b.h) return a.h - b.h;
            return a.v - b.v;
        });
    };

    const playerNumbers = activePlayer ? getPlayerNumbers(activePlayer) : [];
    const isUser = activePlayer === initials;

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelectPlayer = (player: string) => {
        setActivePlayer(player);
        setAnchorEl(null);
    };

    const TableHeader = ({ label, align = 'center' }: { label: string; align?: 'center' | 'left' | 'right' }) => (
        <TableCell align={align} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            {label}
        </TableCell>
    );

    return (
        <Box>
            <Box sx={{ mb: 2, mt: 2, px: isMobile ? 2 : 0 }}>
                {isMobile && (
                    <Typography variant='h5' fontWeight='700' sx={{ mb: 2 }}>
                        Numbers
                    </Typography>
                )}
            </Box>

            {!numbersSet ? (
                <Box sx={{ px: isMobile ? 2 : 0, mb: 3 }}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 6,
                            px: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '2px dashed',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant='h6' color='text.primary' gutterBottom fontWeight='bold'>
                            Numbers Hidden
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            The numbers generated for the rows and columns will be revealed once the board is locked.
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: isMobile ? 0 : 2,
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderLeft: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        overflow: 'hidden'
                    }}
                >
                    {!activePlayer ? (
                        <Box sx={{ py: 6, px: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Please enter your initials above to see your numbers.
                            </Typography>
                        </Box>
                    ) : !squareMap[activePlayer] ? (
                        <>
                            {/* Player Header with selector */}
                            <ButtonBase
                                onClick={handleOpenMenu}
                                sx={{
                                    width: '100%',
                                    bgcolor: isUser ? 'primary.main' : 'grey.100',
                                    color: isUser ? 'white' : 'text.primary',
                                    px: 2,
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'filter 0.15s ease',
                                    '&:hover': {
                                        filter: 'brightness(0.95)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        variant='rounded'
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            fontSize: '0.75rem',
                                            bgcolor: isUser ? 'white' : 'grey.500',
                                            color: isUser ? 'primary.main' : 'white',
                                            fontWeight: 'bold',
                                            mr: 1.5
                                        }}
                                    >
                                        {activePlayer}
                                    </Avatar>
                                    <Typography variant="subtitle2" fontWeight="700">
                                        {activePlayer}
                                    </Typography>
                                    <UnfoldMoreIcon sx={{ ml: 0.5, fontSize: '1rem', opacity: 0.7 }} />
                                </Box>
                                <Typography variant="caption" fontWeight="600" sx={{ opacity: 0.9 }}>
                                    0 SQUARES
                                </Typography>
                            </ButtonBase>
                            <Box sx={{ py: 6, px: 3, textAlign: 'center' }}>
                                <Typography color="text.secondary">
                                    {isUser ? "You haven't claimed any squares yet." : `${activePlayer} hasn't claimed any squares yet.`}
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <Box>
                            {/* Player Header — clickable to switch player */}
                            <ButtonBase
                                onClick={handleOpenMenu}
                                sx={{
                                    width: '100%',
                                    bgcolor: isUser ? 'primary.main' : 'grey.100',
                                    color: isUser ? 'white' : 'text.primary',
                                    px: 2,
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'filter 0.15s ease',
                                    '&:hover': {
                                        filter: 'brightness(0.95)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        variant='rounded'
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            fontSize: '0.75rem',
                                            bgcolor: isUser ? 'white' : 'grey.500',
                                            color: isUser ? 'primary.main' : 'white',
                                            fontWeight: 'bold',
                                            mr: 1.5
                                        }}
                                    >
                                        {activePlayer}
                                    </Avatar>
                                    <Typography variant="subtitle2" fontWeight="700">
                                        {activePlayer}
                                    </Typography>
                                    <UnfoldMoreIcon sx={{ ml: 0.5, fontSize: '1rem', opacity: 0.7 }} />
                                </Box>
                                <Typography variant="caption" fontWeight="600" sx={{ opacity: 0.9 }}>
                                    {playerNumbers.length} SQUARE{playerNumbers.length !== 1 ? 'S' : ''}
                                </Typography>
                            </ButtonBase>

                            {/* Numbers Table */}
                            <TableContainer>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                                        <TableRow>
                                            <TableHeader label={verticalCode} />
                                            <TableHeader label={horizontalCode} />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {playerNumbers.map((pair, i) => (
                                            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell align="center">
                                                    <Typography variant='body2' fontWeight='700'>
                                                        {pair.v}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant='body2' fontWeight='700'>
                                                        {pair.h}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* Player selection menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        slotProps={{
                            paper: {
                                sx: {
                                    minWidth: 200,
                                    maxHeight: 320,
                                    mt: 0.5,
                                    borderRadius: 2,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                },
                            },
                        }}
                    >
                        {sortedPlayers.map((player) => {
                            const isSelf = player === initials;
                            const isActive = player === activePlayer;
                            const count = squareMap[player] || 0;
                            return (
                                <MenuItem
                                    key={player}
                                    selected={isActive}
                                    onClick={() => handleSelectPlayer(player)}
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        borderRadius: 1,
                                        mx: 0.5,
                                        mb: 0.25,
                                        '&.Mui-selected': {
                                            bgcolor: isSelf ? 'primary.main' : 'grey.800',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: isSelf ? 'primary.dark' : 'grey.700',
                                            },
                                        },
                                    }}
                                >
                                    <ListItemAvatar sx={{ minWidth: 40 }}>
                                        <Avatar
                                            variant='rounded'
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                fontSize: '0.7rem',
                                                bgcolor: isActive
                                                    ? (isSelf ? 'white' : 'grey.300')
                                                    : (isSelf ? 'primary.light' : 'grey.300'),
                                                color: isActive
                                                    ? (isSelf ? 'primary.main' : 'grey.800')
                                                    : (isSelf ? 'white' : 'grey.700'),
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {player}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={player}
                                        secondary={`${count} square${count !== 1 ? 's' : ''}`}
                                        primaryTypographyProps={{ fontWeight: 700, fontSize: '0.875rem' }}
                                        secondaryTypographyProps={{
                                            fontSize: '0.75rem',
                                            color: isActive ? 'inherit' : 'text.secondary',
                                            sx: isActive ? { opacity: 0.8 } : {},
                                        }}
                                    />
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </Box>
            )}
        </Box>
    );
}
