import { AccountCircle } from '@mui/icons-material';
import SmsIcon from '@mui/icons-material/Sms';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import { subscribeNumberToBoard } from '../../api';
import SmsDialog from '../../components/SmsDialog';
import AppContext from '../../App/AppContext';

export default function InitialsBox({ initials, onChange, id, boardName, setSnackbarMessage, onRefresh, venmoUsername, hasPaid, isAdmin }) {
	const { updateSubscriptions } = useContext(AppContext);
	const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
	const [initialsUnderChange, setInitialsUnderChange] = useState(initials);

	useEffect(() => {
		setInitialsUnderChange(initials);
	}, [initials]);

	const handleInitialsChange = () => {
		onChange(initialsUnderChange);
	};

	const handleSmsSave = async ({ phoneNumber }) => {
		const { msg } = await subscribeNumberToBoard({ id, boardName, phoneNumber: phoneNumber.replace(/\s/g, '') });
		updateSubscriptions(initials, phoneNumber);
		setSnackbarMessage(msg);
		setIsSmsDialogOpen(false);
	};

	const panelStyles = {
		bgcolor: 'white',
		borderRadius: '5px',
		height: '48px',
		display: 'flex',
		alignItems: 'center',
	};

	return (
		<Box sx={{ display: 'flex', gap: 1 }}>
			<Box id='initial-box' sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
				<AccountCircle sx={{ color: 'action.active', ml: '12px', my: '12px' }} />
				<TextField
					placeholder='Enter your initials...'
					fullWidth
					variant='standard'
					InputProps={{ disableUnderline: true }}
					value={initialsUnderChange}
					onChange={(e) => setInitialsUnderChange(e.target.value.toUpperCase())}
					onBlur={handleInitialsChange}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.target.blur();
						}
					}}
				/>
			</Box>


			<Box sx={{ ...panelStyles, width: '48px', justifyContent: 'center' }}>
				<IconButton color='primary' onClick={() => setIsSmsDialogOpen(true)}>
					<SmsIcon />
				</IconButton>
			</Box>

			{(isAdmin || hasPaid) && venmoUsername && (
				<Box sx={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', borderRadius: '5px' }}>
					<IconButton
						href={venmoUsername.toLowerCase().includes('https://venmo.com') ? venmoUsername : `https://venmo.com/u/${venmoUsername}`}
						target='_BLANK'
						component='a'
						sx={{ color: 'white' }}
					>
						<img src='/venmo.svg' width='24' height='24' alt='Venmo' />
					</IconButton>
				</Box>
			)}

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
