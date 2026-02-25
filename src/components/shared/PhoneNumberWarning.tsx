'use client';
import { Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StyledDialog from '@/components/dialogs/StyledDialog';

interface PhoneNumberWarningProps {
    onClose: (proceed?: boolean) => void;
}

export default function PhoneNumberWarning({ onClose }: PhoneNumberWarningProps) {
    return (
        <StyledDialog
            title="Skip Phone Number?"
            titleIcon={<WarningAmberIcon sx={{ fontSize: 20, color: '#f59e0b' }} />}
            closeConfig={{
                text: 'Skip Phone',
                action: () => onClose(true),
            }}
            saveConfig={{
                display: true,
                text: 'Add Phone',
                action: () => onClose(),
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    If you lose the link to your board, there is no way to recover it.
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    Board event notifications enhance the Squares experience for all users.
                </Typography>
            </Box>
        </StyledDialog>
    );
}
