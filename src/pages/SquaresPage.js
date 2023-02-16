import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Square from '../components/Square';
import TextField from '@mui/material/TextField';
import {
	Alert,
	Avatar,
	Button,
	Chip,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Snackbar,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { updateBoard } from '../api';
import CustomAccordion from '../components/Accordion';
import CustomTable from '../components/Table';
import { useLocalStorage, useDocumentTitle } from 'usehooks-ts';

export default function SquaresPage({ boardData, onUpdate }) {
	const { gridData, boardName, results, userCode, isAdmin } = boardData;
	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [resultQuarterIndex, setResultQuarterIndex] = useState(0);
	const [clickMode, setClickMode] = useState('select');
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

	useDocumentTitle(`${boardName} | Squares`);

	const highlightColor = '#1876d1';

	const teams = {
		horizontal: { name: 'Eagles', color: '#004d56' },
		vertical: { name: 'Chiefs', color: '#ca243e' },
	};

	const setNumbers = async () => {
		const doContinue = window.confirm('Set the numbers? This can only be done once.');
		if (doContinue) {
			const { Item } = await updateBoard({ boardName, operation: 'numbers' });
			onUpdate({ ...Item, isAdmin });
		}
	};

	const handleSwapTeams = () => {
		// ToDo
	};

	const handleSquareClick = async ([row, col]) => {
		if (!row || !col || (clickMode === 'select' && gridData[row][col])) {
			return;
		}
		const value = clickMode === 'remove' ? null : clickMode === 'result' ? resultQuarterIndex : initials;
		const { Item } = await updateBoard({ boardName, row, col, operation: clickMode, value });
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

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?boardName=${boardName}&userCode=${userCode}`;
		navigator.clipboard.writeText(encodeURI(link));
		setIsSnackbarOpen(true);
	};

	const areNumbersSet = gridData[0].some((value) => value);

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

	const handleInitialsChange = (e) => {
		const { value } = e.target;
		setInitials(value.toUpperCase());
	};

	const toggleSnackbar = () => {
		setIsSnackbarOpen(!isSnackbarOpen);
	};

	return (
		<Box sx={{ flexGrow: 1, margin: '1em' }}>
			<Grid container spacing={2}>
				<Grid xs={12} sm={6}>
					<Box sx={{ display: 'flex', alignItems: 'flex-end' }} id='initial-box'>
						<AccountCircle sx={{ color: 'action.active', ml: '12px', my: '12px' }} />
						<TextField
							autoFocus={!initials}
							placeholder='Enter your initials...'
							fullWidth
							variant='outlined'
							value={initials}
							onChange={handleInitialsChange}
						/>
					</Box>
				</Grid>

				{isAdmin && (
					<Grid xs={12} sm={6}>
						<CustomAccordion title='Admin Controls'>
							<FormControl sx={{ display: 'flex', marginTop: '-20px' }}>
								<FormLabel>Admin Click Mode</FormLabel>
								<ToggleButtonGroup
									color='primary'
									value={clickMode}
									exclusive
									size='small'
									onChange={(e) => setClickMode(e.target.value)}
								>
									<ToggleButton value='select'>Select</ToggleButton>
									<ToggleButton value='remove'>Remove</ToggleButton>
									<ToggleButton value='result'>Result</ToggleButton>

									{/* Disabling until fully handled - <Button onClick={handleSwapTeams}>Swap Teams</Button> */}
								</ToggleButtonGroup>
							</FormControl>

							{clickMode === 'result' && (
								<div>
									<br />
									<FormControl size='small'>
										<FormLabel id='demo-row-radio-buttons-group-label'>Result Quarter</FormLabel>
										<RadioGroup
											row
											name='row-radio-buttons-group'
											value={resultQuarterIndex}
											onChange={(e) => setResultQuarterIndex(e.target.value)}
										>
											{['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => (
												<FormControlLabel value={index} control={<Radio />} label={quarter} />
											))}
										</RadioGroup>
									</FormControl>
								</div>
							)}

							{
								<div>
									<br />
									<FormControl>
										<FormLabel>Admin Actions</FormLabel>
										<div>
											<Button variant='contained' size='small' onClick={handleCopyShareLink}>
												Share
											</Button>
											<Snackbar
												open={isSnackbarOpen}
												autoHideDuration={3000}
												anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
												onClose={toggleSnackbar}
												message='Share link copied to clipboard.'
											/>
											{!areNumbersSet && (
												<Button variant='contained' size='small' onClick={setNumbers} sx={{ ml: '1em' }}>
													Set Numbers
												</Button>
											)}
										</div>
									</FormControl>
								</div>
							}
						</CustomAccordion>
					</Grid>
				)}
			</Grid>

			{Object.keys(squareMap).length && (
				<>
					<br />
					<CustomAccordion title='Square Counts'>
						<Chip avatar={<Avatar>{squareMap['_remaining']}</Avatar>} label='Remaining Squares' />
						<CustomTable
							initials={initials}
							highlightProperty='Initials'
							headers={['Initials', 'Squares']}
							rows={Object.keys(squareMap)
								.sort()
								.filter((key) => key !== '_remaining')
								.map((key) => ({ Initials: key, Squares: squareMap[key] }))}
						/>
					</CustomAccordion>
					<br />
				</>
			)}
			<div>
				<CustomAccordion title='Results'>
					<CustomTable
						initials={initials}
						highlightProperty='Winner'
						headers={['Quarter', teams.horizontal.name, teams.vertical.name, 'Winner']}
						rows={results.map(({ quarter, horizontal, vertical, winner }) => ({
							Quarter: quarter,
							Winner: winner,
							[teams.horizontal.name]: horizontal,
							[teams.vertical.name]: vertical,
						}))}
					/>
				</CustomAccordion>
			</div>
			<Alert
				variant='outlined'
				severity='warning'
				sx={{ marginTop: '1em', background: 'white', display: { xs: 'flex', sm: 'none' } }}
			>
				Flip to landscape for roomier squares.
			</Alert>
			<Grid container sx={{ paddingBottom: '2em', marginTop: '1em' }}>
				{gridData.map((values, rowIndex) => (
					<Grid xs>
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
