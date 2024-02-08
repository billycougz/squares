import TextField from '@mui/material/TextField';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Avatar, Box, Chip, FormControl, FormGroup, FormLabel, InputAdornment, Slider } from '@mui/material';
import CustomTable from './Table';
import TagIcon from '@mui/icons-material/Tag';
import PercentSharp from '@mui/icons-material/PercentSharp';

export default function ManageFinanceContent({ financeData, onDataChange }) {
	const { squarePrice, maxSquares, payoutSliderValues, retainAmount = 0, reversePercent = 0 } = financeData;

	const handlePayoutSliderChange = async (e, value) => {
		// Force Q4 (final) to remain at 100
		if (value[3] === 100) {
			handleDataChange('payoutSliderValues', value);
		}
	};

	const getSliderLabel = (value, index) => {
		const previousValue = index ? payoutSliderValues[index - 1] : 0;
		const difference = value - previousValue;
		// ToDo: Disabling with addition of reverse payouts - reconsider
		// const amount = squarePrice * difference;
		// return `Q${index + 1} • ${difference}% • $${amount}`;
		return `Q${index + 1} • ${difference}%`;
	};

	const { amountRow, percentRow, reverseAmountRow } = payoutSliderValues.reduce(
		(rows, value, index) => {
			const quarter = index === 3 ? 'Final' : `Q${index + 1}`;
			const previousValue = index ? payoutSliderValues[index - 1] : 0;
			const quarterPercent = value - previousValue;
			let amount = (squarePrice - retainAmount / 100) * quarterPercent;
			if (reversePercent) {
				const reverseAmount = (amount * reversePercent) / 100;
				amount = amount - reverseAmount;
				rows.reverseAmountRow[quarter] = `$${reverseAmount}`;
			}
			rows.amountRow[quarter] = `$${amount}`;
			rows.percentRow[quarter] = `${quarterPercent}%`;
			return rows;
		},
		{ amountRow: { ' ': 'Exact' }, percentRow: { ' ': 'Total %' }, reverseAmountRow: { ' ': 'Reverse' } }
	);

	const handleDataChange = (field, value) => {
		const updatedFinanceData = { ...financeData, [field]: value };
		onDataChange(updatedFinanceData);
	};

	const payoutTableConfig = {
		headers: ['Q1', 'Q2', 'Q3', 'Final'],
		rows: [percentRow, amountRow],
	};

	if (reversePercent) {
		payoutTableConfig.hasHeaderCol = true;
		payoutTableConfig.headers.unshift(' '); // Empty col header
		payoutTableConfig.rows.push(reverseAmountRow);
	}

	return (
		<Box>
			{false && <FormLabel>Core Board Settings</FormLabel>}
			<FormGroup
				sx={{
					margin: '1em 0',
					gap: '1em',
					flexWrap: 'nowrap',
					flexDirection: 'row',
					'> .MuiFormControl-root': { flexGrow: 1 },
				}}
			>
				<TextField
					sx={{ ml: '0 !important' }}
					size='small'
					id='outlined-number'
					label='Square Price'
					type='number'
					value={squarePrice}
					helperText={squarePrice ? `Total Pot: $${squarePrice * 100}` : ''}
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
					sx={{ ml: '0 !important' }}
					size='small'
					id='outlined-number'
					label='Limit Per Person'
					type='number'
					value={maxSquares || ''}
					placeholder='No Limit'
					helperText={squarePrice && maxSquares ? `Per Person: $${maxSquares * squarePrice}` : ''}
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
			</FormGroup>

			{false && <FormLabel>Advanced Payout Options</FormLabel>}
			<FormGroup
				sx={{
					margin: '1em 0',
					gap: '1em',
					flexWrap: 'nowrap',
					flexDirection: 'row',
					'> .MuiFormControl-root': { flexGrow: 1 },
					display: 'none',
				}}
			>
				<TextField
					sx={{ ml: '0 !important' }}
					size='small'
					id='outlined-number'
					label='Retain Amount'
					type='number'
					value={retainAmount}
					helperText={squarePrice && retainAmount ? `Total Payout: $${squarePrice * 100 - retainAmount}` : ''}
					onChange={(e) => handleDataChange('retainAmount', Number(e.target.value) || '')}
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

				{/** 2/7/24 - Disabling because it's too much of a pain in the ass to squeeze in before super bowl (visibility: 'hidden') */}
				{squarePrice && (
					<TextField
						sx={{ ml: '0 !important', visibility: 'hidden' }}
						size='small'
						id='outlined-number'
						label='Reverse %'
						type='number'
						value={reversePercent || ''}
						placeholder='0'
						helperText={squarePrice && reversePercent ? `Exact: ${100 - reversePercent}%` : ''}
						onChange={(e) => handleDataChange('reversePercent', Number(e.target.value) || '')}
						InputProps={{
							inputProps: {
								min: '0',
								inputMode: 'numeric',
							},
							startAdornment: (
								<InputAdornment position='start'>
									<PercentSharp />
								</InputAdornment>
							),
						}}
					/>
				)}
			</FormGroup>

			{!squarePrice ? (
				''
			) : (
				<>
					<FormControl sx={{ display: 'flex', mt: '10px' }} color='primary'>
						<FormLabel sx={{ mb: '-5px' }}>Quarterly Payouts</FormLabel>
						<Slider
							getAriaLabel={() => 'Temperature range'}
							value={payoutSliderValues}
							onChange={handlePayoutSliderChange}
							valueLabelDisplay='auto'
							valueLabelFormat={getSliderLabel}
							step={5}
							marks
							sx={{
								marginBottom: '-10px',
								'.MuiSlider-mark': { background: 'white' },
								'.MuiSlider-rail': { opacity: '1', border: '1px solid currentColor' },
							}}
						/>
					</FormControl>
					<CustomTable {...payoutTableConfig} />
				</>
			)}
		</Box>
	);
}
