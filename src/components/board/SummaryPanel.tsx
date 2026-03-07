'use client';
import { useState } from 'react';
import { Avatar, Box, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { AttachMoney, GridOn, People } from '@mui/icons-material';

interface SummaryPanelProps {
    boardData: any;
    symbol: string;
    squareMap: Record<string, number>;
    symbolNames: Record<string, string>;
    onRefresh: () => Promise<void>;
    onPlayerClick?: (playerSymbol: string) => void;
}

export default function SummaryPanel({ boardData, symbol, squareMap, symbolNames, onRefresh, onPlayerClick }: SummaryPanelProps) {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'player', direction: 'asc' });
    const isMobileWidth = useMediaQuery('(max-width: 600px)');
    const isMobileHeight = useMediaQuery('(max-height: 600px)');
    const isMobile = isMobileWidth || isMobileHeight;
    const { squarePrice } = boardData;
    const remaining = squareMap['_remaining'];
    const totalSquares = 100;
    const claimed = totalSquares - remaining;
    const allClaimed = remaining === 0;

    const handleSort = (key: string) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const StatBox = ({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) => (
        <Card variant='outlined' sx={{ height: '100%', borderColor: 'rgba(0,0,0,0.08)', borderRadius: 2 }}>
            <CardContent sx={{ p: '16px !important', textAlign: 'center' }}>
                <Box sx={{ color: color, mb: 1, display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
                    {icon}
                </Box>
                <Typography variant='h5' fontWeight='700' sx={{ mb: 0.5 }}>
                    {value}
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );

    const sortedPlayers = Object.keys(squareMap)
        .filter((key) => key !== '_remaining')
        .sort((a, b) => {
            if (sortConfig.key === 'player') {
                // Sort by name if available, fall back to symbol
                const nameA = symbolNames[a] || a;
                const nameB = symbolNames[b] || b;
                return sortConfig.direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            const valA = squareMap[a];
            const valB = squareMap[b];
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        });

    const playerCount = sortedPlayers.length;

    const SortableHeader = ({ label, sortKey, align = 'center' }: { label: string; sortKey: string; align?: 'center' | 'left' | 'right' }) => (
        <TableCell align={align} sx={{ fontWeight: 'bold', color: 'text.secondary', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
            <TableSortLabel
                active={sortConfig.key === sortKey}
                direction={sortConfig.key === sortKey ? sortConfig.direction : 'asc'}
                onClick={() => handleSort(sortKey)}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );

    const handleRowClick = (playerSymbol: string) => {
        if (onPlayerClick) {
            onPlayerClick(playerSymbol);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3, mt: 2, px: isMobile ? 2 : 0 }}>

                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <StatBox
                            icon={<People fontSize='small' />}
                            label='Players'
                            value={playerCount}
                            color='secondary.main'
                        />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <StatBox
                            icon={<GridOn fontSize='small' />}
                            label='Claimed'
                            value={claimed}
                            color='primary.main'
                        />
                    </Box>
                    {!!squarePrice && (
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <StatBox
                                icon={<AttachMoney fontSize='small' />}
                                label='Price'
                                value={`$${squarePrice}`}
                                color='success.main'
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            {remaining === 100 ? (
                <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    No squares claimed yet.
                </Typography>
            ) : (
                <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                        borderColor: 'rgba(0,0,0,0.06)',
                        borderRadius: isMobile ? 0 : 2,
                        borderLeft: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
                        boxShadow: 'none'
                    }}
                >
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <SortableHeader label='PLAYER' sortKey='player' align="left" />
                                <SortableHeader label='SQUARES' sortKey='squares' align="center" />
                                {!!squarePrice && <SortableHeader label='AMOUNT' sortKey='amount' align="right" />}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedPlayers.map((playerSymbol) => {
                                const count = squareMap[playerSymbol];
                                const amount = squarePrice ? count * squarePrice : 0;
                                const isUser = playerSymbol === symbol;
                                const playerName = symbolNames[playerSymbol];

                                return (
                                    <TableRow
                                        key={playerSymbol}
                                        onClick={() => handleRowClick(playerSymbol)}
                                        sx={{
                                            bgcolor: isUser ? 'action.selected' : 'inherit',
                                            transition: 'background-color 0.2s',
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            cursor: onPlayerClick ? 'pointer' : 'default',
                                            '&:hover': onPlayerClick ? {
                                                bgcolor: isUser ? 'action.selected' : 'action.hover',
                                            } : {},
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Tooltip title={playerSymbol} arrow>
                                                    <Avatar
                                                        variant='rounded'
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            fontSize: /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(playerSymbol) ? '1.0rem' : '0.75rem',
                                                            bgcolor: isUser ? 'primary.main' : 'grey.300',
                                                            fontWeight: 500,
                                                            color: isUser ? 'white' : 'grey.700',
                                                            mr: 2
                                                        }}
                                                    >
                                                        {playerSymbol}
                                                    </Avatar>
                                                </Tooltip>
                                                <Typography variant="body2" fontWeight="600">
                                                    {playerName || playerSymbol}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant='body2' fontWeight='600'>
                                                {count}
                                            </Typography>
                                        </TableCell>
                                        {!!squarePrice && (
                                            <TableCell align="right">
                                                <Typography variant='body2' color='success.main' fontWeight='700'>
                                                    ${amount}
                                                </Typography>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
