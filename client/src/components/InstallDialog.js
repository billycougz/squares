import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button, List, ListItem, MobileStepper, Typography } from '@mui/material';

export default function InstallDialog({ onClose }) {
	return (
		<Dialog open={true} onClose={onClose}>
			<DialogTitle>Install Squares</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<Typography>Add Squares to your Home Screen for the best experience.</Typography>
					<ol>
						<li>Tap the browser's share button</li>
						<li>
							Select
							<strong>&nbsp;Add to Home Screen</strong>
						</li>
						<li>
							Tap <strong>Add</strong>
						</li>
					</ol>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
