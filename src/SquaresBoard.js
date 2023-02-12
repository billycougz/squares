import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Cell from './Cell';
import TextField from '@mui/material/TextField';
import { Alert, Button, FormControl, FormLabel, Paper } from '@mui/material';

export default function SquaresBoard({ boardData, onUpdate, isAdmin }) {
	const [teamSides, setTeamSides] = useState({ horizontal: 0, vertical: 1 });
	const [initials, setInitials] = useState('');

	const { gridData } = boardData;

	const teams = [
		{ name: 'Eagles', color: '#004d56' },
		{ name: 'Chiefs', color: '#ca243e' },
	];

	const setNumbers = () => {
		const doContinue = window.confirm('Set the numbers? This can only be done once.');
		if (doContinue) {
			const ordered = Array.from(Array(10).keys());
			const horizontal = [undefined, ...ordered.sort((a, b) => 0.5 - Math.random())];
			const vertical = [undefined, ...ordered.sort((a, b) => 0.5 - Math.random())];
			const updatedData = gridData.map((row, rowIndex) => {
				if (rowIndex) {
					const verticalValue = vertical[rowIndex];
					row.shift();
					return [verticalValue, ...row];
				}
				return horizontal;
			});
			onUpdate(updatedData);
		}
	};

	const handleSwapTeams = () => {
		const { horizontal, vertical } = teamSides;
		setTeamSides({ horizontal: vertical, vertical: horizontal });
	};

	const handleSquareClick = ([row, col]) => {
		gridData[row][col] = initials;
		onUpdate([...gridData]);
	};

	const getCellColor = (row, col) => {
		if (!row && !col) {
			return '';
		}
		return !row || !col ? teams[teamSides[!row ? 'vertical' : 'horizontal']].color : '';
	};

	const isLocked = gridData[0].some((value) => value);

	return (
		<Box sx={{ flexGrow: 1, margin: '1em' }}>
			<Paper sx={{ padding: '1em', width: 'fit-content' }}>
				<FormControl>
					<FormLabel>Enter your initials then select your squares</FormLabel>
					<TextField
						label='Initials'
						variant='outlined'
						value={initials}
						onChange={(e) => setInitials(e.target.value)}
						sx={{ margin: '1em 0' }}
						fullWidth
					/>
				</FormControl>

				{!isLocked && isAdmin && (
					<div>
						<Button onClick={setNumbers} variant='contained'>
							Set Numbers
						</Button>
						{/* Disabling until fully handled - <Button onClick={handleSwapTeams}>Swap Teams</Button> */}
					</div>
				)}
				<Alert variant='outlined' severity='warning' sx={{ marginTop: '1em', display: { xs: 'flex', sm: 'none' } }}>
					Squares on mobile is easiest to use in landscape mode.
				</Alert>
			</Paper>
			<br />
			<Grid container sx={{ paddingBottom: '2em' }}>
				{gridData.map((values, rowIndex) => (
					<Grid xs>
						{values.map((value, colIndex) => (
							<Cell
								value={value}
								location={[rowIndex, colIndex]}
								backgroundColor={getCellColor(rowIndex, colIndex)}
								onClick={handleSquareClick}
							/>
						))}
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
