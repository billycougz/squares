import { useContext } from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { MuiTelInput } from 'mui-tel-input';
import VerifiedIcon from '@mui/icons-material/Verified';
import AppContext from '../App/AppContext';

export default function SmsContent({ initials, onChange, onIsSubscribed, phoneNumber, showHelper, error }) {
	const { boardUser, boardData } = useContext(AppContext);
	const { boardName } = boardData;
	const { isAdmin } = boardUser;

	const storedNumber = (() => {
		const storedSubscriptions = JSON.parse(localStorage.getItem('squares-subscriptions')) || {};
		// _ADMIN is set in LandingPage upon create, other subscriptions stored by initials in InitialsBox.js
		return isAdmin ? storedSubscriptions?.[boardName]?.['_ADMIN'] : storedSubscriptions?.[boardName]?.[initials];
	})();

	if (storedNumber) {
		onIsSubscribed(storedNumber);
		return (
			<DialogContentText sx={{ mt: '10px ' }}>
				<VerifiedIcon color='primary' sx={{ mb: '-5px', pr: 1 }} />
				<strong>{storedNumber}</strong> is subscribed.
			</DialogContentText>
		);
	}

	return (
		<>
			{!showHelper && (
				<DialogContentText sx={{ mb: 2 }}>
					Receive text notifications when the board results are updated.
				</DialogContentText>
			)}
			<MuiTelInput
				error={error}
				placeholder='Phone Number'
				size='small'
				defaultCountry='US'
				forceCallingCode
				disableDropdown
				value={phoneNumber}
				onChange={onChange}
				helperText={
					!showHelper ? (
						''
					) : error ? (
						`Enter a valid phone number or remove it entirely.`
					) : (
						<span>
							Optional but recommended.
							<br /> Squares uses your phone number to send you the results at the end of each quarter.
						</span>
					)
				}
			/>
		</>
	);
}
