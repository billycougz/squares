'use client';
import { useContext, useState } from 'react';
import {
    Alert,
    Button,
    DialogActions,
    DialogContentText,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import DialogComponent from './DialogComponent';
import SmsContent from '@/components/dialog-content/SmsContent';
import { AccountCircle } from '@mui/icons-material';
import { useLocalStorage } from 'usehooks-ts';
import AppContext from '@/contexts/AppContext';
import { subscribeNumberToBoard } from '@/lib/api';

interface InfoDialogProps {
    onClose: () => void;
    isIntro?: boolean;
}

export default function InfoDialog({ onClose, isIntro }: InfoDialogProps) {
    const { boardData, updateSubscriptions } = useContext(AppContext);
    const { id, boardName, squarePrice, maxSquares, financeMessage, venmoUsername } = boardData;

    const [initials, setInitials] = useLocalStorage('squares-initials', '');
    const [initialsUnderChange, setInitialsUnderChange] = useState(initials);
    const [phoneNumber, setPhoneNumber] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [storedNumber, setStoredNumber] = useState('');
    const [errors, setErrors] = useState<{ initials?: boolean; phoneNumber?: boolean }>({});
    const [stepIndex, setStepIndex] = useState(0);

    const phoneIsValidOrEmpty = (value: string) => {
        return !value || (value && value.length === 15);
    };

    const handlePhoneNumberChange = (number: string) => {
        if (number === '+1') {
            number = '';
        }
        setErrors({ ...errors, phoneNumber: false });
        setPhoneNumber(number);
    };

    const handleInitialsChange = (value: string) => {
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
        } as const,
        {
            title: 'Squares Is Simple',
            sms: false,
            Component: () => {
                const link = !venmoUsername
                    ? ''
                    : venmoUsername.toLowerCase().includes('https://venmo.com')
                        ? venmoUsername
                        : `https://venmo.com/u/${venmoUsername}`;

                return (
                    <DialogContentText component="div">
                        <Typography sx={{ marginBottom: '1em' }}>
                            Tap any square to instantly claim it with your initials. Once a square is claimed you cannot unclaim it.
                        </Typography>
                        <Typography sx={{ marginBottom: '1em' }}>
                            Your Squares administrator has set the price at ${squarePrice} per square.
                            {maxSquares ? ` You can claim a maximum of ${maxSquares} squares.` : ''}
                        </Typography>

                        {financeMessage && (
                            <Alert variant='outlined' severity='info' color='warning'>
                                <strong style={{ display: 'block', marginBottom: '5px' }}>A Message From Your Admin</strong>
                                <Typography>{financeMessage}</Typography>
                                {link && (
                                    <>
                                        <br />
                                        <Link href={link} target='_BLANK' sx={{ fontWeight: 'bold' }}>
                                            Open Venmo
                                        </Link>
                                    </>
                                )}
                            </Alert>
                        )}
                    </DialogContentText>
                );
            },
        },
    ];

    const activeSteps = isIntro ? steps : [steps[1]];

    const handleStepChange = async (direction: number) => {
        if (direction === 1) {
            if (activeSteps[stepIndex].sms) {
                const newErrors = {
                    initials: !Boolean(initialsUnderChange),
                    phoneNumber: !phoneIsValidOrEmpty(phoneNumber),
                };
                if (Object.values(newErrors).some((value) => value)) {
                    setErrors(newErrors);
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
            {stepIndex < activeSteps.length - 1 && <Button onClick={() => handleStepChange(1)}>Next</Button>}
            {stepIndex === activeSteps.length - 1 && <Button onClick={onClose}>Get Started</Button>}
        </DialogActions>
    );

    return (
        <DialogComponent
            title={activeSteps[stepIndex].title}
            closeConfig={{ display: !isIntro, text: 'Close', action: onClose }}
            CustomActions={isIntro ? StepActions : undefined}
        >
            {activeSteps[stepIndex].Component()}
        </DialogComponent>
    );
}
