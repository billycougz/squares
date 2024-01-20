import { useContext } from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { MuiTelInput } from 'mui-tel-input';
import VerifiedIcon from '@mui/icons-material/Verified';
import AppContext from '../App/AppContext';

export default function SmsContent({ initials, onChange, onIsSubscribed, phoneNumber, showHelper, error }) {
	const { boardUser, boardData, getSubscribedNumber } = useContext(AppContext);

	const subscribedNumber = getSubscribedNumber(initials);

	if (subscribedNumber) {
		onIsSubscribed(subscribedNumber);
		return (
			<DialogContentText sx={{ mt: '10px ' }}>
				<VerifiedIcon color='primary' sx={{ mb: '-5px', pr: 1 }} />
				<strong>{subscribedNumber}</strong> is subscribed.
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
