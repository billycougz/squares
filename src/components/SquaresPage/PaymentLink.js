import { Box, Button } from '@mui/material';

export default function PaymentLink({ venmoUsername, boardUser, hasPaid, setShowPaymentDialog }) {
    if (!venmoUsername) {
        return null;
    }
    const isFullLink = venmoUsername.toLowerCase().includes('https://venmo.com');
    const venmoUrl = isFullLink ? venmoUsername : `https://venmo.com/u/${venmoUsername}`;

    // Admins only see the minimized icon in InitialsBox
    if (boardUser.isAdmin || hasPaid) {
        return null;
    }

    return (
        <Box sx={{ mt: '1rem', display: 'flex', gap: 1 }}>
            <Button
                sx={{ flex: 1 }}
                variant='contained'
                fullWidth
                href={venmoUrl}
                target='_BLANK'
                startIcon={<img src='/venmo.svg' width='24' height='24' />}
            >
                {isFullLink ? `Open Venmo` : `Venmo @${venmoUsername}`}
            </Button>
            <Button
                variant='contained'
                onClick={() => setShowPaymentDialog(true)}
                sx={{
                    minWidth: '120px',
                    backgroundColor: '#66bb6a',
                    '&:hover': {
                        backgroundColor: '#57a05a'
                    }
                }}
            >
                Mark Paid
            </Button>
        </Box>
    );
}
