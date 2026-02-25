'use client';
import { ReactNode, forwardRef } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Grow,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

/* ─── Transition ──────────────────────────────────────────────── */
const GrowTransition = forwardRef(function GrowTransition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow ref={ref} {...props} timeout={350} />;
});

/* ─── Types ───────────────────────────────────────────────────── */
interface StepConfig {
    current: number;
    total: number;
}

interface ActionConfig {
    display?: boolean;
    text?: string;
    disabled?: boolean;
    variant?: 'text' | 'contained' | 'gradient';
    action?: () => void;
}

export interface StyledDialogProps {
    /** Dialog title text */
    title: string;
    /** Optional icon element displayed left of the title */
    titleIcon?: ReactNode;
    /** Dialog body */
    children: ReactNode;
    /** Step progress (omit to hide the progress bar) */
    step?: StepConfig;
    /** Whether clicking the backdrop closes the dialog */
    dismissible?: boolean;
    /** Primary (close / cancel) action button config */
    closeConfig?: ActionConfig;
    /** Secondary (save / next) action button config */
    saveConfig?: ActionConfig;
    /** Completely custom actions — replaces the default action buttons */
    CustomActions?: React.ElementType;
    /** Allow full-width on desktop too */
    fullWidth?: boolean;
    /** Max width constraint */
    maxWidth?: 'xs' | 'sm' | 'md';
}

/* ─── Shared sx tokens ────────────────────────────────────────── */
const dialogPaperSx = {
    borderRadius: { xs: '20px 20px 0 0', sm: '20px' },
    overflow: 'hidden',
    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    maxHeight: { xs: '92vh', sm: '85vh' },
};

const gradientButtonSx = {
    borderRadius: '12px',
    py: 1.2,
    px: 3,
    fontSize: '0.95rem',
    fontWeight: 700,
    textTransform: 'none' as const,
    fontFamily: '"Outfit", sans-serif',
    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
    '&:hover': {
        background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
    },
    '&.Mui-disabled': {
        background: 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
        color: 'rgba(255,255,255,0.7)',
        boxShadow: 'none',
    },
};

/* ─── Component ───────────────────────────────────────────────── */
export default function StyledDialog({
    title,
    titleIcon,
    children,
    step,
    dismissible = false,
    closeConfig,
    saveConfig,
    CustomActions,
    fullWidth = false,
    maxWidth = 'sm',
}: StyledDialogProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const defaultClose: ActionConfig = { display: true, text: 'Close', action: () => { } };
    const defaultSave: ActionConfig = { display: false, text: 'Save', disabled: false, action: () => { } };

    const mergedClose = { ...defaultClose, ...closeConfig };
    const mergedSave = { ...defaultSave, ...saveConfig };

    return (
        <Dialog
            open={true}
            onClose={dismissible ? mergedClose.action : undefined}
            fullWidth={fullWidth || isMobile}
            maxWidth={maxWidth}
            TransitionComponent={GrowTransition}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(8px)',
                },
            }}
            PaperProps={{
                sx: {
                    ...dialogPaperSx,
                    ...(isMobile && {
                        position: 'fixed',
                        bottom: 0,
                        m: 0,
                        width: '100%',
                        maxWidth: '100%',
                        borderRadius: '20px 20px 0 0',
                    }),
                },
            }}
        >
            {/* ── Progress bar ─────────────────────────────── */}
            {step && (
                <Box sx={{ px: 0, pt: 0 }}>
                    <Box
                        sx={{
                            height: 4,
                            width: '100%',
                            background: 'rgba(0,0,0,0.06)',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: `${((step.current + 1) / step.total) * 100}%`,
                                background: 'linear-gradient(90deg, #3b82f6, #1e40af)',
                                borderRadius: '0 4px 4px 0',
                                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                    </Box>
                </Box>
            )}

            {/* ── Title ────────────────────────────────────── */}
            <DialogTitle
                sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '1.15rem', sm: '1.3rem' },
                    letterSpacing: '-0.01em',
                    color: theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pb: 1,
                    pt: step ? 2.5 : 3,
                    px: 3,
                }}
            >
                {titleIcon && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                            color: '#fff',
                            flexShrink: 0,
                        }}
                    >
                        {titleIcon}
                    </Box>
                )}
                <Box sx={{ flex: 1 }}>{title}</Box>
                {dismissible && (
                    <IconButton
                        onClick={mergedClose.action}
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': { background: 'rgba(0,0,0,0.04)' },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </DialogTitle>

            {/* ── Step indicator text ──────────────────────── */}
            {step && (
                <Box sx={{ px: 3, pb: 0.5 }}>
                    <Box
                        sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            letterSpacing: '0.04em',
                        }}
                    >
                        STEP {step.current + 1} OF {step.total}
                    </Box>
                </Box>
            )}

            {/* ── Content ──────────────────────────────────── */}
            <DialogContent sx={{ px: 3, py: 2 }}>
                {children}
            </DialogContent>

            {/* ── Actions ──────────────────────────────────── */}
            {CustomActions && <CustomActions />}
            {!CustomActions && (mergedClose.display || mergedSave.display) && (
                <DialogActions
                    sx={{
                        px: 3,
                        pb: isMobile ? 3 : 2.5,
                        pt: 1,
                        gap: 1,
                    }}
                >
                    {mergedClose.display && (
                        <Button
                            onClick={mergedClose.action}
                            sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: '10px',
                                px: 2.5,
                                color: 'text.secondary',
                            }}
                        >
                            {mergedClose.text}
                        </Button>
                    )}
                    {mergedSave.display && (
                        <Button
                            disabled={mergedSave.disabled}
                            onClick={mergedSave.action}
                            variant="contained"
                            sx={
                                mergedSave.variant === 'gradient' || !mergedSave.variant
                                    ? gradientButtonSx
                                    : {
                                        fontFamily: '"Outfit", sans-serif',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: '10px',
                                        px: 2.5,
                                    }
                            }
                        >
                            {mergedSave.text}
                        </Button>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
}

/* ─── Exported helpers for consistent step action bars ─────────── */
export interface StepActionsProps {
    stepIndex: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
    /** Label for the final action button */
    finishLabel?: string;
    /** Whether the next/finish button is disabled */
    nextDisabled?: boolean;
}

export function StepActions({
    stepIndex,
    totalSteps,
    onBack,
    onNext,
    onFinish,
    finishLabel = 'Get Started',
    nextDisabled = false,
}: StepActionsProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <DialogActions
            sx={{
                px: 3,
                pb: isMobile ? 3 : 2.5,
                pt: 1,
                gap: 1,
                justifyContent: 'space-between',
            }}
        >
            <Box>
                {stepIndex > 0 && (
                    <Button
                        onClick={onBack}
                        sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 2.5,
                            color: 'text.secondary',
                        }}
                    >
                        Back
                    </Button>
                )}
            </Box>
            <Box>
                {stepIndex < totalSteps - 1 ? (
                    <Button
                        onClick={onNext}
                        disabled={nextDisabled}
                        variant="contained"
                        sx={gradientButtonSx}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={onFinish}
                        disabled={nextDisabled}
                        variant="contained"
                        sx={gradientButtonSx}
                    >
                        {finishLabel}
                    </Button>
                )}
            </Box>
        </DialogActions>
    );
}
