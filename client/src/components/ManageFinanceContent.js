import TextField from '@mui/material/TextField';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Avatar, Box, Chip, FormControl, FormLabel, InputAdornment, Slider } from '@mui/material';
import CustomTable from './Table';
import TagIcon from '@mui/icons-material/Tag';

export default function ManageFinanceContent({ financeData, onDataChange }) {
	const { squarePrice, maxSquares, payoutSliderValues } = financeData;

	const handlePayoutSliderChange = async (e) => {
		const { value } = e.target;
		// Force Q4 to remain at 100
		if (value[3] === 100) {
			handleDataChange('payoutSliderValues', value);
		}
	};

	const getSliderLabel = (value, index) => {
		const previousValue = index ? payoutSliderValues[index - 1] : 0;
		const difference = value - previousValue;
		const amount = squarePrice * difference;
		return `Q${index + 1} • ${difference}% • $${amount}`;
	};

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

	const handleDataChange = (field, value) => {
		const updatedFinanceData = { ...financeData, [field]: value };
		onDataChange(updatedFinanceData);
	};

	return (
		<Box>
			<TextField
				sx={{ margin: 1, ml: '0 !important', width: '120px' }}
				size='small'
				id='outlined-number'
				label='Square Price'
				type='number'
				value={squarePrice}
				onChange={(e) => handleDataChange('squarePrice', Number(e.target.value) || '')}
				InputProps={{
					inputProps: {
						min: '0',
						inputMode: 'numeric',
					},
					startAdornment: (
						<InputAdornment position='start'>
							<AttachMoneyIcon />
						</InputAdornment>
					),
				}}
			/>

			<TextField
				fullWidth
				sx={{ margin: 1, ml: '0 !important', width: '120px' }}
				size='small'
				id='outlined-number'
				label='Limit Per Person'
				type='number'
				value={maxSquares || ''}
				placeholder='No Limit'
				onChange={(e) => handleDataChange('maxSquares', Number(e.target.value) || '')}
				InputProps={{
					inputProps: {
						min: '0',
						inputMode: 'numeric',
					},
					startAdornment: (
						<InputAdornment position='start'>
							<TagIcon />
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
							width: 'auto !important',
							borderRadius: 'inherit',
							padding: '0 10px',
							fontWeight: 'bold',
						}}
					>
						Total Pot
					</Avatar>
				}
				label={`$${squarePrice ? 100 * squarePrice : 0}`}
			/>
			<Chip
				sx={{
					margin: '1em 0 0em 0',
				}}
				avatar={
					<Avatar
						sx={{
							width: 'auto !important',
							borderRadius: 'inherit',
							padding: '0 10px',
							fontWeight: 'bold',
						}}
					>
						Per Person
					</Avatar>
				}
				label={squarePrice ? `${squarePrice && maxSquares ? '$' + maxSquares * squarePrice : 'N/A'}` : '$0'}
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
		</Box>
	);
}
