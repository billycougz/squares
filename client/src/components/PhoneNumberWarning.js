import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Box, Button, List, ListItem, MobileStepper, Typography } from '@mui/material';

export default function PhoneNumberWarning({ onClose }) {
	return (
		<Dialog open={true} onClose={onClose}>
			<DialogContent>
				<DialogContentText>
					<Alert
						variant='outlined'
						severity='warning'
						sx={{ marginTop: '1em', background: 'white', display: { xs: 'flex', sm: 'none' } }}
					>
						If you lose the link to your board there is no way to recover it.
					</Alert>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant='contained' onClick={() => onClose()} size='small'>
					Cancel
				</Button>
				<Button onClick={() => onClose(true)} size='small'>
					Proceed
				</Button>
			</DialogActions>
		</Dialog>
	);
}
