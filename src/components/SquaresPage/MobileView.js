import { Box, Grid, Paper, Tab, Tabs } from '@mui/material';
import AdminPanel from './AdminPanel';
import SummaryPanel from './SummaryPanel';
import NumbersPanel from './NumbersPanel';
import ResultsPanel from './ResultsPanel';
import InitialsBox from './InitialsBox';
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
    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    bgcolor: view === 'players' || view === 'results' || view === 'numbers' || view === 'admin' ? 'white' : 'transparent',
                    padding: view === 'players' || view === 'results' || view === 'numbers' || view === 'admin' ? 0 : '1em',
                    paddingBottom: '80px',
                    '@media only screen and (orientation: landscape)': {
                        padding: 0,
                        display: view === 'board' ? 'flex' : 'block',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    },
                }}
            >
                <Grid container spacing={view === 'players' || view === 'results' || view === 'numbers' || view === 'admin' ? 0 : 2} sx={{ width: '100%', m: 0 }}>
                    {view === 'admin' && (
                        <Grid size={{ xs: 12 }} sx={{ width: '100%', maxWidth: '100%' }}>
                            <AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
                        </Grid>
                    )}
                    {view === 'players' && (
                        <Grid size={{ xs: 12 }} sx={{ width: '100%', maxWidth: '100%' }}>
                            <SummaryPanel
                                boardData={boardData}
                                initials={initials}
                                squareMap={squareMap}
                                onRefresh={getLatestBoardData}
                            />
                        </Grid>
                    )}
                    {view === 'numbers' && (
                        <Grid size={{ xs: 12 }} sx={{ width: '100%', maxWidth: '100%' }}>
                            <NumbersPanel
                                boardData={boardData}
                                initials={initials}
                                squareMap={squareMap}
                                onRefresh={getLatestBoardData}
                            />
                        </Grid>
                    )}
                    {view === 'results' && (
                        <Grid size={{ xs: 12 }} sx={{ width: '100%', maxWidth: '100%' }}>
                            <ResultsPanel
                                boardData={boardData}
                                initials={initials}
                                anchor={anchor}
                                onRefresh={getLatestBoardData}
                            />
                        </Grid>
                    )}
                </Grid>

                {view === 'board' && (
                    <Box sx={{
                        marginTop: '1em',
                        '@media only screen and (orientation: landscape)': {
                            mt: 0
                        }
                    }}>
                        <Box sx={hideOnLandscapeStyles}>
                            <InitialsBox
                                id={id}
                                initials={initials}
                                boardName={boardName}
                                onChange={setInitials}
                                setSnackbarMessage={setSnackbarMessage}
                                onRefresh={getLatestBoardData}
                                venmoUsername={venmoUsername}
                                hasPaid={hasPaid}
                                isAdmin={isAdmin}
                            />
                            <PaymentLink
                                venmoUsername={venmoUsername}
                                boardUser={boardUser}
                                hasPaid={hasPaid}
                                setShowPaymentDialog={setShowPaymentDialog}
                            />
                            {isAdmin && (
                                <Grid
                                    size={{ xs: 12 }}
                                    component={Paper}
                                    sx={{
                                        mt: '1em',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-evenly',
                                        border: `solid 1px rgb(133, 133, 133)`,
                                    }}
                                >
                                    <Tabs color='primary' value={clickMode} size='small' onChange={(e, v) => setClickMode(v)}>
                                        <Tab label='Select' value='select' />
                                        <Tab label='Remove' value='remove' />
                                    </Tabs>
                                </Grid>
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
