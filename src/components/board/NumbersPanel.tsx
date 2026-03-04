'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, ButtonBase, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from '@mui/material';

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
    const chipRowRef = useRef<HTMLDivElement>(null);
    const chipRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        if (selectedPlayer) {
            setActivePlayer(selectedPlayer);
        }
    }, [selectedPlayer]);

    // Auto-scroll to active player chip
    useEffect(() => {
        if (activePlayer && chipRefs.current[activePlayer] && chipRowRef.current) {
            const chip = chipRefs.current[activePlayer];
            const container = chipRowRef.current;
            if (chip) {
                const chipLeft = chip.offsetLeft;
                const chipWidth = chip.offsetWidth;
                const containerWidth = container.offsetWidth;
                const scrollTarget = chipLeft - containerWidth / 2 + chipWidth / 2;
                container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
            }
        }
    }, [activePlayer]);

    const numbersSet = gridData && gridData[0] && gridData[0][1] !== null && gridData[0][1] !== undefined && gridData[0][1] !== '';

    const sortedPlayers = Object.keys(squareMap)
        .filter((key) => key !== '_remaining')
        .sort((a, b) => a.localeCompare(b));

    // Ensure active player appears in chip row even with 0 squares
    const chipPlayers = [...sortedPlayers];
    if (activePlayer && !chipPlayers.includes(activePlayer)) {
        chipPlayers.unshift(activePlayer);
    }

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

    const TableHeader = ({ label, align = 'center' }: { label: string; align?: 'center' | 'left' | 'right' }) => (
        <TableCell align={align} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            {label}
        </TableCell>
    );

    return (
        <Box>
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
                    {!activePlayer && chipPlayers.length === 0 ? (
                        <Box sx={{ py: 6, px: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Please enter your initials above to see your numbers.
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {/* Stories-style player scroll */}
                            <Box
                                ref={chipRowRef}
                                sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    px: 2,
                                    py: 1.5,
                                    overflowX: 'auto',
                                    '&::-webkit-scrollbar': { display: 'none' },
                                    scrollbarWidth: 'none',
                                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                                }}
                            >
                                {chipPlayers.map((player) => {
                                    const isActive = player === activePlayer;
                                    const isSelf = player === initials;
                                    const count = squareMap[player] || 0;
                                    return (
                                        <ButtonBase
                                            key={player}
                                            ref={(el: HTMLElement | null) => { chipRefs.current[player] = el; }}
                                            onClick={() => setActivePlayer(player)}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                flexShrink: 0,
                                                borderRadius: 2,
                                                p: 0.5,
                                                transition: 'transform 0.15s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            {/* Ring + circle */}
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '2.5px solid',
                                                    borderColor: isActive
                                                        ? (isSelf ? 'primary.main' : 'grey.700')
                                                        : 'transparent',
                                                    transition: 'border-color 0.2s ease',
                                                    p: '3px',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: isActive
                                                            ? (isSelf ? 'primary.main' : 'grey.800')
                                                            : (isSelf ? 'primary.light' : 'grey.200'),
                                                        color: isActive
                                                            ? 'white'
                                                            : (isSelf ? 'white' : 'grey.700'),
                                                        fontSize: player.length > 3 ? '0.55rem' : player.length > 2 ? '0.6rem' : '0.7rem',
                                                        fontWeight: 800,
                                                        letterSpacing: '-0.02em',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    {player}
                                                </Box>
                                            </Box>
                                            {/* Count label */}
                                            <Typography
                                                variant='caption'
                                                sx={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: isActive ? 700 : 600,
                                                    color: isActive ? 'text.primary' : 'text.secondary',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {count}
                                            </Typography>
                                        </ButtonBase>
                                    );
                                })}
                            </Box>

                            {/* Content below chips */}
                            {!activePlayer ? (
                                <Box sx={{ py: 5, px: 3, textAlign: 'center' }}>
                                    <Typography color="text.secondary" variant="body2">
                                        Tap a player to see their numbers.
                                    </Typography>
                                </Box>
                            ) : !squareMap[activePlayer] ? (
                                <Box sx={{ py: 5, px: 3, textAlign: 'center' }}>
                                    <Typography color="text.secondary" variant="body2">
                                        {isUser ? "You haven't claimed any squares yet." : `${activePlayer} hasn't claimed any squares yet.`}
                                    </Typography>
                                </Box>
                            ) : (
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
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}
