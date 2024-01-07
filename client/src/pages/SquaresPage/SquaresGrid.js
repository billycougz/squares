import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert } from '@mui/material';
import { updateBoard } from '../../api';
import Square from '../../components/Square';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import styled from '@emotion/styled';

const ExpandButton = styled.div`
	position: absolute;
`;

export default function SquaresGrid({
	boardData,
	initials,
	setSnackbarMessage,
	onUpdate,
	squareMap,
	highlightColor,
	clickMode,
}) {
	const { id, gridData, boardName, isAdmin, squarePrice, maxSquares, teams, results } = boardData;

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
		const currentInitialsCount = squareMap[initials];
		if (clickMode === 'select' && maxSquares && currentInitialsCount === maxSquares) {
			setSnackbarMessage("You've reached the square limit.");
			return;
		}
		const value = clickMode === 'remove' ? null : initials;
		const { Item } = await updateBoard({ id, boardName, row, col, operation: clickMode, value });
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
		if (resultMap[row]?.[col]) {
			return 'rgb(102, 187, 106)';
		}
		if (gridData[row][col] === initials) {
			return highlightColor;
		}
		return '';
	};

	const resultMap = getResultCellMap(results);

	return (
		<Box>
			<Grid container>
				{/* <ExpandButton>
					<AspectRatioIcon />
				</ExpandButton> */}
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
								resultQuarters={resultMap[rowIndex]?.[colIndex]?.join(',')}
								onClick={handleSquareClick}
								adminMode={clickMode}
							/>
						))}
					</Grid>
				))}
			</Grid>
			<Alert
				variant='outlined'
				severity='warning'
				sx={{ marginTop: '1em', background: 'white', display: { xs: 'flex', sm: 'none' } }}
			>
				Flip to landscape for roomier squares.
			</Alert>
		</Box>
	);
}

function getResultCellMap(results) {
	return results.reduce((map, result) => {
		const { row, col, quarter } = result;
		if (result.row) {
			map[row] = map[row] || {};
			map[row][col] = map[row][col] || [];
			map[row][col].push(quarter);
		}
		return map;
	}, {});
}
