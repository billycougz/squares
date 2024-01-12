import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button, List, ListItem, MobileStepper, Typography } from '@mui/material';
import { useState } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const steps = [
	{
		heading: 'How To Play Squares',
		content: (
			<Box sx={{ '> *': { marginBottom: '1em !important' } }}>
				<Typography>
					Squares is the easiest way to play Super Bowl Squares with friends and family regardless of where everyone is
					located!
				</Typography>
				<Typography>
					The game is played on a 10x10 grid where participants claim one or more grid squares with their initials. Each
					square costs a dollar amount set by the Squares board creator.
				</Typography>
				<Typography>
					Once every square is claimed, the Squares board creator randomly assigns a number 0-9 across both the X and Y
					axes. The axes correspond to the two teams in the Super Bowl.
				</Typography>
				<Typography>
					At the end of each Super Bowl quarter, one square will correspond to the last digit of each team's score. The
					owner of this square wins the payout set by the Squares board creator for the given quarter.
				</Typography>
				<Typography>
					Squares is completely free and no money is exchanged through the platform. The Squares board creator
					determines how participants will exchange funds to pay for squares and receive payouts (e.g., Venmo).
				</Typography>
			</Box>
		),
	},
];

export default function LandingInfoDialog({ onClose }) {
	const [activeStepIndex, setActiveStepIndex] = useState(0);
	const { heading, content } = steps[activeStepIndex];
	return (
		<Dialog open={true} onClose={onClose} sx={{ '.MuiDialog-paper': { margin: '0 !important' } }}>
			<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>{heading}</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ '>*': { marginBottom: '1em' } }}>{content}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
