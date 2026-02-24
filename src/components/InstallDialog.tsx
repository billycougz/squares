'use client';
import { Box, Typography } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import IosShareIcon from '@mui/icons-material/IosShare';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import StyledDialog from './StyledDialog';

interface InstallDialogProps {
    onClose: () => void;
}

function InstallStep({
    number,
    icon,
    text,
}: {
    number: number;
    icon: React.ReactNode;
    text: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: '14px',
                background: 'rgba(59, 130, 246, 0.04)',
                border: '1px solid rgba(59, 130, 246, 0.08)',
            }}
        >
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0,
                    position: 'relative',
                }}
            >
                {icon}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#fff',
                        border: '2px solid #3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        color: '#1e40af',
                        fontFamily: '"Outfit", sans-serif',
                    }}
                >
                    {number}
                </Box>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {text}
            </Typography>
        </Box>
    );
}

export default function InstallDialog({ onClose }: InstallDialogProps) {
    return (
        <StyledDialog
            title="Install Squares"
            titleIcon={<GetAppIcon sx={{ fontSize: 20 }} />}
            dismissible
            closeConfig={{ text: 'Close', action: onClose }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 0.5 }}>
                    Add Squares to your Home Screen for the best experience.
                </Typography>

                <InstallStep
                    number={1}
                    icon={<IosShareIcon sx={{ fontSize: 18 }} />}
                    text="Tap the browser's share button"
                />
                <InstallStep
                    number={2}
                    icon={<AddBoxIcon sx={{ fontSize: 18 }} />}
                    text={<>Select <strong>Add to Home Screen</strong></>}
                />
                <InstallStep
                    number={3}
                    icon={<TouchAppIcon sx={{ fontSize: 18 }} />}
                    text={<>Tap <strong>Add</strong></>}
                />
            </Box>
        </StyledDialog>
    );
}
