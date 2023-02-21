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
	InputAdornment,
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
import PortraitIcon from '@mui/icons-material/Portrait';
import FinanceDialog from '../components/FinanceDialog';
import EditIcon from '@mui/icons-material/Edit';

export default function SquaresPage({ boardData, onUpdate }) {
	const { gridData, boardName, results, userCode, isAdmin, squarePrice, payoutSliderValues } = boardData;
	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [resultQuarterIndex, setResultQuarterIndex] = useState(0);
	const [clickMode, setClickMode] = useState('select');
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
	const [isFinanceDialogOpen, setIsFinanceDialogOpen] = useState(false);

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

	const handleFinanceSave = async (value) => {
		const { Item } = await updateBoard({ boardName, operation: 'finances', value });
		onUpdate({ ...Item, isAdmin });
		setIsFinanceDialogOpen(false);
	};

	const getPayoutValue = (quarterIndex) => {
		if (!squarePrice) {
			return null;
		}
		const previousValue = quarterIndex ? payoutSliderValues[quarterIndex - 1] : 0;
		const currentValue = payoutSliderValues[quarterIndex];
		const difference = currentValue - previousValue;
		return `$${squarePrice * difference}`;
	};

	return (
		<Box sx={{ flexGrow: 1, margin: '1em' }}>
			<Grid container spacing={2}>
				<Grid xs={12} sm={isAdmin ? 5 : 6}>
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
					<Grid xs={12} sm={7}>
						<CustomAccordion title='Admin Controls'>
							<Box
								component='form'
								sx={{
									'& .MuiTextField-root': { m: 1, width: { xs: '142px', md: 'auto' } },
								}}
							>
								<FormControl sx={{ display: 'flex', marginTop: '-20px' }}>
									<FormLabel>
										<Button size='small' variant='text' onClick={() => setIsFinanceDialogOpen(true)}>
											Edit Square Finances
											<EditIcon fontSize='small' sx={{ ml: '5px' }} />
										</Button>
									</FormLabel>
								</FormControl>
								{isFinanceDialogOpen && (
									<FinanceDialog
										open={isFinanceDialogOpen}
										onSave={handleFinanceSave}
										onClose={() => setIsFinanceDialogOpen(false)}
										boardData={boardData}
									/>
								)}

								{false && (
									// Disabling this feature
									<TextField
										size='small'
										id='outlined-number'
										label='Max Squares Per Person'
										type='number'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<PortraitIcon />
												</InputAdornment>
											),
										}}
									/>
								)}
							</Box>

							<FormControl sx={{ display: 'flex' }}>
								<FormLabel>Click Mode</FormLabel>
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
								<FormControl sx={{ mt: '5px' }}>
									<FormLabel>Actions</FormLabel>
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
							}
						</CustomAccordion>
					</Grid>
				)}

				{Object.keys(squareMap).length && (
					<Grid xs={12} sm={isAdmin ? 5 : 6}>
						<CustomAccordion title='Square Summary'>
							<Chip
								sx={{
									margin: '0 1em 1em 0',
								}}
								avatar={
									<Avatar
										sx={{
											width: 'auto',
											borderRadius: 'inherit',
											padding: '0 10px',
											fontWeight: 'bold',
										}}
									>
										{squareMap['_remaining']}
									</Avatar>
								}
								label='Remaining Squares'
							/>
							{!squarePrice ? (
								''
							) : (
								<>
									<Chip
										sx={{
											margin: '0 1em 1em 0',
										}}
										avatar={
											<Avatar
												sx={{
													width: 'auto',
													borderRadius: 'inherit',
													padding: '0 10px',
													fontWeight: 'bold',
												}}
											>
												{`$${squarePrice}`}
											</Avatar>
										}
										label='Square Price'
									/>
									<Chip
										sx={{
											margin: '0 0 1em 0',
										}}
										avatar={
											<Avatar
												sx={{
													width: 'auto',
													borderRadius: 'inherit',
													padding: '0 10px',
													fontWeight: 'bold',
												}}
											>{`$${(100 - squareMap['_remaining']) * squarePrice}`}</Avatar>
										}
										label='Current Pot'
									/>
								</>
							)}

							<CustomTable
								initials={initials}
								highlightProperty='Initials'
								headers={['Initials', 'Squares', squarePrice && 'Owed']}
								rows={Object.keys(squareMap)
									.sort()
									.filter((key) => key !== '_remaining')
									.map((key) => ({ Initials: key, Squares: squareMap[key], Owed: `$${squareMap[key] * squarePrice}` }))}
							/>
						</CustomAccordion>
					</Grid>
				)}
				<Grid xs={12} sm={isAdmin ? 7 : 12} md={isAdmin ? 7 : 6}>
					<CustomAccordion title='Results'>
						<CustomTable
							initials={initials}
							highlightProperty='Winner'
							headers={['Quarter', teams.horizontal.name, teams.vertical.name, 'Winner', squarePrice && 'Amount']}
							rows={results.map(({ quarter, horizontal, vertical, winner }, index) => ({
								Quarter: quarter,
								Winner: winner,
								[teams.horizontal.name]: horizontal,
								[teams.vertical.name]: vertical,
								Amount: getPayoutValue(index),
							}))}
						/>
					</CustomAccordion>
				</Grid>
			</Grid>
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
