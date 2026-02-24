'use client';
import { Box, Typography } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import PeopleIcon from '@mui/icons-material/People';
import StyledDialog from './StyledDialog';

interface LandingInfoDialogProps {
    onClose: () => void;
}

/* ─── Visual step card ────────────────────────────────────────── */
function StepCard({
    number,
    icon,
    title,
    description,
}: {
    number: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderRadius: '14px',
                background: 'rgba(59, 130, 246, 0.04)',
                border: '1px solid rgba(59, 130, 246, 0.08)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    background: 'rgba(59, 130, 246, 0.07)',
                },
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
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
                        top: -6,
                        right: -6,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#fff',
                        border: '2px solid #3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        color: '#1e40af',
                        fontFamily: '"Outfit", sans-serif',
                    }}
                >
                    {number}
                </Box>
            </Box>
            <Box>
                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        fontFamily: '"Outfit", sans-serif',
                        color: 'text.primary',
                        mb: 0.25,
                    }}
                >
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                    {description}
                </Typography>
            </Box>
        </Box>
    );
}

export default function LandingInfoDialog({ onClose }: LandingInfoDialogProps) {
    return (
        <StyledDialog
            title="How To Play Squares"
            titleIcon={<SportsFootballIcon sx={{ fontSize: 20 }} />}
            dismissible
            closeConfig={{ text: 'Got It', action: onClose }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 0.5 }}>
                    Squares is the easiest way to play Football Squares with friends and family!
                </Typography>

                <StepCard
                    number={1}
                    icon={<TouchAppIcon sx={{ fontSize: 20 }} />}
                    title="Claim Your Squares"
                    description="Tap any square on the 10×10 grid to claim it with your initials. Each square costs a price set by the board creator."
                />

                <StepCard
                    number={2}
                    icon={<Grid4x4Icon sx={{ fontSize: 20 }} />}
                    title="Numbers Are Assigned"
                    description="Once every square is claimed, the board creator randomly assigns numbers 0–9 across both axes — each axis represents a team."
                />

                <StepCard
                    number={3}
                    icon={<SportsFootballIcon sx={{ fontSize: 20 }} />}
                    title="Watch The Game"
                    description="At the end of each quarter, the last digit of each team's score determines the winning square."
                />

                <StepCard
                    number={4}
                    icon={<EmojiEventsIcon sx={{ fontSize: 20 }} />}
                    title="Win Payouts"
                    description="The owner of the matching square wins the payout for that quarter. Four chances to win per game!"
                />

                <StepCard
                    number={5}
                    icon={<PeopleIcon sx={{ fontSize: 20 }} />}
                    title="Free Platform"
                    description="Squares is free. The board creator decides how participants exchange funds (e.g., Venmo, cash)."
                />
            </Box>
        </StyledDialog>
    );
}
