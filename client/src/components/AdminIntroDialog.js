import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Divider, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import ManageFinanceContent from './ManageFinanceContent';
import ManagePaymentInfoContent from './ManagePaymentInfoContent';
import AppContext from '../App/AppContext';
import { updateBoard } from '../api';
import IosShareIcon from '@mui/icons-material/IosShare';
import { AccountCircle } from '@mui/icons-material';
import { useLocalStorage } from 'usehooks-ts';

export default function AdminMessageDialog({ onClose, setSnackbarMessage }) {
	const { boardData, setBoardData, updateSubscriptions, boardUser } = useContext(AppContext);
	const { id, boardName, squarePrice, maxSquares, payoutSliderValues, venmoUsername, financeMessage } = boardData;

	// ToDo: This is currently handling finance and paymentInfo, this can be handled better
	const [financeData, setFinanceData] = useState({
		squarePrice,
		maxSquares,
		payoutSliderValues,
		venmoUsername,
		financeMessage,
	});

	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [initialsUnderChange, setInitialsUnderChange] = useState(initials);
	const [errors, setErrors] = useState({});

	const [stepIndex, setStepIndex] = useState(0);

	const Intro = () => (
		<DialogContentText>
			<Typography sx={{ marginBottom: '1em' }}>
				Squares is simple. Just enter your initials and you're ready to play!
			</Typography>
			<Typography sx={{ marginBottom: '1em' }}>
				To play, tap any square to instantly claim it with your initials. Participants cannot unclaim squares, however,
				you as the administrator can remove the claims of any player.
			</Typography>
			<Typography>
				Funds are not exchanged through the Squares platform. You decide how to collect funds from participants and pay
				winners (Venmo, cash, etc.).
			</Typography>
		</DialogContentText>
	);

	const Admin = () => (
		<DialogContentText>
			<Typography>You as the Squares board creator will administer the game.</Typography>
			<Typography sx={{ mt: '1em' }}>
				<strong>Before the game begins:</strong>
				<ul style={{ paddingLeft: '25px' }}>
					<li>Set the square finances</li>
					<li>Invite your participants</li>
				</ul>
			</Typography>
			<Typography sx={{ mt: '1em' }}>
				<strong>Once all squares are claimed:</strong>
				<ul style={{ paddingLeft: '25px' }}>
					<li>Set the board numbers</li>
				</ul>
			</Typography>
			<Typography>
				<strong>At the end of each quarter:</strong>
				<ul style={{ paddingLeft: '25px' }}>
					<li>Enter the results</li>
					<li>Pay the winner</li>
				</ul>
			</Typography>
			<Typography>You are also the only person that can remove initials from a square.</Typography>
		</DialogContentText>
	);

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?id=${id}`;
		const msg = `Join my Football Squares pool for Super Bowl LVIII!\n\n${encodeURI(link)}`;
		navigator.clipboard.writeText(msg);
		setSnackbarMessage('Participant link copied to clipboard.');
	};

	const handleInitialsChange = (value) => {
		setErrors({ ...errors, initials: false });
		setInitialsUnderChange(value);
	};

	const Share = () => (
		<DialogContentText sx={{ '> *': { marginTop: '10px' }, '> p:first-child': { marginTop: '0' } }}>
			<Typography>
				Your board is ready to be shared with your participants! Copy your board's unique share link and send it out to
				everyone that you want to invite.
			</Typography>
			<Typography></Typography>
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
		</DialogContentText>
	);

	const Outro = () => (
		<DialogContentText sx={{ '> *': { marginTop: '10px' } }}>
			<Divider sx={{ mt: '-10px' }} />
			<Typography>
				<strong>To Play: </strong>Simply tap any square to instantly claim it with your initials.
			</Typography>
			<Divider sx={{ mt: '10px' }} />
			<Typography variant='h6'>Administration</Typography>
			<Typography sx={{ fontSize: '12px' }}>Find the following controls in the Admin tab.</Typography>
			<Typography>
				<strong>Board Numbers: </strong>Once all squares are claimed, set the board numbers.
			</Typography>
			<Typography>
				<strong>Quarterly Results: </strong>At the end of each quarter, enter the results.
			</Typography>
			<Typography>
				<strong>Invite Participants: </strong>Copy the participant link at any time.
			</Typography>
			<Typography>
				<strong>Finances: </strong>Update the finances and payment info.
			</Typography>
			<Divider sx={{ mt: '10px' }} />
			<Typography>
				<strong>Feedback: </strong>Report any feedback to{' '}
				<Link href='mailto:couganapps@gmail.com' underline='none'>
					CouganApps@gmail.com
				</Link>
				.
			</Typography>
		</DialogContentText>
	);

	const steps = [
		{
			title: 'Welcome To Squares',
			updateInitials: true,
			Component: () => (
				<DialogContentText>
					<Typography variant='body1' sx={{ marginBottom: '1em' }}>
						Squares is the easiest way to play Football Squares with friends and family regardless of where everyone is
						located!
					</Typography>

					<Typography variant='body1' sx={{ marginBottom: '1em' }}>
						Get started by entering your initials.
					</Typography>
					<TextField
						error={errors.initials}
						placeholder='Your Initials'
						size='small'
						fullWidth
						value={initialsUnderChange}
						onChange={(e) => handleInitialsChange(e.target.value)}
						onBlur
						helperText={errors.initials ? 'Your initials are required.' : ''}
						sx={{ marginBottom: '10px' }}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<AccountCircle />
								</InputAdornment>
							),
						}}
					/>
				</DialogContentText>
			),
		},
		{
			title: 'Administering Squares',
			Component: () => <Admin />,
		},
		{
			title: 'Square Finances',
			isFinance: true,
			Component: () => <ManageFinanceContent financeData={financeData} onDataChange={setFinanceData} />,
		},
		{
			title: 'Payment Information',
			isFinance: true,
			Component: () => (
				<ManagePaymentInfoContent
					paymentInfoData={financeData}
					onDataChange={(paymentInfoData) => setFinanceData({ ...financeData, ...paymentInfoData })}
				/>
			),
		},
		{
			title: 'Invite Your Participants',
			Component: () => <Share />,
		},
		{
			title: 'Remember A Few Things',
			Component: () => <Outro />,
		},
	];

	// Direction is -1 (back) or +1 (next)
	const handleStepChange = async (direction) => {
		if (direction === 1) {
			if (steps[stepIndex].isFinance) {
				// Save finances
				const { Item } = await updateBoard({ id, boardName, operation: 'finances', value: financeData });
				setBoardData({ ...Item });
			} else if (steps[stepIndex].updateInitials) {
				const errors = {
					initials: !Boolean(initialsUnderChange),
				};
				if (Object.values(errors).some((value) => value)) {
					setErrors(errors);
					return;
				}
				setInitials(initialsUnderChange);
			}
		}
		setStepIndex(stepIndex + direction);
	};

	const handleStart = async () => {
		const value = {
			adminIntroComplete: true,
		};
		await updateBoard({ id, operation: 'update', value });
		if (boardUser.adminPhoneNumber) {
			updateSubscriptions(initials, boardUser.adminPhoneNumber);
		}
		onClose();
	};

	return (
		<Dialog open={true} onClose={null}>
			<DialogTitle>{steps[stepIndex].title}</DialogTitle>
			<DialogContent>{steps[stepIndex].Component()}</DialogContent>
			<DialogActions sx={{ marginTop: '-1em' }}>
				{Boolean(stepIndex) && <Button onClick={() => handleStepChange(-1)}>Back</Button>}
				{stepIndex < steps.length - 1 && <Button onClick={() => handleStepChange(1)}>Next</Button>}
				{stepIndex === steps.length - 1 && <Button onClick={handleStart}>Get Started</Button>}
			</DialogActions>
		</Dialog>
	);
}
