import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Alert, Button } from '@mui/material';

export default function PhoneNumberWarning({ onClose }) {
	return (
		<Dialog open={true} onClose={onClose}>
			<DialogContent>
				<DialogContentText>
					<Alert variant='outlined' severity='warning'>
						<strong style={{ marginBottom: '10px', display: 'block' }}>Skip phone number?</strong>
						<p>If you lose the link to your board there is no way to recover it.</p>
						<p>Board event notifications greatly enhance the Squares experience.</p>
					</Alert>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant='contained' onClick={() => onClose()} size='small'>
					Go Back
				</Button>
				<Button onClick={() => onClose(true)} size='small'>
					Skip
				</Button>
			</DialogActions>
		</Dialog>
	);
}
