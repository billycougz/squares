import { AccountCircle } from '@mui/icons-material';
import SmsIcon from '@mui/icons-material/Sms';
import { Divider, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useContext, useState } from 'react';
import { subscribeNumberToBoard } from '../../api';
import SmsDialog from '../../components/SmsDialog';
import AppContext from '../../App/AppContext';

export default function InitialsBox({ initials, onChange, id, boardName, setSnackbarMessage }) {
	const { updateSubscriptions } = useContext(AppContext);
	const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
	const [initialsUnderChange, setInitialsUnderChange] = useState(initials);

	const handleInitialsChange = (e) => {
		const { value } = e.target;
		onChange(initialsUnderChange);
	};

	const handleSmsSave = async ({ phoneNumber }) => {
		const { msg } = await subscribeNumberToBoard({ id, boardName, phoneNumber: phoneNumber.replace(/\s/g, '') });
		updateSubscriptions(initials, phoneNumber);
		setSnackbarMessage(msg);
		setIsSmsDialogOpen(false);
	};

	return (
		<Box sx={{ display: 'flex', alignItems: 'flex-end' }} id='initial-box'>
			<AccountCircle sx={{ color: 'action.active', ml: '12px', my: '12px' }} />
			<TextField
				// ToDo: Handle conflict with onLoad info dialog autoFocus={!initials}
				placeholder='Enter your initials...'
				fullWidth
				variant='outlined'
				value={initialsUnderChange}
				onChange={(e) => setInitialsUnderChange(e.target.value.toUpperCase())}
				onBlur={handleInitialsChange}
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
