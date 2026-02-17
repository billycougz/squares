import { Box, Grid, Paper, Tab, Tabs } from '@mui/material';
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
    return (
        <Box sx={{ margin: '1em' }}>
            <Grid container spacing={2} sx={{ marginBottom: '5px' }}>
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
                    <Box sx={{ mt: 2 }}>
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
                <Grid
                    size={{ xs: 12 }}
                    component={Paper}
                    sx={{
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
