import { Box, Grid, Paper, Tab, Tabs, useTheme } from '@mui/material';
import AdminPanel from './AdminPanel';
import SummaryPanel from './SummaryPanel';
import NumbersPanel from './NumbersPanel';
import ResultsPanel from './ResultsPanel';
import InitialsBox from './InitialsBox';
import SquaresGrid from './SquaresGrid';
import PaymentLink from './PaymentLink';

export default function NonMobileView({
    id,
    initials,
    setInitials,
    boardName,
    setSnackbarMessage,
    getLatestBoardData,
    venmoUsername,
    hasPaid,
    isAdmin,
    setView,
    boardData,
    squareMap,
    anchor,
    boardUser,
    setShowPaymentDialog,
    clickMode,
    setClickMode,
    setBoardData,
    highlightColor
}) {
    const theme = useTheme();

    return (
        <Box sx={{ margin: 2, maxWidth: '1600px', mx: 'auto' }}>
            <Grid container spacing={3} sx={{ marginBottom: 2 }}>
                <Grid size={{ xs: 12, sm: isAdmin ? 5 : 6 }}>
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
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }} display={isAdmin ? '' : 'none'}>
                    <AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
                </Grid>
                <Grid size={{ xs: 12, sm: isAdmin ? 5 : 6 }}>
                    <SummaryPanel
                        boardData={boardData}
                        initials={initials}
                        squareMap={squareMap}
                        onRefresh={getLatestBoardData}
                    />
                    <Box sx={{ mt: 3 }}>
                        <NumbersPanel
                            boardData={boardData}
                            initials={initials}
                            squareMap={squareMap}
                            onRefresh={getLatestBoardData}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: isAdmin ? 7 : 12, md: isAdmin ? 7 : 6 }}>
                    <ResultsPanel
                        boardData={boardData}
                        initials={initials}
                        anchor={anchor}
                        onRefresh={getLatestBoardData}
                    />
                </Grid>
            </Grid>
            {venmoUsername && (
                <Grid sx={{ margin: '-1em 0 10px 0', textAlign: 'center' }}>
                    <PaymentLink
                        venmoUsername={venmoUsername}
                        boardUser={boardUser}
                        hasPaid={hasPaid}
                        setShowPaymentDialog={setShowPaymentDialog}
                    />
                </Grid>
            )}

            {isAdmin && (
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        mb: 2,
                        p: 0.5,
                        width: 'fit-content',
                        mx: 'auto',
                        background: theme.palette.background.paper,
                    }}
                >
                    <Tabs
                        value={clickMode}
                        onChange={(e, v) => setClickMode(v)}
                        sx={{ minHeight: 40 }}
                    >
                        <Tab label='Select' value='select' sx={{ minHeight: 40 }} />
                        <Tab label='Remove' value='remove' sx={{ minHeight: 40 }} />
                    </Tabs>
                </Paper>
            )}
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
    );
}
