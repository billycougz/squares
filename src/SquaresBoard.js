import { useState } from 'react';
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
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { updateBoard } from './api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function SquaresBoard({ boardData, onUpdate, isAdmin }) {
	const { gridData, boardName, results } = boardData;
	const [initials, setInitials] = useState('');
	const [resultQuarterIndex, setResultQuarterIndex] = useState(0);
	const [adminMode, setAdminMode] = useState('select');

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
		return '';
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

	return (
		<Box sx={{ flexGrow: 1, margin: '1em' }}>
			<Paper sx={{ padding: '1em', width: { sm: 'fit-content' } }}>
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

				{isAdmin && (
					<FormControl size='small' sx={{ display: 'flex' }}>
						<FormLabel id='demo-row-radio-buttons-group-label'>Admin Mode</FormLabel>
						<ToggleButtonGroup
							color='primary'
							size='small'
							value={adminMode}
							exclusive
							onChange={(e) => setAdminMode(e.target.value)}
						>
							<ToggleButton value='select'>Select</ToggleButton>
							<ToggleButton value='remove'>Remove</ToggleButton>
							<ToggleButton value='result'>Result</ToggleButton>
						</ToggleButtonGroup>
					</FormControl>
				)}

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

				<Alert variant='outlined' severity='warning' sx={{ marginTop: '1em', display: { xs: 'flex', sm: 'none' } }}>
					Flip to landscape for roomier squares.
				</Alert>
			</Paper>
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
										.filter((key) => key !== '_remaining')
										.map((key) => (
											<TableRow key={key}>
												<TableCell>{key}</TableCell>
												<TableCell>{squareMap[key]}</TableCell>
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
								{results.map((result) => (
									<TableRow key={result.quarter}>
										<TableCell>{result.quarter}</TableCell>
										<TableCell>{result.horizontal}</TableCell>
										<TableCell>{result.vertical}</TableCell>
										<TableCell>{result.winner}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</AccordionDetails>
				</Accordion>
				<br />
			</div>

			<Grid container sx={{ paddingBottom: '2em' }}>
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
