'use client';
import { useState } from 'react';
import SmsIcon from '@mui/icons-material/Sms';
import SmsContent from '@/components/dialog-content/SmsContent';
import StyledDialog from './StyledDialog';

interface SmsDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (params: { phoneNumber: string }) => void;
	initials: string;
	boardName?: string;
}

export default function SmsDialog({ open, onClose, onSave, initials, boardName }: SmsDialogProps) {
	const [phoneNumber, setPhoneNumber] = useState('');
	const [storedNumber, setStoredNumber] = useState('');

	if (!open) return null;

	return (
		<StyledDialog
			title="Board Notifications"
			titleIcon={<SmsIcon sx={{ fontSize: 20 }} />}
			fullWidth
			closeConfig={{ text: storedNumber ? 'Close' : 'Cancel', action: onClose }}
			saveConfig={{
				display: !storedNumber,
				text: 'Save',
				disabled: !phoneNumber || phoneNumber.length !== 15,
				action: () => onSave({ phoneNumber }),
			}}
		>
			<SmsContent
				initials={initials}
				phoneNumber={phoneNumber}
				onChange={setPhoneNumber}
				onIsSubscribed={setStoredNumber}
			/>
		</StyledDialog>
	);
}
