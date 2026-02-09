import { useState } from 'react';
import { Avatar, Box, Chip, Divider, Grid, IconButton, List, ListItem, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';

import CustomAccordion from '../../components/Accordion';

export default function NumbersPanel({ boardData, initials, squareMap, onRefresh }) {
    const isMobileWidth = useMediaQuery('(max-width: 600px)');
    const isMobileHeight = useMediaQuery('(max-height: 600px)');
    const isMobile = isMobileWidth || isMobileHeight;
    const { gridData, teams } = boardData;
    const horizontalCode = teams?.horizontal?.code || 'H';
    const verticalCode = teams?.vertical?.code || 'V';

    const [viewMode, setViewMode] = useState('all'); // 'all' | 'mine'

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
                <ToggleButton value="all" sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
                    All
                </ToggleButton>
                <ToggleButton value="grouped" sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
                    Grouped
                </ToggleButton>
                <ToggleButton value="mine" sx={{ px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
                    Mine
                </ToggleButton>
            </ToggleButtonGroup>
            {isMobile && (
                <Box sx={{ width: 0 }} />
            )}
        </Box>
    );

    const TableHeader = ({ label, align = 'center', xs }) => (
        <Grid item xs={xs} sx={{ display: 'flex', justifyContent: align }}>
            <Typography variant='caption' fontWeight='700' color='text.secondary'>
                {label}
            </Typography>
        </Grid>
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
                <Box>
                    <List disablePadding>
                        <ListItem sx={{ bgcolor: 'grey.50', py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                            <Grid container alignItems='center'>
                                <TableHeader label={verticalCode} xs={6} />
                                <TableHeader label={horizontalCode} xs={6} />
                            </Grid>
                        </ListItem>
                        {playerNumbers.map((pair, i) => (
                            <Box key={i}>
                                <ListItem sx={{ py: 1 }}>
                                    <Grid container alignItems='center'>
                                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Typography variant='body2' fontWeight='700'>
                                                {pair.h}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Typography variant='body2' fontWeight='700'>
                                                {pair.v}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {i < playerNumbers.length - 1 && <Divider component="li" />}
                            </Box>
                        ))}
                    </List>
                </Box>
            </Box>
        );
    };

    return (
        <CustomAccordion title='Player Numbers'>
            <Box sx={{ mb: 2, mt: 2, px: isMobile ? 2 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h5' fontWeight='700' sx={{ display: isMobile ? 'block' : 'none' }}>
                        Numbers
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
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
                        <List disablePadding>
                            <ListItem sx={{ bgcolor: 'grey.50', py: 1.5 }}>
                                <Grid container alignItems='center'>
                                    <TableHeader label='PLAYER' xs={4} />
                                    <TableHeader label={verticalCode} xs={4} />
                                    <TableHeader label={horizontalCode} xs={4} />
                                </Grid>
                            </ListItem>
                            <Divider />
                            {getAllNumbersFlat().length === 0 && (
                                <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    No squares claimed yet.
                                </Typography>
                            )}
                            {getAllNumbersFlat().map((item, i, arr) => {
                                const isUser = item.player === initials;
                                return (
                                    <Box key={i}>
                                        <ListItem
                                            sx={{
                                                bgcolor: isUser ? 'action.selected' : 'inherit',
                                                py: 1
                                            }}
                                        >
                                            <Grid container alignItems='center'>
                                                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Avatar
                                                        variant='rounded'
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            fontSize: '0.75rem',
                                                            bgcolor: isUser ? 'primary.main' : 'grey.300',
                                                            fontWeight: 'bold',
                                                            color: isUser ? 'white' : 'grey.700',
                                                        }}
                                                    >
                                                        {item.player}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Typography variant='body2' fontWeight='700'>
                                                        {item.h}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Typography variant='body2' fontWeight='700'>
                                                        {item.v}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        {i < arr.length - 1 && <Divider component='li' sx={{ '&:last-child': { display: 'none' } }} />}
                                    </Box>
                                );
                            })}
                        </List>
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
        </CustomAccordion>
    );
}
