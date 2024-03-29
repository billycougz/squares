import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Button, DialogTitle, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function PhoneNumberWarning({ onClose }) {
	return (
		<Dialog open={true} onClose={onClose}>
			<DialogTitle sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1rem' }}>
				<WarningAmberIcon sx={{ color: '#ed6c02;' }} />
				Skip Phone Number?
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<Typography sx={{ mb: '10px' }}>If you lose the link to your board there is no way to recover it.</Typography>
					<Typography>Board event notifications enhance the Squares experience for all users.</Typography>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant='contained' onClick={() => onClose()} size='small' sx={{ mb: '10px' }}>
					Add Phone
				</Button>
				<Button onClick={() => onClose(true)} size='small'>
					Skip Phone
				</Button>
			</DialogActions>
		</Dialog>
	);
}
