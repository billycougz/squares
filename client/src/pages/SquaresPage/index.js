import { Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import { useDocumentTitle, useLocalStorage } from 'usehooks-ts';
import AdminPanel from './AdminPanel';
import InitialsBox from './InitialsBox';
import ResultsPanel from './ResultsPanel';
import SquaresGrid from './SquaresGrid';
import SummaryPanel from './SummaryPanel';

export default function SquaresPage({ boardData, onUpdate }) {
	const { gridData, boardName, results, isAdmin, anchor } = boardData;
	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	useDocumentTitle(`${boardName} | Squares`);

	useEffect(() => {
		if (anchor === 'results') {
			const { winner } = results.findLast((result) => !!result.winner);
			if (winner === initials) {
				setSnackbarMessage('Congratulations, you won the latest squares quarter!');
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

	return (
		<Box sx={{ flexGrow: 1, margin: '1em' }}>
			<Snackbar
				open={!!snackbarMessage}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				onClose={() => setSnackbarMessage('')}
				message={snackbarMessage}
			/>

			<Grid container spacing={2}>
				<Grid xs={12} sm={isAdmin ? 5 : 6}>
					<InitialsBox
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

			<SquaresGrid
				boardData={boardData}
				initials={initials}
				onUpdate={onUpdate}
				setSnackbarMessage={setSnackbarMessage}
				squareMap={squareMap}
				highlightColor={highlightColor}
			/>
		</Box>
	);
}
