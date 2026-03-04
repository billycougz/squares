'use client';
import { useContext, useState } from 'react';
import {
    Box,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import SmsContent from './content/SmsContent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TouchAppIcon from '@mui/icons-material/TouchApp';

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
    const { id, boardName, squarePrice, maxSquares, financeMessage } = boardData;

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
            titleIcon: <DashboardIcon sx={{ fontSize: 20 }} />,
            sms: true,
            content: (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        The platform for hosting your Squares competitions online.
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
                /* ── Shared rule-row style ─────────────────────────── */
                const ruleRow = {
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                };
                const ruleBullet = (n: number) => ({
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    mt: 0.1,
                });

                return (
                    <Box
                        sx={{
                            p: 2.5,
                            borderRadius: '16px',
                            background: 'rgba(59, 130, 246, 0.04)',
                            border: '1px solid rgba(59, 130, 246, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Box sx={ruleRow}>
                            <Box sx={ruleBullet(1)}>1</Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, pt: 0.25 }}>
                                Tap any open square to <strong>claim&nbsp;it</strong> with your
                                initials at <strong>${squarePrice}</strong> per square.
                                {maxSquares
                                    ? <> You may claim up to <strong>{maxSquares}</strong> squares.</>
                                    : ''}{' '}
                                Once claimed, it can&rsquo;t be unclaimed.
                            </Typography>
                        </Box>

                        <Box sx={ruleRow}>
                            <Box sx={ruleBullet(2)}>2</Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, pt: 0.25 }}>
                                Numbers are assigned <strong>randomly</strong> once the board is
                                full — winners are determined by the last digit of each
                                team&rsquo;s score at the end of each period.
                            </Typography>
                        </Box>

                        {financeMessage && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontStyle: 'italic',
                                    lineHeight: 1.6,
                                    pt: 1.5,
                                    borderTop: '1px solid rgba(59, 130, 246, 0.08)',
                                    mt: 1,
                                }}
                            >
                                <Box component="span" sx={{ fontStyle: 'normal', fontWeight: 600 }}>
                                    A message from your admin —
                                </Box>
                                {' '}{financeMessage}
                            </Typography>
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

