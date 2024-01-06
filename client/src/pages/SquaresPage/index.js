import { Paper, Snackbar, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { useDocumentTitle, useLocalStorage } from 'usehooks-ts';
import AdminPanel from './AdminPanel';
import InitialsBox from './InitialsBox';
import ResultsPanel from './ResultsPanel';
import SquaresGrid from './SquaresGrid';
import SummaryPanel from './SummaryPanel';
import CustomHeader from '../../components/Header';
import InfoDialog from '../../components/InfoDialog';
import SimpleBottomNavigation from '../../components/BottomNav';

const hideOnLandscapeStyles = {
	'@media only screen and (orientation: landscape)': {
		display: 'none',
	},
};

export default function SquaresPage({ boardData, onUpdate, onHomeClick }) {
	const { id, gridData, boardName, results, isAdmin, anchor } = boardData;

	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [view, setView] = useState('board');
	const [clickMode, setClickMode] = useState('select');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [showInfoDialog, setShowInfoDialog] = useState(false);

	// Ahhhhhhh, sorry to my future self about the mobile handling...
	const hasMobileHeight = useMediaQuery('(max-width:600px)');
	const hasMobileWidth = useMediaQuery('(max-height:600px)');
	const isMobile = hasMobileHeight || hasMobileWidth;

	useDocumentTitle(`${boardName} | Squares`);

	useEffect(() => {
		if (anchor === 'results') {
			const { winner } = results.findLast((result) => !!result.winner);
			if (winner === initials) {
				setSnackbarMessage('Congratulations, you won the latest squares quarter!');
			}
		}
	}, [boardData]);

	useEffect(() => {
		if (!initials) {
			setShowInfoDialog(true);
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
					/>
				</Grid>
				<Grid xs={12} sm={7} display={isAdmin ? '' : 'none'}>
					<AdminPanel boardData={boardData} setSnackbarMessage={setSnackbarMessage} onUpdate={onUpdate} />
				</Grid>
				<Grid xs={12} sm={isAdmin ? 5 : 6}>
					<SummaryPanel boardData={boardData} initials={initials} squareMap={squareMap} />
				</Grid>
				<Grid xs={12} sm={isAdmin ? 7 : 12} md={isAdmin ? 7 : 6}>
					<ResultsPanel boardData={boardData} initials={initials} anchor={anchor} />
				</Grid>
			</Grid>
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
				onUpdate={onUpdate}
				setSnackbarMessage={setSnackbarMessage}
				squareMap={squareMap}
				highlightColor={highlightColor}
				clickMode={clickMode}
			/>
		</Box>
	);

	const MobileView = () => (
		<>
			<Box sx={{ flexGrow: 1, padding: '1em' }}>
				<Grid container spacing={2}>
					{view === 'admin' && (
						<Grid xs={12}>
							<AdminPanel boardData={boardData} setSnackbarMessage={setSnackbarMessage} onUpdate={onUpdate} />
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
							/>
						</Box>
						{isAdmin && (
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
							onUpdate={onUpdate}
							setSnackbarMessage={setSnackbarMessage}
							squareMap={squareMap}
							highlightColor={highlightColor}
							clickMode={clickMode}
						/>
					</Box>
				)}
			</Box>
			<Box sx={hideOnLandscapeStyles}>
				<SimpleBottomNavigation isAdmin={isAdmin} onViewChange={setView} view={view} />
			</Box>
		</>
	);

	return (
		<div>
			<Box sx={isMobile && hideOnLandscapeStyles}>
				<CustomHeader boardName={boardName} onHomeClick={onHomeClick} onInfoClick={() => setShowInfoDialog(true)} />
			</Box>

			<Snackbar
				open={!!snackbarMessage}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				onClose={() => setSnackbarMessage('')}
				message={snackbarMessage}
			/>
			{showInfoDialog && <InfoDialog onClose={() => setShowInfoDialog(false)} isAdmin={isAdmin} />}
			{isMobile ? <MobileView /> : <NonMobileView />}
		</div>
	);
}
