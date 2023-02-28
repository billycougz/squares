import { useState } from 'react';
import { FormControlLabel, Paper, Radio, RadioGroup, Tab, Tabs, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert } from '@mui/material';
import { updateBoard } from '../../api';
import Square from '../../components/Square';

export default function SquaresGrid({ boardData, initials, setSnackbarMessage, onUpdate, squareMap, highlightColor }) {
	const { gridData, boardName, isAdmin, squarePrice, teams } = boardData;
	const [resultQuarterIndex, setResultQuarterIndex] = useState(0);
	const [clickMode, setClickMode] = useState('select');

	const handleSquareClick = async ([row, col]) => {
		if (!row || !col) {
			// Numbers row or column
			return;
		}
		if (clickMode === 'select' && gridData[row][col]) {
			// Already selected square
			return;
		}
		if (clickMode === 'select' && !initials) {
			setSnackbarMessage('Please enter your initials before selecting a square.');
			return;
		}
		const value = clickMode === 'remove' ? null : clickMode === 'result' ? resultQuarterIndex : initials;
		const { Item } = await updateBoard({ boardName, row, col, operation: clickMode, value });
		if (clickMode === 'result') {
			setSnackbarMessage(`Q${Number(resultQuarterIndex) + 1} results saved.`);
		}
		if (clickMode === 'remove') {
			setSnackbarMessage('Square removed.');
		}
		if (clickMode === 'select') {
			if (Item.gridData[row][col] !== initials) {
				setSnackbarMessage('This square was taken by another player.');
			} else {
				const personalTotal = squareMap[initials] + 1;
				const financeMsg = squarePrice ? ` and owe $${personalTotal * squarePrice}` : '';
				setSnackbarMessage(`Square selected. You now have ${personalTotal} squares${financeMsg}.`);
			}
		}
		onUpdate({ ...Item, isAdmin });
	};

	const getCellColor = (row, col) => {
		const { vertical, horizontal } = teams;
		if (!row && col) {
			return vertical.color;
		} else if (!col && row) {
			return horizontal.color;
		}
		if (gridData[row][col] === initials) {
			return highlightColor;
		}
		return '';
	};
	return (
		<Box>
			<Alert
				variant='outlined'
				severity='warning'
				sx={{ marginTop: '1em', background: 'white', display: { xs: 'flex', sm: 'none' } }}
			>
				Flip to landscape for roomier squares.
			</Alert>
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
						<Tab label='Result' value='result' />
					</Tabs>

					{clickMode === 'result' && (
						<RadioGroup row value={resultQuarterIndex} onChange={(e) => setResultQuarterIndex(e.target.value)}>
							{['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => (
								<FormControlLabel key={quarter} value={index} control={<Radio />} label={quarter} />
							))}
						</RadioGroup>
					)}
				</Grid>
			)}
			<Grid container>
				<Grid xs sx={{ width: '47px', flexGrow: '0', flexBasis: 'auto' }} />
				<Grid xs sx={{ flexGrow: 'calc(1/11 + .009)' }} />
				<Grid
					xs
					sx={{
						mt: 1,
						backgroundColor: teams.horizontal.color,
						color: 'white',
						flexGrow: '1',
						borderRadius: '5px 5px 0 0',
						p: '14px 0 10px 0',
					}}
				>
					<Typography
						variant='h6'
						textAlign='center'
						sx={{
							textTransform: 'uppercase',
							letterSpacing: '2px',
							lineHeight: '1',
						}}
					>
						{teams.horizontal.name}
					</Typography>
				</Grid>
			</Grid>
			<Grid container>
				<Grid
					xs
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-end',
						flexGrow: '0',
						flexBasis: 'min-content',
					}}
				>
					<Grid xs sx={{ flexGrow: '0' }}>
						<Square location={[]} />
					</Grid>
					<Grid
						sx={{
							display: 'flex',
							backgroundColor: teams.vertical.color,
							alignItems: 'center',
							flexGrow: '1',
							borderRadius: '5px 0 0 5px',
						}}
					>
						<Box
							sx={{
								p: '1em',
								textAlign: 'center',
								textTransform: 'capitalize',
								'> *': {
									display: 'block',
									lineHeight: '1 !important',
									color: 'white',
								},
							}}
						>
							{Array.from(teams.vertical.name).map((letter) => (
								<Typography variant='h6' sx={{ height: letter === ' ' ? '12px' : '' }}>
									{letter}
								</Typography>
							))}
						</Box>
					</Grid>
				</Grid>

				{gridData.map((values, rowIndex) => (
					<Grid xs key={rowIndex}>
						{values.map((value, colIndex) => (
							<Square
								key={`${rowIndex}${colIndex}${value}`}
								value={value}
								location={[rowIndex, colIndex]}
								backgroundColor={getCellColor(rowIndex, colIndex)}
								onClick={handleSquareClick}
								adminMode={clickMode}
							/>
						))}
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
