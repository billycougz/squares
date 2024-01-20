import TextField from '@mui/material/TextField';
import { Box, DialogContentText, InputAdornment, Typography } from '@mui/material';
import ShortTextIcon from '@mui/icons-material/ShortText';
import { useState } from 'react';

const renderVenmoSVG = () => <img src='/venmo.svg' width='24' height='24' />;

export default function ManagePaymentInfoContent({ paymentInfoData, onDataChange }) {
	const { venmoUsername, financeMessage } = paymentInfoData;

	// Errors not being used at this time
	const [errors, setErrors] = useState({});

	const handleDataChange = (field, value) => {
		const updatedFinanceData = { ...paymentInfoData, [field]: value };
		onDataChange(updatedFinanceData);
	};

	return (
		<Box>
			<DialogContentText>
				<Typography sx={{ mb: '5px' }}>
					Funds are not exchanged through the Squares platform. Tell your participants how to pay for squares.
				</Typography>
				<Typography sx={{ mb: '5px' }}>If you use Venmo, make it easy by providing your link.</Typography>
			</DialogContentText>

			<TextField
				multiline
				fullWidth
				size='small'
				label='Custom Message'
				placeholder='E.g., Please pay by...'
				helperText='Optional. Your message will be displayed to participants upon loading your board.'
				value={financeMessage}
				sx={{ margin: '1em 0', textarea: { fontSize: '14px !important' } }}
				onChange={(e) => handleDataChange('financeMessage', e.target.value || '')}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<ShortTextIcon />
						</InputAdornment>
					),
				}}
			/>

			<TextField
				error={errors.venmoUsername}
				fullWidth
				sx={{ input: { fontSize: '14px' } }}
				size='small'
				label='Venmo Username'
				helperText={
					errors.venmoUsername ? (
						'Make sure you paste your full Venmo link.'
					) : (
						<span>Optional. A link to pay you through Venmo will be provided to your participants.</span>
					)
				}
				type='text'
				placeholder='Username'
				value={venmoUsername}
				onChange={(e) => handleDataChange('venmoUsername', e.target.value || '')}
				InputProps={{
					startAdornment: <InputAdornment position='start'>{renderVenmoSVG()}</InputAdornment>,
				}}
			/>
		</Box>
	);
}
