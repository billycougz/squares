'use client';
import { useState, useCallback } from 'react';
import { Box, Grid, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AdminPanel from './AdminPanel';
import SummaryPanel from './SummaryPanel';
import NumbersPanel from './NumbersPanel';
import ResultsPanel from './ResultsPanel';

import SquaresGrid from './SquaresGrid';
import SimpleBottomNavigation from '@/components/layout/BottomNav';
import PaymentLink from './PaymentLink';

const hideOnLandscapeStyles = {
    '@media only screen and (orientation: landscape)': {
        display: 'none',
    },
};

interface MobileViewProps {
    view: string;
    setView: (view: string) => void;
    setSnackbarMessage: (msg: string) => void;
    boardData: any;
    initials: string;
    setInitials: (initials: string) => void;
    squareMap: Record<string, number>;
    getLatestBoardData: () => Promise<void>;
    anchor?: string;
    id: string;
    boardName: string;
    venmoUsername?: string;
    hasPaid: boolean;
    isAdmin: boolean;
    boardUser: any;
    setShowPaymentDialog: (show: boolean) => void;
    clickMode: 'select' | 'remove' | 'result' | 'numbers' | 'finances' | 'update';
    setClickMode: (mode: 'select' | 'remove' | 'result' | 'numbers' | 'finances' | 'update') => void;
    setBoardData: (data: any) => void;
    highlightColor: string;
}

export default function MobileView({
    view,
    setView,
    setSnackbarMessage,
    boardData,
    initials,
    setInitials,
    squareMap,
    getLatestBoardData,
    anchor,
    id,
    boardName,
    venmoUsername,
    hasPaid,
    isAdmin,
    boardUser,
    setShowPaymentDialog,
    clickMode,
    setClickMode,
    setBoardData,
    highlightColor
}: MobileViewProps) {
    const theme = useTheme();
    const isBoardView = view === 'board';
    const isDataView = ['players', 'results', 'numbers', 'admin'].includes(view);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

    const handlePlayerClick = useCallback((playerInitials: string) => {
        setSelectedPlayer(playerInitials);
        setView('numbers');
    }, [setView]);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    bgcolor: isDataView ? 'background.paper' : 'background.default',
                    padding: isDataView ? 0 : 2,
                    paddingBottom: '80px',
                    overflow: 'hidden', // Contain scrolling to children
                    '@media only screen and (orientation: landscape)': {
                        padding: 0,
                        display: isBoardView ? 'flex' : 'block',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        bgcolor: 'background.default',
                        overflow: 'auto',
                    },
                }}
            >
                {/* Use container if using legacy Grid, or just Grid for Grid2 */}
                <Grid
                    container
                    spacing={isDataView ? 0 : 2}
                    sx={{
                        width: '100%',
                        m: 0,
                        flexGrow: isDataView ? 1 : 0,
                        overflowY: isDataView ? 'auto' : 'visible'
                    }}
                >
                    {view === 'admin' && (
                        /* @ts-ignore */
                        <Grid size={{ xs: 12 }}>
                            <AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
                        </Grid>
                    )}
                    {view === 'players' && (
                        /* @ts-ignore */
                        <Grid size={{ xs: 12 }}>
                            <SummaryPanel
                                boardData={boardData}
                                initials={initials}
                                squareMap={squareMap}
                                onRefresh={getLatestBoardData}
                                onPlayerClick={handlePlayerClick}
                            />
                        </Grid>
                    )}
                    {view === 'numbers' && (
                        /* @ts-ignore */
                        <Grid size={{ xs: 12 }}>
                            <NumbersPanel
                                boardData={boardData}
                                initials={initials}
                                squareMap={squareMap}
                                onRefresh={getLatestBoardData}
                                selectedPlayer={selectedPlayer}
                            />
                        </Grid>
                    )}
                    {view === 'results' && (
                        /* @ts-ignore */
                        <Grid size={{ xs: 12 }}>
                            <ResultsPanel
                                boardData={boardData}
                                initials={initials}
                                anchor={anchor}
                                onRefresh={getLatestBoardData}
                            />
                        </Grid>
                    )}
                </Grid>

                {isBoardView && (
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        marginTop: 2,
                        '@media only screen and (orientation: landscape)': {
                            marginTop: 0,
                            height: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            overflow: 'hidden' // Grid handles scrolling
                        }
                    }}>
                        <Box sx={hideOnLandscapeStyles}>

                            <PaymentLink
                                venmoUsername={venmoUsername}
                                boardUser={boardUser}
                                hasPaid={hasPaid}
                                setShowPaymentDialog={setShowPaymentDialog}
                                squarePrice={boardData.squarePrice}
                                initials={initials}
                                squareCount={squareMap[initials] || 0}
                                variant="banner"
                            />
                            {isAdmin && (
                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography
                                        variant="caption"
                                        fontWeight={800}
                                        color="text.secondary"
                                        sx={{ mb: 0.5, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.65rem' }}
                                    >
                                        Admin Tap Mode
                                    </Typography>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            borderRadius: '14px',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(12px)',
                                            border: `1px solid rgba(0,0,0,0.08)`,
                                            p: 0.5,
                                        }}
                                    >
                                        <Tabs
                                            value={clickMode}
                                            onChange={(e, v) => setClickMode(v)}
                                            sx={{
                                                minHeight: 34,
                                                '& .MuiTab-root': {
                                                    minHeight: 34,
                                                    borderRadius: '10px',
                                                    py: 0,
                                                    px: 2,
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    transition: 'all 0.2s ease',
                                                    '&.Mui-selected': {
                                                        bgcolor: 'primary.main',
                                                        color: 'primary.contrastText',
                                                    }
                                                },
                                                '& .MuiTabs-indicator': {
                                                    display: 'none'
                                                }
                                            }}
                                        >
                                            <Tab icon={<TouchAppIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Select" value="select" disableRipple />
                                            <Tab icon={<DeleteOutlineIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" label="Remove" value="remove" disableRipple />
                                        </Tabs>
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                        <SquaresGrid
                            initials={initials}
                            onUpdate={setBoardData}
                            setSnackbarMessage={setSnackbarMessage}
                            highlightColor={highlightColor}
                            clickMode={clickMode}
                            sx={{ height: '100%' }}
                        />
                    </Box>
                )}
            </Box>
            <Box sx={hideOnLandscapeStyles}>
                <SimpleBottomNavigation onViewChange={setView} view={view} />
            </Box>
        </>
    );
}

