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
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
	Snackbar,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { subscribeNumberToBoard, updateBoard } from '../api';
import CustomAccordion from '../components/Accordion';
import CustomTable from '../components/Table';
import { useLocalStorage, useDocumentTitle } from 'usehooks-ts';
import FinanceDialog from '../components/FinanceDialog';
import EditIcon from '@mui/icons-material/Edit';
import SmsIcon from '@mui/icons-material/Sms';
import SmsDialog from '../components/SmsDialog';
import IosShareIcon from '@mui/icons-material/IosShare';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';

export default function SquaresPage({ boardData, onUpdate }) {
	const { gridData, boardName, results, userCode, isAdmin, squarePrice, payoutSliderValues } = boardData;
	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [resultQuarterIndex, setResultQuarterIndex] = useState(0);
	const [clickMode, setClickMode] = useState('select');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [isFinanceDialogOpen, setIsFinanceDialogOpen] = useState(false);
	const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);

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
		if (clickMode === 'select' && Item.gridData[row][col] !== initials) {
			setSnackbarMessage('This square was taken by another player.');
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

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?boardName=${boardName}&userCode=${userCode}`;
		navigator.clipboard.writeText(encodeURI(link));
		setSnackbarMessage('Share link copied to clipboard.');
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

	const handleFinanceSave = async (value) => {
		const { Item } = await updateBoard({ boardName, operation: 'finances', value });
		onUpdate({ ...Item, isAdmin });
		setIsFinanceDialogOpen(false);
	};

	const handleSmsSave = async ({ phoneNumber }) => {
		const result = await subscribeNumberToBoard({ boardName, phoneNumber: phoneNumber.replace(/\s/g, '') });
		const storedSubscriptions = JSON.parse(localStorage.getItem('squares-subscriptions')) || {};
		storedSubscriptions[boardName] = storedSubscriptions[boardName] || {};
		storedSubscriptions[boardName][initials] = phoneNumber;
		localStorage.setItem('squares-subscriptions', JSON.stringify(storedSubscriptions));
		setIsSmsDialogOpen(false);
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
						<Divider sx={{ height: '35px', mb: '5px' }} orientation='vertical' />
						<IconButton color='primary' sx={{ p: '10px' }} onClick={() => setIsSmsDialogOpen(true)}>
							<SmsIcon />
						</IconButton>
						{isSmsDialogOpen && (
							<SmsDialog
								open={isSmsDialogOpen}
								onSave={handleSmsSave}
								onClose={() => setIsSmsDialogOpen(false)}
								boardName={boardName}
								initials={initials}
							/>
						)}
					</Box>
				</Grid>

				{isAdmin && (
					<Grid xs={12} sm={7}>
						<CustomAccordion title='Admin Controls'>
							<FormControl sx={{ display: 'flex', mt: '-20px' }}>
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

							<FormControl sx={{ mt: '5px' }}>
								<FormLabel>Actions</FormLabel>
								<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
									<Button size='small' variant='contained' onClick={() => setIsFinanceDialogOpen(true)}>
										<EditIcon sx={{ pr: 1 }} fontSize='small' />
										Edit Finances
									</Button>
									{isFinanceDialogOpen && (
										<FinanceDialog
											open={isFinanceDialogOpen}
											onSave={handleFinanceSave}
											onClose={() => setIsFinanceDialogOpen(false)}
											boardData={boardData}
										/>
									)}
									<Button variant='contained' size='small' onClick={handleCopyShareLink}>
										<IosShareIcon sx={{ pr: 1 }} fontSize='small' />
										Share
									</Button>
									{!areNumbersSet && (
										<Button variant='contained' size='small' onClick={setNumbers}>
											<BorderStyleIcon sx={{ pr: 1 }} fontSize='small' />
											Set Numbers
										</Button>
									)}
								</Box>
							</FormControl>
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
					<CustomAccordion title='Results & Payouts'>
						{!squarePrice ? (
							''
						) : (
							<Alert
								variant='outlined'
								severity='warning'
								size='small'
								sx={{ margin: '-1em 0 1em 0', display: { xs: 'flex', sm: 'none' } }}
							>
								Scroll horizontally or flip to landscape to see payout amounts.
							</Alert>
						)}
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
			<Snackbar
				open={!!snackbarMessage}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				onClose={() => setSnackbarMessage('')}
				message={snackbarMessage}
			/>
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