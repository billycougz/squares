
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function MockBanner() {
    return (
        <Box
            sx={{
                width: '100%',
                backgroundColor: '#ff9800',
                color: '#fff',
                textAlign: 'center',
                py: 0.5,
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                MOCK MODE ENABLED
            </Typography>
        </Box>
    );
}
