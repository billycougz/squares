import { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import VerifiedIcon from '@mui/icons-material/Verified';
import AppContext from '../App/AppContext';

export default function SmsDialog({ open, onClose, onSave, boardName, initials }) {
	const { boardUser } = useContext(AppContext);
	const { isAdmin } = boardUser;

	const [phoneNumber, setPhoneNumber] = useState('');

	const storedNumber = (() => {
		const storedSubscriptions = JSON.parse(localStorage.getItem('squares-subscriptions')) || {};
		// _ADMIN is set in LandingPage upon create, other subscriptions stored by initials in InitialsBox.js
		return isAdmin ? storedSubscriptions?.[boardName]?.['_ADMIN'] : storedSubscriptions?.[boardName]?.[initials];
	})();

	if (storedNumber) {
		return (
			<Dialog open={open} onClose={onClose} fullWidth>
				<DialogTitle>Board Notifications</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<VerifiedIcon color='primary' sx={{ mb: '-5px', pr: 1 }} />
						<strong>{storedNumber}</strong> is subscribed.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Close</Button>
				</DialogActions>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>Board Notifications</DialogTitle>
			<DialogContent>
				<DialogContentText>Receive text notifications when the board results are updated.</DialogContentText>
				<MuiTelInput
					size='small'
					defaultCountry='US'
					forceCallingCode
					disableDropdown
					sx={{ mt: 2 }}
					value={phoneNumber}
					onChange={setPhoneNumber}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={() => onSave({ phoneNumber })} disabled={!phoneNumber}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
