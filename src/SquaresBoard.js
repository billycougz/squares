import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Cell from './Cell';
import TextField from '@mui/material/TextField';
import { FormControl, FormLabel } from '@mui/material';

export default function SquaresBoard({ boardData, onUpdate }) {
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
			<FormControl>
				<FormLabel>Enter your initials then select your squares</FormLabel>
				<TextField
					label='Initials'
					variant='outlined'
					value={initials}
					onChange={(e) => setInitials(e.target.value)}
					sx={{ width: '300px', margin: '1em 0' }}
				/>
			</FormControl>

			<br />
			<hr />
			{!isLocked && (
				<>
					<button onClick={setNumbers}>Set Numbers</button>
					<button onClick={handleSwapTeams}>Swap Teams</button>
				</>
			)}

			<Grid xs='12' sx={{ textAlign: 'center', marginLeft: '10%' }}>
				<Typography variant='h1' color={teams[teamSides.horizontal].color}>
					{teams[teamSides.horizontal].name}
				</Typography>
			</Grid>
			<Grid xs='12' sx={{ display: 'flex' }}>
				<Grid xs='1' sx={{ marginRight: '15px' }}>
					<Typography
						variant='h1'
						color={teams[teamSides.vertical].color}
						sx={{ transform: 'rotate(270deg)', position: 'relative', top: '50%' }}
					>
						{teams[teamSides.vertical].name}
					</Typography>
				</Grid>

				<Grid xs='11' container>
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
			</Grid>
		</Box>
	);
}
