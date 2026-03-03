'use client';
import { useContext, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import SmsContent from './content/SmsContent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useLocalStorage } from 'usehooks-ts';
import AppContext from '@/contexts/AppContext';
import { subscribeNumberToBoard } from '@/lib/api';
import StyledDialog, { StepActions } from './StyledDialog';

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
        await subscribeNumberToBoard({ id, boardName, phoneNumber: trimmed });
        updateSubscriptions(initials, trimmed);
    };

    /* ─── Steps ───────────────────────────────────────────────── */
    const steps = [
        {
            title: 'Welcome To Squares',
            titleIcon: <SportsFootballIcon sx={{ fontSize: 20 }} />,
            sms: true,
            content: (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        Squares is the easiest way to play Football Squares with friends and family
                        — no matter where everyone is located!
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        Get started by entering your initials.
                    </Typography>
                    <TextField
                        error={errors.initials}
                        placeholder="Your Initials"
                        size="small"
                        fullWidth
                        value={initialsUnderChange}
                        onChange={(e) => handleInitialsChange(e.target.value)}
                        helperText={errors.initials ? 'Your initials are required.' : ''}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon color="primary" />
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
                </Box>
            ),
        },
        {
            title: 'How To Play',
            titleIcon: <TouchAppIcon sx={{ fontSize: 20 }} />,
            sms: false,
            content: (() => {
                const link = !venmoUsername
                    ? ''
                    : venmoUsername.toLowerCase().includes('https://venmo.com')
                        ? venmoUsername
                        : `https://venmo.com/u/${venmoUsername}`;

                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                p: 2,
                                borderRadius: '14px',
                                background: 'rgba(59, 130, 246, 0.04)',
                                border: '1px solid rgba(59, 130, 246, 0.08)',
                            }}
                        >
                            <TouchAppIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                Tap any square to instantly claim it with your initials.
                                Once a square is claimed, you cannot unclaim it.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                p: 2,
                                borderRadius: '14px',
                                background: 'rgba(59, 130, 246, 0.04)',
                                border: '1px solid rgba(59, 130, 246, 0.08)',
                            }}
                        >
                            <InfoOutlinedIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                Your administrator set the price at <strong>${squarePrice}</strong> per square.
                                {maxSquares ? ` You can claim a maximum of ${maxSquares} squares.` : ''}
                            </Typography>
                        </Box>

                        {financeMessage && (
                            <Alert
                                variant="outlined"
                                severity="info"
                                color="warning"
                                sx={{
                                    borderRadius: '14px',
                                    '& .MuiAlert-message': { width: '100%' },
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    A Message From Your Admin
                                </Typography>
                                <Typography variant="body2">{financeMessage}</Typography>
                            </Alert>
                        )}

                        {link && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 2,
                                    borderRadius: '14px',
                                    background: 'rgba(0, 140, 255, 0.04)',
                                    border: '1px solid rgba(0, 140, 255, 0.12)',
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/venmo.svg"
                                    alt="Venmo"
                                    sx={{ width: 22, height: 22, flexShrink: 0 }}
                                />
                                <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                    Pay for your squares via Venmo
                                </Typography>
                                <Link href={link} target="_BLANK" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                    Open Venmo
                                </Link>
                            </Box>
                        )}
                    </Box>
                );
            })(),
        },
    ];

    const activeSteps = isIntro ? steps : [steps[1]];
    const currentStep = activeSteps[stepIndex] || activeSteps[0];

    /* ─── Navigation ──────────────────────────────────────────── */
    const handleStepChange = async (direction: number) => {
        if (direction === 1) {
            if (currentStep.sms) {
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
        setStepIndex(prev => prev + direction);
    };

    /* ─── Render ──────────────────────────────────────────────── */
    if (isIntro) {
        const Actions = () => (
            <StepActions
                stepIndex={stepIndex}
                totalSteps={activeSteps.length}
                onBack={() => handleStepChange(-1)}
                onNext={() => handleStepChange(1)}
                onFinish={onClose}
                finishLabel="Get Started"
            />
        );

        return (
            <StyledDialog
                title={currentStep.title}
                titleIcon={currentStep.titleIcon}
                step={{ current: stepIndex, total: activeSteps.length }}
                CustomActions={Actions}
            >
                {currentStep.content}
            </StyledDialog>
        );
    }

    return (
        <StyledDialog
            title={currentStep.title}
            titleIcon={currentStep.titleIcon}
            dismissible
            closeConfig={{ text: 'Close', action: onClose }}
        >
            {currentStep.content}
        </StyledDialog>
    );
}
