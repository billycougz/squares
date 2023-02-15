import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Cell from './Cell';
import TextField from '@mui/material/TextField';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Avatar,
	Button,
	Chip,
	FormControl,
	FormControlLabel,
	FormLabel,
	modalClasses,
	Paper,
	Radio,
	RadioGroup,
	Snackbar,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import { AccountCircle, ExpandMoreOutlined } from '@mui/icons-material';
import { updateBoard } from './api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function SquaresBoard({ boardData, onUpdate, isAdmin }) {
	const { gridData, boardName, results, userCode } = boardData;
	const [initials, setInitials] = useState(localStorage.getItem('squares-initials') || '');
	const [resultQuarterIndex, setResultQuarterIndex] = useState(0);
	const [adminMode, setAdminMode] = useState('select');
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

	useEffect(() => {
		document.title = `${boardName} | Squares`;
	}, []);

	const highlightColor = '#1876d1';

	const teams = {
		horizontal: { name: 'Eagles', color: '#004d56' },
		vertical: { name: 'Chiefs', color: '#ca243e' },
	};

	const setNumbers = async () => {
		const doContinue = window.confirm('Set the numbers? This can only be done once.');
		if (doContinue) {
			const { Item } = await updateBoard({ boardName, operation: 'numbers' });
			onUpdate(Item);
		}
	};

	const handleSwapTeams = () => {
		// ToDo
	};

	const handleSquareClick = async ([row, col]) => {
		if (!row || !col || (adminMode === 'select' && gridData[row][col])) {
			return;
		}
		const value = adminMode === 'remove' ? null : adminMode === 'result' ? resultQuarterIndex : initials;
		const { Item } = await updateBoard({ boardName, row, col, operation: adminMode, value });
		onUpdate(Item);
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
		navigator.clipboard.writeText(link);
		setIsSnackbarOpen(true);
	};

	const isLocked = gridData[0].some((value) => value);

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
		const upperCase = value.toUpperCase();
		localStorage.setItem('squares-initials', upperCase);
		setInitials(upperCase);
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
						<Accordion sx={{ borderRadius: '5px' }}>
							<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
								<Typography>Admin Controls</Typography>
							</AccordionSummary>

							<AccordionDetails>
								<FormControl sx={{ display: 'flex', marginTop: '-20px' }}>
									<FormLabel>Admin Click Mode</FormLabel>
									<ToggleButtonGroup
										color='primary'
										value={adminMode}
										exclusive
										size='small'
										onChange={(e) => setAdminMode(e.target.value)}
									>
										<ToggleButton value='select'>Select</ToggleButton>
										<ToggleButton value='remove'>Remove</ToggleButton>
										<ToggleButton value='result'>Result</ToggleButton>

										{/* Disabling until fully handled - <Button onClick={handleSwapTeams}>Swap Teams</Button> */}
									</ToggleButtonGroup>
								</FormControl>

								{adminMode === 'result' && (
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
											<Button
												sx={{ marginTop: '1em', width: 'fit-content', margin: 0 }}
												variant='contained'
												size='small'
												onClick={handleCopyShareLink}
											>
												Share
											</Button>
											<Snackbar
												open={isSnackbarOpen}
												autoHideDuration={3000}
												anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
												onClose={toggleSnackbar}
												message='Share link copied to clipboard'
											/>
											{!isLocked && (
												<Button
													sx={{ marginTop: '1em', width: 'fit-content', margin: 0 }}
													variant='contained'
													size='small'
													onClick={setNumbers}
												>
													Set Numbers
												</Button>
											)}
										</FormControl>
									</div>
								}
							</AccordionDetails>
						</Accordion>
					</Grid>
				)}
			</Grid>

			{Object.keys(squareMap).length && (
				<>
					<br />
					<Accordion sx={{ borderRadius: '5px' }}>
						<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
							<Typography>Square Counts</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Chip avatar={<Avatar>{squareMap['_remaining']}</Avatar>} label='Remaining Squares' />

							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Initials</TableCell>
										<TableCell>Squares</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{Object.keys(squareMap)
										.sort()
										.filter((key) => key !== '_remaining')
										.map((key) => (
											<TableRow key={key}>
												<TableCell sx={{ color: initials === key ? highlightColor : '' }}>{key}</TableCell>
												<TableCell sx={{ color: initials === key ? highlightColor : '' }}>{squareMap[key]}</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</AccordionDetails>
					</Accordion>
					<br />
				</>
			)}
			<div>
				<Accordion sx={{ borderRadius: '5px' }}>
					<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
						<Typography>Results</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Quarter</TableCell>
									<TableCell>{teams.horizontal.name}</TableCell>
									<TableCell>{teams.vertical.name}</TableCell>
									<TableCell>Winner</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{results.map(({ quarter, horizontal, vertical, winner }) => (
									<TableRow key={quarter}>
										<TableCell sx={{ color: initials === winner ? highlightColor : '' }}>{quarter}</TableCell>
										<TableCell sx={{ color: initials === winner ? highlightColor : '' }}>{horizontal}</TableCell>
										<TableCell sx={{ color: initials === winner ? highlightColor : '' }}>{vertical}</TableCell>
										<TableCell sx={{ color: initials === winner ? highlightColor : '' }}>{winner}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</AccordionDetails>
				</Accordion>
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
							<Cell
								key={`${rowIndex}${colIndex}${value}`}
								value={value}
								location={[rowIndex, colIndex]}
								backgroundColor={getCellColor(rowIndex, colIndex)}
								onClick={handleSquareClick}
								adminMode={adminMode}
							/>
						))}
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
