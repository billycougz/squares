import { Button, Paper, Snackbar, Tab, Tabs, useMediaQuery } from '@mui/material';
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
import CustomHeader from '../../components/Header';
import InfoDialog from '../../components/InfoDialog';
import SimpleBottomNavigation from '../../components/BottomNav';
import AppContext from '../../App/AppContext';
import AdminIntroDialog from '../../components/AdminIntroDialog';

const hideOnLandscapeStyles = {
	'@media only screen and (orientation: landscape)': {
		display: 'none',
	},
};

export default function SquaresPage({ }) {
	const { boardData, setBoardData, boardUser, boardInsights, getSubscribedNumber } = useContext(AppContext);
	const { id, gridData, boardName, results, anchor, venmoUsername } = boardData;
	const { isAdmin } = boardUser;

	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [view, setView] = useState('board');
	const [clickMode, setClickMode] = useState('select');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [showInfoDialog, setShowInfoDialog] = useState(false);
	const [showAdminIntroDialog, setShowAdminIntroDialog] = useState(false);

	// Ahhhhhhh, sorry to my future self about the mobile handling...
	const hasMobileHeight = useMediaQuery('(max-width:600px)');
	const hasMobileWidth = useMediaQuery('(max-height:600px)');
	const isMobile = hasMobileHeight || hasMobileWidth;

	useDocumentTitle(`${boardName}`);

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

	const PaymentLink = () => {
		if (!venmoUsername) {
			return null;
		}
		const isFullLink = venmoUsername.toLowerCase().includes('https://venmo.com');
		return (
			<Button
				sx={{ mt: '1rem' }}
				variant='contained'
				fullWidth
				href={isFullLink ? venmoUsername : `https://venmo.com/u/${venmoUsername}`}
				target='_BLANK'
				startIcon={<img src='/venmo.svg' width='24' height='24' />}
			>
				{boardUser.isAdmin || isFullLink ? `Open Venmo` : `Venmo @${venmoUsername}`}
			</Button>
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
					/>
				</Grid>
				<Grid xs={12} sm={7} display={isAdmin ? '' : 'none'}>
					<AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
				</Grid>
				<Grid xs={12} sm={isAdmin ? 5 : 6}>
					<SummaryPanel boardData={boardData} initials={initials} squareMap={squareMap} />
				</Grid>
				<Grid xs={12} sm={isAdmin ? 7 : 12} md={isAdmin ? 7 : 6}>
					<ResultsPanel boardData={boardData} initials={initials} anchor={anchor} />
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
			<Box sx={{ flexGrow: 1, padding: '1em' }}>
				<Grid container spacing={2}>
					{view === 'admin' && (
						<Grid xs={12}>
							<AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
						</Grid>
					)}
					{view === 'players' && (
						<Grid xs={12}>
							<SummaryPanel boardData={boardData} initials={initials} squareMap={squareMap} />
						</Grid>
					)}
					{view === 'results' && (
						<Grid xs={12}>
							<ResultsPanel boardData={boardData} initials={initials} anchor={anchor} />
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
			{isMobile ? <MobileView /> : <NonMobileView />}
		</div>
	);
}

function generateRefreshMessage(prevData, nextData) {
	if (!nextData) {
		return 'Board refreshed successfully.';
	}

	const { gridData: prevGrid, results: prevResults = [] } = prevData || {};
	const { gridData: nextGrid, results: nextResults = [] } = nextData;

	// Check for new winners
	let newWinner = null;
	for (let i = 0; i < nextResults.length; i++) {
		const next = nextResults[i];
		const prev = prevResults[i] || {};
		// Check if a winner was added or changed in this refresh
		if (next.winner && next.winner !== prev.winner) {
			newWinner = next;
		}
	}

	if (newWinner) {
		const quarterLabel = newWinner.quarter === 'Q4' ? 'the Final' : newWinner.quarter;
		return `Board refreshed. Congratulations ${newWinner.winner} for winning ${quarterLabel}.`;
	}

	// Check if game is over (Final winner already declared)
	const finalResult = nextResults.find((r) => r.quarter === 'Q4');
	const prevFinalResult = prevResults.find((r) => r.quarter === 'Q4');
	if (finalResult?.winner && prevFinalResult?.winner === finalResult.winner) {
		return 'What a game. Thanks for playing Squares!';
	}

	// Check if numbers were just set
	const hasNumbers = (grid) => grid && grid[0] && grid[0][1] != null;
	if (!hasNumbers(prevGrid) && hasNumbers(nextGrid)) {
		return 'Board refreshed. The numbers have been set - good luck!';
	}

	// Check for additional square claims
	const newClaimsMap = {};
	let totalNewClaims = 0;

	if (prevGrid && nextGrid) {
		prevGrid.forEach((row, r) => {
			if (r === 0) return; // Skip header row
			row.forEach((val, c) => {
				if (c === 0) return; // Skip header col
				if (!val && nextGrid[r] && nextGrid[r][c]) {
					const user = nextGrid[r][c];
					newClaimsMap[user] = (newClaimsMap[user] || 0) + 1;
					totalNewClaims += 1;
				}
			});
		});
	}

	const claimers = Object.keys(newClaimsMap);
	if (claimers.length > 1) {
		return `Board refreshed. Multiple users have claimed additional squares. ${totalNewClaims} additional squares claimed.`;
	} else if (claimers.length === 1) {
		const user = claimers[0];
		const count = newClaimsMap[user];
		return `Board refreshed. ${user} claimed ${count} new square${count > 1 ? 's' : ''}.`;
	}

	// Check for no changes
	if (
		JSON.stringify(prevGrid) === JSON.stringify(nextGrid) &&
		JSON.stringify(prevResults) === JSON.stringify(nextResults)
	) {
		return 'Board refreshed. No changes.';
	}

	if (!prevData) {
		return null;
	}

	return 'Board refreshed successfully.';
}
