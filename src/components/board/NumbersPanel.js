'use client';
import { useState } from 'react';
import { Avatar, Box, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';


export default function NumbersPanel({ boardData, initials, squareMap, onRefresh }) {
    const isMobileWidth = useMediaQuery('(max-width: 600px)');
    const isMobileHeight = useMediaQuery('(max-height: 600px)');
    const isMobile = isMobileWidth || isMobileHeight;
    const { gridData, teams } = boardData;
    const horizontalCode = teams?.horizontal?.code || 'H';
    const verticalCode = teams?.vertical?.code || 'V';

    const [viewMode, setViewMode] = useState('mine'); // 'all' | 'grouped' | 'mine'

    // Check if numbers are set (check first non-header cell of first row)
    const numbersSet = gridData && gridData[0] && gridData[0][1] !== null && gridData[0][1] !== undefined && gridData[0][1] !== '';

    const getPlayerNumbers = (player) => {
        const numbers = [];
        if (!gridData) return numbers;

        gridData.forEach((row, r) => {
            if (r === 0) return;
            row.forEach((cell, c) => {
                if (c === 0) return;
                if (cell === player) {
                    numbers.push({
                        h: gridData[0][c],
                        v: gridData[r][0]
                    });
                }
            });
        });

        // Sort by Horizontal number then Vertical number
        return numbers.sort((a, b) => {
            if (a.h !== b.h) return a.h - b.h;
            return a.v - b.v;
        });
    };

    const getAllNumbersFlat = () => {
        const flatList = [];
        if (!gridData) return flatList;

        gridData.forEach((row, r) => {
            if (r === 0) return;
            row.forEach((cell, c) => {
                if (c === 0) return;
                if (cell) {
                    flatList.push({
                        player: cell,
                        h: gridData[0][c],
                        v: gridData[r][0]
                    });
                }
            });
        });

        return flatList.sort((a, b) => {
            if (a.h !== b.h) return a.h - b.h;
            return a.v - b.v;
        });
    };

    const sortedPlayers = Object.keys(squareMap)
        .filter((key) => key !== '_remaining')
        .sort((a, b) => a.localeCompare(b));

    const HeaderControls = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => {
                    if (newMode) setViewMode(newMode);
                }}
                size="small"
                sx={{ height: 32 }}
            >
                <ToggleButton value="mine" sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
                    Mine
                </ToggleButton>
                <ToggleButton value="all" sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
                    All
                </ToggleButton>
                <ToggleButton value="grouped" sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
                    Grouped
                </ToggleButton>
            </ToggleButtonGroup>
            {isMobile && (
                <Box sx={{ width: 0 }} />
            )}
        </Box>
    );

    const TableHeader = ({ label, align = 'center' }) => (
        <TableCell align={align} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            {label}
        </TableCell>
    );

    const PlayerTable = ({ player, showHeader = true }) => {
        const playerNumbers = getPlayerNumbers(player);
        const isUser = player === initials;

        return (
            <Box
                key={player}
                sx={{
                    mb: 2,
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    '&:last-child': { mb: 0 }
                }}
            >
                {/* Player Header */}
                {showHeader && (
                    <Box
                        sx={{
                            bgcolor: isUser ? 'primary.main' : 'grey.100',
                            color: isUser ? 'white' : 'text.primary',
                            px: 2,
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
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
                                {player}
                            </Avatar>
                            <Typography variant="subtitle2" fontWeight="700">
                                {player}
                            </Typography>
                        </Box>
                        <Typography variant="caption" fontWeight="600" sx={{ opacity: 0.9 }}>
                            {playerNumbers.length} SQUARE{playerNumbers.length !== 1 ? 'S' : ''}
                        </Typography>
                    </Box>
                )}

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
        );
    };

    return (
        <Box>
            <Box sx={{ mb: 2, mt: 2, px: isMobile ? 2 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: isMobile ? 'space-between' : 'center', alignItems: 'center' }}>
                    <Typography variant='h5' fontWeight='700' sx={{ display: isMobile ? 'block' : 'none' }}>
                        Numbers
                    </Typography>
                    <Box>
                        <HeaderControls />
                    </Box>
                </Box>
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
                    {viewMode === 'all' && (
                        <TableContainer>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'grey.50' }}>
                                    <TableRow>
                                        <TableHeader label='PLAYER' align="left" />
                                        <TableHeader label={verticalCode} />
                                        <TableHeader label={horizontalCode} />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getAllNumbersFlat().length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                No squares claimed yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {getAllNumbersFlat().map((item, i) => {
                                        const isUser = item.player === initials;
                                        return (
                                            <TableRow
                                                key={i}
                                                sx={{
                                                    bgcolor: isUser ? 'action.selected' : 'inherit',
                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar
                                                            variant='rounded'
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                fontSize: '0.75rem',
                                                                bgcolor: isUser ? 'primary.main' : 'grey.300',
                                                                fontWeight: 'bold',
                                                                color: isUser ? 'white' : 'grey.700',
                                                                mr: 2
                                                            }}
                                                        >
                                                            {item.player}
                                                        </Avatar>
                                                        {item.player}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant='body2' fontWeight='700'>
                                                        {item.v}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant='body2' fontWeight='700'>
                                                        {item.h}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {viewMode === 'grouped' && (
                        <Box>
                            {sortedPlayers.length === 0 && (
                                <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    No players yet.
                                </Typography>
                            )}
                            {sortedPlayers.map((player) => (
                                <PlayerTable key={player} player={player} />
                            ))}
                        </Box>
                    )}

                    {viewMode === 'mine' && (
                        <Box>
                            {!initials ? (
                                <Box sx={{ py: 6, px: 3, textAlign: 'center' }}>
                                    <Typography color="text.secondary">
                                        Please enter your initials above to see your numbers.
                                    </Typography>
                                </Box>
                            ) : !squareMap[initials] ? (
                                <Box sx={{ py: 6, px: 3, textAlign: 'center' }}>
                                    <Typography color="text.secondary">
                                        You haven't claimed any squares yet.
                                    </Typography>
                                </Box>
                            ) : (
                                <PlayerTable player={initials} />
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}
