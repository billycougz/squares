import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PaidIcon from '@mui/icons-material/Paid';
import { Avatar, Button, Chip, FormControl, FormLabel, InputAdornment, Slider } from '@mui/material';
import CustomTable from './Table';

export default function FinanceDialog({ open, onClose, onSave, children, boardData }) {
	const [squarePrice, setSquarePrice] = useState(boardData.squarePrice);
	const [payoutSliderValues, setPayoutSliderValues] = useState(boardData.payoutSliderValues);

	const handlePayoutSliderChange = async (e) => {
		const { value } = e.target;
		// Force Q4 to remain at 100
		if (value[3] === 100) {
			setPayoutSliderValues(value);
		}
	};

	const getSliderLabel = (value, index) => {
		const previousValue = index ? payoutSliderValues[index - 1] : 0;
		const difference = value - previousValue;
		const amount = squarePrice * difference;
		return `Q${index + 1} • ${difference}% • $${amount}`;
	};

	const hasValueChanged =
		squarePrice !== boardData.squarePrice ||
		JSON.stringify(payoutSliderValues) !== JSON.stringify(boardData.payoutSliderValues);

	const { amountRow, percentRow } = payoutSliderValues.reduce(
		(rows, value, index) => {
			const quarter = `Q${index + 1}`;
			const previousValue = index ? payoutSliderValues[index - 1] : 0;
			const difference = value - previousValue;
			const amount = squarePrice * difference;
			rows.amountRow[quarter] = `$${amount}`;
			rows.percentRow[quarter] = `${difference}%`;
			return rows;
		},
		{ amountRow: {}, percentRow: {} }
	);

	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>Square Finances</DialogTitle>
			<DialogContent>
				<TextField
					sx={{ margin: 1, ml: '0 !important', width: '120px' }}
					size='small'
					id='outlined-number'
					label='Square Price'
					type='number'
					value={squarePrice}
					onChange={(e) => setSquarePrice(Number(e.target.value) || '')}
					InputProps={{
						inputProps: {
							min: '0',
							inputMode: 'numeric',
						},
						startAdornment: (
							<InputAdornment position='start'>
								<PaidIcon />
							</InputAdornment>
						),
					}}
				/>

				<Chip
					sx={{
						margin: '1em 0 0em 0',
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
							{`$${squarePrice ? 100 * squarePrice : 0}`}
						</Avatar>
					}
					label='Total Pot'
				/>
				{!squarePrice ? (
					''
				) : (
					<>
						<FormControl sx={{ display: 'flex', mt: '1em' }}>
							<FormLabel>Quarterly Payouts</FormLabel>
							<Slider
								getAriaLabel={() => 'Temperature range'}
								value={payoutSliderValues}
								onChange={handlePayoutSliderChange}
								valueLabelDisplay='auto'
								valueLabelFormat={getSliderLabel}
								step={5}
								marks
							/>
						</FormControl>
						<CustomTable headers={['Q1', 'Q2', 'Q3', 'Q4']} rows={[percentRow, amountRow]} />
					</>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={() => onSave({ squarePrice, payoutSliderValues })} disabled={!hasValueChanged}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
