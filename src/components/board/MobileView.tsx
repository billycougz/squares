'use client';
import { Box, Grid, Paper, Tab, Tabs, useTheme } from '@mui/material';
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
                            />
                            {isAdmin && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 2,
                                        p: 0.5,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 2,
                                        background: theme.palette.background.paper,
                                    }}
                                >
                                    <Tabs
                                        value={clickMode}
                                        onChange={(e, v) => setClickMode(v)}
                                        sx={{ minHeight: 36 }}
                                    >
                                        <Tab label='Select' value='select' sx={{ minHeight: 36, py: 0.5 }} />
                                        <Tab label='Remove' value='remove' sx={{ minHeight: 36, py: 0.5 }} />
                                    </Tabs>
                                </Paper>
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

