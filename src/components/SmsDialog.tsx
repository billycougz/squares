'use client';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogContent } from '@mui/material';
import SmsContent from '@/components/dialog-content/SmsContent';

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
	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>Board Notifications</DialogTitle>
			<DialogContent>
				<SmsContent
					initials={initials}
					phoneNumber={phoneNumber}
					onChange={setPhoneNumber}
					onIsSubscribed={setStoredNumber}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>{storedNumber ? 'Close' : 'Cancel'}</Button>
				{!storedNumber && (
					<Button onClick={() => onSave({ phoneNumber })} disabled={!phoneNumber || phoneNumber.length !== 15}>
						Save
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
