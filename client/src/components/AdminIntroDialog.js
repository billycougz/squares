import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import ManageFinanceContent from './ManageFinanceContent';
import AppContext from '../App/AppContext';
import { updateBoard } from '../api';
import IosShareIcon from '@mui/icons-material/IosShare';

export default function AdminMessageDialog({ onClose, setSnackbarMessage }) {
	const { boardData, setBoardData } = useContext(AppContext);
	const { id, boardName } = boardData;

	const [stepIndex, setStepIndex] = useState(0);

	const [financeData, setFinanceData] = useState({
		maxSquares: boardData.maxSquares,
		squarePrice: boardData.squarePrice,
		payoutSliderValues: boardData.payoutSliderValues,
	});

	const Intro = () => (
		<DialogContent>
			<Typography>As the Squares board creator, you are privileged with several capabilities.</Typography>
			<br />
			<Typography>
				You can:
				<ul style={{ paddingLeft: '25px' }}>
					<li>Set the price per square</li>
					<li>Set the max squares per person</li>
					<li>Set the quarterly payouts</li>
					<li>Set the board numbers</li>
					<li>Enter the quarterly results</li>
					<li>Remove claims from squares</li>
				</ul>
				We'll have you take care of a couple things first then let the games begin!
			</Typography>
		</DialogContent>
	);

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?id=${id}`;
		navigator.clipboard.writeText(encodeURI(link));
		setSnackbarMessage('Participant link copied to clipboard.');
	};

	const Outro = () => (
		<DialogContent sx={{ '> *': { marginTop: '10px' } }}>
			<Typography>Your finances are set and your board is ready to be shared with your participants!</Typography>
			<Typography>Click the share button below to copy your participant share link, and start sharing.</Typography>
			<Button
				sx={{ marginTop: '10px' }}
				variant='contained'
				size='small'
				onClick={handleCopyShareLink}
				fullWidth
				startIcon={<IosShareIcon />}
			>
				Copy link for participants
			</Button>
			<Typography>
				Remember a couple things:
				<ul style={{ paddingLeft: '25px' }}>
					<li>Once all squares are claimed, go to the admin tab to set the board numbers</li>
					<li>At the end of each quarter, go to the admin tab to enter the results</li>
				</ul>
			</Typography>
			<Typography>Good luck!</Typography>
		</DialogContent>
	);

	const steps = [
		{
			title: 'Get Started with Squares',
			Component: () => <Intro />,
		},
		{
			title: 'Manage Square Finances',
			Component: () => <ManageFinanceContent financeData={financeData} onDataChange={setFinanceData} />,
		},
		{
			title: 'Your Squares Board is Ready!',
			Component: () => <Outro />,
		},
	];

	// Direction is -1 or +1
	const handleStepChange = async (direction) => {
		if (direction === 1) {
			if (stepIndex === 1) {
				const { Item } = await updateBoard({ id, boardName, operation: 'finances', value: financeData });
				setBoardData({ ...Item, isAdmin: true });
			}
		}
		setStepIndex(stepIndex + direction);
	};

	return (
		<Dialog open={true} onClose={onClose}>
			<DialogTitle>{steps[stepIndex].title}</DialogTitle>
			{steps[stepIndex].Component()}
			<DialogActions sx={{ marginTop: '-1em' }}>
				{Boolean(stepIndex) && <Button onClick={() => handleStepChange(-1)}>Back</Button>}
				{stepIndex < steps.length - 1 && <Button onClick={() => handleStepChange(1)}>Next</Button>}
				{stepIndex === steps.length - 1 && <Button onClick={onClose}>Get Started</Button>}
			</DialogActions>
		</Dialog>
	);
}

const X = () => {
	const [message, setMessage] = useState('');
	return (
		<DialogContentText sx={{ '>*': { marginBottom: '1em' } }}>
			<Typography>
				Provide a custom message to your participants. If you will use Venmo to exchange funds, you can also include the
				link to your Venmo profile.
			</Typography>

			<TextField label='Message' value={message} multiline fullWidth />
			<TextField label='Venmo Link' placeholder='https://venmo.com/u/username' fullWidth />
		</DialogContentText>
	);
};
