'use client';
import TextField from '@mui/material/TextField';
import { Box, InputAdornment, Typography } from '@mui/material';
import ShortTextIcon from '@mui/icons-material/ShortText';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{
				display: 'flex',
				gap: 2,
				p: 2,
				borderRadius: '14px',
				background: 'rgba(59, 130, 246, 0.04)',
				border: '1px solid rgba(59, 130, 246, 0.08)',
			}}>
				<Box sx={{ flexShrink: 0, mt: 0.25, color: 'primary.main' }}>
					<InfoOutlinedIcon sx={{ fontSize: 20 }} />
				</Box>
				<Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.5 }}>
					Funds are not exchanged through the Squares platform. Create a message telling your participants how to pay
					for squares. If you use Venmo, make it easy by providing your username.
				</Typography>
			</Box>

			<TextField
				multiline
				fullWidth
				size='small'
				label='Custom Message'
				placeholder='E.g., Please pay by...'
				helperText='Optional. Your message will be displayed to participants upon loading your board.'
				value={financeMessage}
				sx={{ textarea: { fontSize: '14px !important' } }}
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
						<span>Optional. A link to pay you through Venmo will be provided to your participants. Do not include the @ symbol.</span>
					)
				}
				type='text'
				placeholder='Username'
				value={venmoUsername}
				onChange={(e) => handleDataChange('venmoUsername', (e.target.value || '').replace('@', ''))}
				InputProps={{
					startAdornment: <InputAdornment position='start'>{renderVenmoSVG()}</InputAdornment>,
				}}
			/>
		</Box>
	);
}
