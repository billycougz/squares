import { Box, Grid, Paper, Tab, Tabs, useTheme } from '@mui/material';
import AdminPanel from './AdminPanel';
import SummaryPanel from './SummaryPanel';
import NumbersPanel from './NumbersPanel';
import ResultsPanel from './ResultsPanel';

import SquaresGrid from './SquaresGrid';
import SimpleBottomNavigation from '@/components/BottomNav';
import PaymentLink from './PaymentLink';

const hideOnLandscapeStyles = {
    '@media only screen and (orientation: landscape)': {
        display: 'none',
    },
};

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
}) {
    const theme = useTheme();
    const isBoardView = view === 'board';
    const isDataView = ['players', 'results', 'numbers', 'admin'].includes(view);

    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    bgcolor: isDataView ? 'background.paper' : 'background.default',
                    padding: isDataView ? 0 : 2,
                    paddingBottom: '80px',
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
                <Grid container spacing={isDataView ? 0 : 2} sx={{ width: '100%', m: 0 }}>
                    {view === 'admin' && (
                        <Grid size={{ xs: 12 }}>
                            <AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
                        </Grid>
                    )}
                    {view === 'players' && (
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
                            boardData={boardData}
                            initials={initials}
                            onUpdate={setBoardData}
                            setSnackbarMessage={setSnackbarMessage}
                            squareMap={squareMap}
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
