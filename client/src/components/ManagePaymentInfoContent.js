import TextField from '@mui/material/TextField';
import {
	Box,
	DialogContentText,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import ShortTextIcon from '@mui/icons-material/ShortText';
import { useState } from 'react';

const renderVenmoSVG = () => <img src='/venmo.svg' width='24' height='24' />;

function validateVenmoUrl(inputString) {
	const pattern = /^https:\/\/venmo\.com\/u\/\S+$/;
	return pattern.test(inputString.trim());
}

export default function ManagePaymentInfoContent({ paymentInfoData, onDataChange }) {
	const { adminPaymentLink, financeMessage } = paymentInfoData;

	const [errors, setErrors] = useState({});

	const handleDataChange = (field, value) => {
		if (field === 'adminPaymentLink') {
			const isValid = !value || validateVenmoUrl(value);
			setErrors({ ...errors, adminPaymentLink: !isValid });
		}
		const updatedFinanceData = { ...paymentInfoData, [field]: value };
		onDataChange(updatedFinanceData);
	};

	return (
		<Box>
			<DialogContentText>
				<Typography variant='body2' sx={{ mb: '5px' }}>
					Funds are not exchanged through the Squares platform. Tell your participants how to pay for squares. If you
					use Venmo, make it easy by providing your link.
				</Typography>
			</DialogContentText>

			<TextField
				multiline
				fullWidth
				size='small'
				label='Custom Message'
				placeholder='E.g., Please pay by...'
				value={financeMessage}
				onChange={(e) => handleDataChange('financeMessage', e.target.value || '')}
				sx={{ margin: '1em 0', '> *': { fontSize: '14px' } }}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<ShortTextIcon />
						</InputAdornment>
					),
				}}
			/>

			<TextField
				error={errors.adminPaymentLink}
				fullWidth
				sx={{ input: { fontSize: '14px' } }}
				size='small'
				label='Venmo Link'
				helperText={
					errors.adminPaymentLink ? (
						'Make sure you paste your full Venmo link.'
					) : (
						<span>Optional. In the Venmo app, tap Me, tap your photo, tap the share button, tap Copy.</span>
					)
				}
				type='text'
				placeholder='https://venmo.com/u/username'
				value={adminPaymentLink}
				onChange={(e) => handleDataChange('adminPaymentLink', e.target.value || '')}
				InputProps={{
					startAdornment: <InputAdornment position='start'>{renderVenmoSVG()}</InputAdornment>,
				}}
			/>
		</Box>
	);
}
