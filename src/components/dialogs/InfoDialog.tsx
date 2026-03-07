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
import BadgeIcon from '@mui/icons-material/Badge';

import { useLocalStorage } from 'usehooks-ts';
import AppContext from '@/contexts/AppContext';
import { subscribeNumberToBoard } from '@/lib/api';
import StyledDialog, { StepActions } from './StyledDialog';

interface InfoDialogProps {
    onClose: () => void;
    isIntro?: boolean;
}

// Detect if a string contains emoji characters
const containsEmoji = (str: string) => /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(str);

export default function InfoDialog({ onClose, isIntro }: InfoDialogProps) {
    const { boardData, updateSubscriptions } = useContext(AppContext);
    const { id, boardName, squarePrice, maxSquares, financeMessage } = boardData;

    const [symbol, setSymbol] = useLocalStorage('squares-symbol', '');
    const [name, setName] = useLocalStorage('squares-name', '');
    const symbolNames: Record<string, string> = boardData.players || {};
    const [symbolUnderChange, setSymbolUnderChange] = useState(symbol);
    const [nameUnderChange, setNameUnderChange] = useState(name);
    const [phoneNumber, setPhoneNumber] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [storedNumber, setStoredNumber] = useState('');
    const [errors, setErrors] = useState<{ symbol?: boolean; name?: boolean; symbolTaken?: boolean; phoneNumber?: boolean }>({});
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

    const handleSymbolChange = (value: string) => {
        setErrors({ ...errors, symbol: false, symbolTaken: false });
        if (containsEmoji(value)) {
            const emojiMatch = value.match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/u);
            setSymbolUnderChange(emojiMatch ? emojiMatch[0] : value);
        } else {
            setSymbolUnderChange(value.toUpperCase().slice(0, 3));
        }
    };

    const handleNameChange = (value: string) => {
        setErrors({ ...errors, name: false });
        setNameUnderChange(value);
    };

    const handleSmsSave = async () => {
        const trimmed = phoneNumber.replace(/\s/g, '');
        await subscribeNumberToBoard({ id, boardName, phoneNumber: trimmed });
        updateSubscriptions(symbol, trimmed);
    };

    // Check if symbol is taken by a different name
    const isSymbolTaken = (sym: string, nm: string): boolean => {
        if (!sym || !nm) return false;
        const existingName = symbolNames[sym];
        return !!existingName && existingName !== nm;
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
                        Get started by entering your info below.
                    </Typography>
                    <TextField
                        error={errors.name}
                        placeholder="Your Name"
                        size="small"
                        fullWidth
                        value={nameUnderChange}
                        onChange={(e) => handleNameChange(e.target.value)}
                        helperText={errors.name ? 'Your name is required.' : ''}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BadgeIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        error={errors.symbol || errors.symbolTaken}
                        placeholder="Your Symbol"
                        size="small"
                        fullWidth
                        value={symbolUnderChange}
                        onChange={(e) => handleSymbolChange(e.target.value)}
                        helperText={
                            errors.symbol
                                ? 'A symbol is required.'
                                : errors.symbolTaken
                                    ? `This symbol is already used by ${symbolNames[symbolUnderChange]}.`
                                    : 'Up to 3 letters (e.g. your initials) or a single emoji.'
                        }
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
                        symbol={symbolUnderChange}
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
                                symbol at <strong>${squarePrice}</strong> per square.
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
                    symbol: !Boolean(symbolUnderChange),
                    name: !Boolean(nameUnderChange.trim()),
                    symbolTaken: isSymbolTaken(symbolUnderChange, nameUnderChange.trim()),
                    phoneNumber: !phoneIsValidOrEmpty(phoneNumber),
                };
                if (Object.values(newErrors).some((value) => value)) {
                    setErrors(newErrors);
                    return;
                }
                setSymbol(symbolUnderChange);
                setName(nameUnderChange.trim());
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
