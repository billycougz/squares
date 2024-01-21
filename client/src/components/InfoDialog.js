import { useContext, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	DialogActions,
	DialogContentText,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import DialogComponent from './DialogComponent';
import SmsContent from '../dialog-content/SmsContent';
import { AccountCircle } from '@mui/icons-material';
import { useLocalStorage } from 'usehooks-ts';
import AppContext from '../App/AppContext';
import { subscribeNumberToBoard } from '../api';

export default function InfoDialog({ onClose, isIntro }) {
	const { boardData, updateSubscriptions } = useContext(AppContext);
	const { id, boardName, squarePrice, maxSquares, financeMessage } = boardData;

	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [initialsUnderChange, setInitialsUnderChange] = useState(initials);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [storedNumber, setStoredNumber] = useState('');
	const [errors, setErrors] = useState({});
	const [stepIndex, setStepIndex] = useState(0);

	const phoneIsValidOrEmpty = (value) => {
		return !value || (value && value.length === 15);
	};

	const handlePhoneNumberChange = (number) => {
		if (number === '+1') {
			number = '';
		}
		setErrors({ ...errors, phoneNumber: false });
		setPhoneNumber(number);
	};

	const handleInitialsChange = (value) => {
		setErrors({ ...errors, initials: false });
		setInitialsUnderChange(value.toUpperCase());
	};

	const handleSmsSave = async () => {
		const trimmed = phoneNumber.replace(/\s/g, '');
		const { msg } = await subscribeNumberToBoard({ id, boardName, phoneNumber: trimmed });
		updateSubscriptions(initials, trimmed);
	};

	const steps = [
		{
			title: 'Welcome To Squares',
			sms: true,
			Component: () => (
				<>
					<DialogContentText sx={{ marginBottom: '1em' }}>
						Squares is the easiest way to play Football Squares with friends and family regardless of where everyone is
						located!
					</DialogContentText>
					<DialogContentText sx={{ marginBottom: '1em' }}>Get started by entering your initials.</DialogContentText>
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
					<SmsContent
						error={errors.phoneNumber}
						showHelper={true}
						initials={initialsUnderChange}
						phoneNumber={phoneNumber}
						onChange={handlePhoneNumberChange}
						onIsSubscribed={setStoredNumber}
					/>
				</>
			),
		},
		{
			title: 'Squares Is Simple',
			Component: () => (
				<DialogContentText>
					<Typography sx={{ marginBottom: '1em' }}>
						Tap any square to instantly claim it with your initials. Once a square is claimed you cannot unclaim it.
					</Typography>
					<Typography sx={{ marginBottom: '1em' }}>
						Your Squares administrator has set the price at ${squarePrice} per square.
						{maxSquares ? ` You can claim a maximum of ${maxSquares} squares.` : ''}
					</Typography>

					{financeMessage && (
						<Alert variant='outlined' severity='info' sx={{ margin: '1em 0 0 0', background: 'white' }} icon={false}>
							<strong style={{ display: 'block', marginBottom: '5px' }}>A Message From Your Admin</strong>
							{financeMessage}
						</Alert>
					)}
				</DialogContentText>
			),
		},
	];

	if (!isIntro) {
		// Only prompt for initials and phone on intro flow
		steps.shift();
	}

	// Direction is -1 (back) or +1 (next)
	const handleStepChange = async (direction) => {
		if (direction === 1) {
			if (steps[stepIndex].sms) {
				const errors = {
					initials: !Boolean(initialsUnderChange),
					phoneNumber: !phoneIsValidOrEmpty(phoneNumber),
				};
				if (Object.values(errors).some((value) => value)) {
					setErrors(errors);
					return;
				}
				setInitials(initialsUnderChange);
				if (phoneNumber) {
					await handleSmsSave();
				}
			}
		}
		setStepIndex(stepIndex + direction);
	};

	const StepActions = () => (
		<DialogActions sx={{ marginTop: '-1em' }}>
			{Boolean(stepIndex) && <Button onClick={() => handleStepChange(-1)}>Back</Button>}
			{stepIndex < steps.length - 1 && <Button onClick={() => handleStepChange(1)}>Next</Button>}
			{stepIndex === steps.length - 1 && <Button onClick={onClose}>Get Started</Button>}
		</DialogActions>
	);

	return (
		<DialogComponent
			title={steps[stepIndex].title}
			closeConfig={{ display: !isIntro, text: 'Close', action: onClose }}
			CustomActions={isIntro && StepActions}
		>
			{steps[stepIndex].Component()}
		</DialogComponent>
	);
}
