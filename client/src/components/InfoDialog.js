import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button, List, ListItem, MobileStepper, Typography } from '@mui/material';
import { useState } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

export default function InfoDialog({ onClose, isAdmin }) {
	const [activeStepIndex, setActiveStepIndex] = useState(0);

	const steps = [
		{
			heading: 'Squares Basics',
			content: (
				<Box sx={{ '> *': { marginBottom: '1em !important' } }}>
					<Typography>Squares is simple. Enter your initials once, then tap any square to claim it.</Typography>
					<Typography>
						To receive notifications at the end of each quarter, tap the blue message icon next to your initials.
					</Typography>
				</Box>
			),
		},
	];

	const { heading, content } = steps[activeStepIndex];

	return (
		<Dialog open={true} onClose={onClose} sx={{ '.MuiDialog-paper': { margin: '0 !important' } }}>
			<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
				{heading}
				<Button onClick={onClose}>Close</Button>
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ '>*': { marginBottom: '1em' } }}>{content}</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ marginTop: '-1em', display: steps.length > 1 ? 'block' : 'none' }}>
				<MobileStepper
					variant='dots'
					steps={steps.length}
					position='static'
					activeStep={activeStepIndex}
					nextButton={
						<Button
							size='small'
							onClick={() => setActiveStepIndex(activeStepIndex + 1)}
							disabled={activeStepIndex === steps.length - 1}
						>
							<KeyboardArrowRight />
						</Button>
					}
					backButton={
						<Button
							size='small'
							onClick={() => setActiveStepIndex(activeStepIndex - 1)}
							disabled={activeStepIndex === 0}
						>
							<KeyboardArrowLeft />
						</Button>
					}
				/>
			</DialogActions>
		</Dialog>
	);
}
