'use client';
import { Box, Button, Chip, Typography, useTheme, alpha } from '@mui/material';

interface PaymentLinkProps {
    venmoUsername?: string;
    boardUser: { isAdmin: boolean };
    hasPaid: boolean;
    setShowPaymentDialog: (show: boolean) => void;
    squarePrice?: number;
    symbol?: string;
    squareCount?: number;
    variant?: 'banner' | 'panel';
}

export default function PaymentLink({
    venmoUsername,
    boardUser,
    hasPaid,
    setShowPaymentDialog,
    squarePrice,
    symbol,
    squareCount = 0,
    variant = 'banner',
}: PaymentLinkProps) {
    const theme = useTheme();

    if (!venmoUsername) {
        return null;
    }

    const isFullLink = venmoUsername.toLowerCase().includes('https://venmo.com');
    const venmoUrl = isFullLink ? venmoUsername : `https://venmo.com/u/${venmoUsername}`;
    const displayName = isFullLink ? 'Venmo' : `@${venmoUsername}`;
    const amountOwed = squarePrice && squareCount > 0 ? squareCount * squarePrice : 0;

    // ── Admin view: Venmo link available in header menu ──
    if (boardUser.isAdmin) {
        return null;
    }

    // ── Paid user: hide banner (Venmo remains accessible via header menu) ──
    if (hasPaid) {
        return null;
    }

    // ── Unpaid user: prominent CTA ──
    const isBanner = variant === 'banner';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isBanner ? 'row' : 'column',
                alignItems: isBanner ? 'center' : 'stretch',
                gap: isBanner ? 1.5 : 1.5,
                py: isBanner ? 1.5 : 2,
                px: 2,
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${alpha('#008CFF', 0.06)} 0%, ${alpha('#008CFF', 0.02)} 100%)`,
                border: `1px solid ${alpha('#008CFF', 0.15)}`,
            }}
        >
            {/* Amount info */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flex: isBanner ? 1 : undefined,
                    minWidth: 0,
                }}
            >
                <Box
                    component="img"
                    src="/venmo.svg"
                    alt="Venmo"
                    sx={{ width: 22, height: 22, flexShrink: 0 }}
                />
                <Box sx={{ minWidth: 0 }}>
                    {amountOwed > 0 ? (
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                lineHeight: 1.3,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            You owe ${amountOwed}
                        </Typography>
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1.3 }}
                        >
                            Pay for your squares
                        </Typography>
                    )}
                    {amountOwed > 0 && (
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.disabled', lineHeight: 1.2 }}
                        >
                            {squareCount} square{squareCount !== 1 ? 's' : ''} × ${squarePrice}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
                <Button
                    component="a"
                    href={venmoUrl}
                    target="_blank"
                    variant="contained"
                    size="small"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        borderRadius: '10px',
                        px: 2,
                        py: 0.75,
                        bgcolor: '#008CFF',
                        boxShadow: `0 2px 8px ${alpha('#008CFF', 0.3)}`,
                        '&:hover': {
                            bgcolor: '#0070CC',
                            boxShadow: `0 4px 12px ${alpha('#008CFF', 0.4)}`,
                        },
                    }}
                >
                    {amountOwed > 0 ? `Pay $${amountOwed}` : 'Open Venmo'}
                </Button>
                <Chip
                    label="Mark Paid"
                    size="small"
                    variant="outlined"
                    onClick={() => setShowPaymentDialog(true)}
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                        borderColor: alpha(theme.palette.text.secondary, 0.2),
                        color: 'text.secondary',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.success.main, 0.08),
                            borderColor: 'success.main',
                            color: 'success.dark',
                        },
                    }}
                />
            </Box>
        </Box>
    );
}
