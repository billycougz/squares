import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar, Tab, Tabs, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useContext, useEffect, useState } from 'react';
import { useDocumentTitle, useLocalStorage } from 'usehooks-ts';
import { loadBoard } from '../../api';
import AdminPanel from './AdminPanel';
import InitialsBox from './InitialsBox';
import ResultsPanel from './ResultsPanel';
import SquaresGrid from './SquaresGrid';
import SummaryPanel from './SummaryPanel';
import NumbersPanel from './NumbersPanel';
import CustomHeader from '../../components/Header';
import InfoDialog from '../../components/InfoDialog';
import SimpleBottomNavigation from '../../components/BottomNav';
import AppContext from '../../App/AppContext';
import AdminIntroDialog from '../../components/AdminIntroDialog';
import { generateRefreshMessage } from '../../utils/generateRefreshMessage';

const hideOnLandscapeStyles = {
	'@media only screen and (orientation: landscape)': {
		display: 'none',
	},
};

export default function SquaresPage({ }) {
	const { boardData, setBoardData, boardUser, setBoardUser, boardInsights, getSubscribedNumber } = useContext(AppContext);
	const { id, gridData, boardName, results, anchor, venmoUsername } = boardData;
	const { isAdmin } = boardUser;

	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [view, setView] = useState('board');
	const [clickMode, setClickMode] = useState('select');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [showInfoDialog, setShowInfoDialog] = useState(false);
	const [showAdminIntroDialog, setShowAdminIntroDialog] = useState(false);
	const [hasPaid, setHasPaid] = useState(false);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);

	// Ahhhhhhh, sorry to my future self about the mobile handling...
	const hasMobileHeight = useMediaQuery('(max-width:600px)');
	const hasMobileWidth = useMediaQuery('(max-height:600px)');
	const isMobile = hasMobileHeight || hasMobileWidth;

	useDocumentTitle(`${boardName}`);

	// Sync hasPaid state when board changes
	useEffect(() => {
		const storedValue = localStorage.getItem(`squares-paid-${id}`);
		setHasPaid(storedValue === 'true');
	}, [id, setHasPaid]);

	// Sync admin status when board changes
	useEffect(() => {
		const recentBoards = JSON.parse(localStorage.getItem('recent-squares') || '[]');
		const currentBoard = recentBoards.find(board => board.id === id);
		if (currentBoard) {
			setBoardUser({ isAdmin: Boolean(currentBoard.adminCode) });
		}
	}, [id, setBoardUser]);

	useEffect(() => {
		// Handle results anchor
		if (anchor === 'results') {
			const { winner } = results.findLast((result) => !!result.winner);
			if (winner === initials) {
				setSnackbarMessage('Congratulations, you won the latest squares quarter!');
			}
		}
	}, [boardData]);

	// ToDo: Account for admin accessing without initials or phone
	// ToDo: Remove showAdminIntroDialog checks in rendering if not needed
	const handleIntroFlows = () => {
		if (boardUser.isAdmin && !boardData.adminIntroComplete) {
			// If admin and adminIntro not complete, show adminIntro
			setShowAdminIntroDialog(true);
			return true;
		} else if (!initials) {
			// If initials not set, show the full intro
			setShowInfoDialog({ intro: true });
			return true;
		} else if (!boardInsights?.getClaimCount(initials)) {
			// If no claims, show either full intro or info only dependent on whether subscribed
			const isSubscribed = Boolean(getSubscribedNumber(initials));
			setShowInfoDialog({ intro: !isSubscribed });
			return true;
		}
		return false;
	};

	useEffect(() => {
		const introShown = handleIntroFlows();
		if (!introShown) {
			const message = generateRefreshMessage(null, boardData);
			if (message) {
				setSnackbarMessage(message);
			}
		}
	}, []);

	const highlightColor = '#1876d1';

	const squareMap = gridData.reduce(
		(map, row, rowIndex) => {
			if (!rowIndex) {
				return map;
			}
			row.forEach((value, colIndex) => {
				if (!colIndex) {
					return map;
				}
				if (!value) {
					value = '_remaining';
				}
				map[value] = map[value] ? map[value] + 1 : 1;
			});
			return map;
		},
		{ _remaining: 0 }
	);

	const getLatestBoardData = async () => {
		const data = await loadBoard({ id });
		if (data && !data.error) {
			const message = generateRefreshMessage(boardData, data);
			setBoardData(data);
			setSnackbarMessage(message || 'Board refreshed successfully.');
		} else {
			setSnackbarMessage('Failed to refresh board');
		}
	};

	const handleSelectBoard = async (board) => {
		const data = await loadBoard({ id: board.id, adminCode: board.adminCode });
		if (data && !data.error) {
			// Set admin status based on whether we have an adminCode for this board
			setBoardUser({ isAdmin: Boolean(board.adminCode) });
			setBoardData(data);
			setSnackbarMessage(`Loaded board: ${board.boardName}`);
		} else {
			setSnackbarMessage('Failed to load board');
		}
	};

	const handlePaymentConfirm = () => {
		setHasPaid(true);
		localStorage.setItem(`squares-paid-${id}`, 'true');
		setShowPaymentDialog(false);
		setSnackbarMessage('Payment status updated!');
	};

	const PaymentLink = () => {
		if (!venmoUsername) {
			return null;
		}
		const isFullLink = venmoUsername.toLowerCase().includes('https://venmo.com');
		const venmoUrl = isFullLink ? venmoUsername : `https://venmo.com/u/${venmoUsername}`;

		// Admins only see the minimized icon in InitialsBox
		if (boardUser.isAdmin || hasPaid) {
			return null;
		}

		return (
			<Box sx={{ mt: '1rem', display: 'flex', gap: 1 }}>
				<Button
					sx={{ flex: 1 }}
					variant='contained'
					fullWidth
					href={venmoUrl}
					target='_BLANK'
					startIcon={<img src='/venmo.svg' width='24' height='24' />}
				>
					{isFullLink ? `Open Venmo` : `Venmo @${venmoUsername}`}
				</Button>
				<Button
					variant='contained'
					onClick={() => setShowPaymentDialog(true)}
					sx={{
						minWidth: '120px',
						backgroundColor: '#66bb6a',
						'&:hover': {
							backgroundColor: '#57a05a'
						}
					}}
				>
					Mark Paid
				</Button>
			</Box>
		);
	};

	const NonMobileView = () => (
		<Box sx={{ margin: '1em' }}>
			<Grid container spacing={2} sx={{ marginBottom: '5px' }}>
				<Grid xs={12} sm={isAdmin ? 5 : 6}>
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
				<Grid xs={12} sm={7} display={isAdmin ? '' : 'none'}>
					<AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
				</Grid>
				<Grid xs={12} sm={isAdmin ? 5 : 6}>
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
				<Grid xs={12} sm={isAdmin ? 7 : 12} md={isAdmin ? 7 : 6}>
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
					<PaymentLink />
				</Grid>
			)}

			{isAdmin && (
				<Grid
					xs={12}
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

	// ... existing code ...
	const MobileView = () => (
		<>
			<Box
				sx={{
					flexGrow: 1,
					minHeight: '100vh',
					bgcolor: view === 'players' || view === 'results' || view === 'numbers' || view === 'admin' ? 'white' : 'transparent',
					padding: view === 'players' || view === 'results' || view === 'numbers' || view === 'admin' ? 0 : '1em',
					paddingBottom: '80px',
					'@media only screen and (orientation: landscape)': {
						paddingBottom: '1em',
					},
				}}
			>
				<Grid container spacing={view === 'players' || view === 'results' || view === 'numbers' || view === 'admin' ? 0 : 2}>
					{view === 'admin' && (
						<Grid xs={12}>
							<AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
						</Grid>
					)}
					{view === 'players' && (
						<Grid xs={12}>
							<SummaryPanel
								boardData={boardData}
								initials={initials}
								squareMap={squareMap}
								onRefresh={getLatestBoardData}
							/>
						</Grid>
					)}
					{view === 'numbers' && (
						<Grid xs={12}>
							<NumbersPanel
								boardData={boardData}
								initials={initials}
								squareMap={squareMap}
								onRefresh={getLatestBoardData}
							/>
						</Grid>
					)}
					{view === 'results' && (
						<Grid xs={12}>
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
					<Box sx={{ marginTop: '1em' }}>
						<Box sx={{ ...hideOnLandscapeStyles }}>
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
						</Box>
						<PaymentLink />
						{isAdmin && (
							// ... existing code ...
							<Grid
								xs={12}
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

	return (
		<div>
			<Box sx={isMobile && hideOnLandscapeStyles}>
				<CustomHeader
					boardName={boardName}
					onHomeClick={() => setBoardData(null)}
					onInfoClick={() => setShowInfoDialog({ intro: false })}
					onRefresh={getLatestBoardData}
					onSelectBoard={handleSelectBoard}
				/>
			</Box>

			<Snackbar
				open={!!snackbarMessage}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				onClose={() => setSnackbarMessage('')}
				message={snackbarMessage}
			/>
			{showInfoDialog && <InfoDialog onClose={() => setShowInfoDialog(false)} isIntro={showInfoDialog?.intro} />}
			{showAdminIntroDialog && (
				<AdminIntroDialog setSnackbarMessage={setSnackbarMessage} onClose={() => setShowAdminIntroDialog(false)} />
			)}
			<Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
				<DialogTitle>Confirm Payment</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Have you completed your payment via Venmo?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
					<Button
						onClick={handlePaymentConfirm}
						variant="contained"
						autoFocus
						sx={{
							backgroundColor: '#66bb6a',
							'&:hover': {
								backgroundColor: '#57a05a'
							}
						}}
					>
						Yes, I've Paid
					</Button>
				</DialogActions>
			</Dialog>
			{isMobile ? <MobileView /> : <NonMobileView />}
		</div>
	);
}


