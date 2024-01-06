import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField, TextareaAutosize, Typography } from '@mui/material';
import { useState } from 'react';

export default function AdminMessageDialog({ onClose, isAdmin }) {
	const [message, setMessage] = useState('');
	return (
		<Dialog open={true} onClose={onClose}>
			<DialogTitle>Admin Message</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ '>*': { marginBottom: '1em' } }}>
					<Typography>
						Provide a custom message to your participants. If you will use Venmo to exchange funds, you can also include
						the link to your Venmo profile.
					</Typography>

					<TextField label='Message' value={message} multiline fullWidth />
					<TextField label='Venmo Link' placeholder='https://venmo.com/u/username' fullWidth />
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ marginTop: '-1em' }}>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
