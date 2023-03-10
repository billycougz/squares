import { AccountCircle } from '@mui/icons-material';
import SmsIcon from '@mui/icons-material/Sms';
import { Divider, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { subscribeNumberToBoard } from '../../api';
import SmsDialog from '../../components/SmsDialog';

export default function InitialsBox({ initials, onChange, boardName, setSnackbarMessage }) {
	const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);

	const handleInitialsChange = (e) => {
		const { value } = e.target;
		onChange(value.toUpperCase());
	};

	const handleSmsSave = async ({ phoneNumber }) => {
		const { msg } = await subscribeNumberToBoard({ boardName, phoneNumber: phoneNumber.replace(/\s/g, '') });
		const storedSubscriptions = JSON.parse(localStorage.getItem('squares-subscriptions')) || {};
		storedSubscriptions[boardName] = storedSubscriptions[boardName] || {};
		storedSubscriptions[boardName][initials] = phoneNumber;
		localStorage.setItem('squares-subscriptions', JSON.stringify(storedSubscriptions));
		setSnackbarMessage(msg);
		setIsSmsDialogOpen(false);
	};

	return (
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
	);
}
