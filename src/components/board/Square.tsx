'use client';
import { Box, Paper, Popover, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState, MouseEvent } from 'react';

interface SquareProps {
    value: string | number | null;
    location: [number, number];
    backgroundColor?: string;
    onClick: (location: [number, number]) => void;
    resultPeriods?: string;
    isHeader?: boolean;
    adminMode?: string;
}

export default function Square({
    value,
    location: [row, col],
    backgroundColor,
    onClick,
    resultPeriods,
    isHeader,
    adminMode
}: SquareProps) {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up('md'));
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

    // Detect if value is an emoji for larger rendering
    const isEmoji = typeof value === 'string' && /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(value);
    const isSymbol = !isHeader && typeof value === 'string' && value.length > 0;

    const getFontSize = () => {
        if (isHeader) return isMedium ? '1.4rem' : '1.1rem';
        if (isEmoji) return isMedium ? '1.2rem' : '1.65rem';
        return isMedium ? '0.95rem' : '1.0rem';
    };

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        onClick([row, col]);
        if (resultPeriods) {
            setPopoverAnchor(e.currentTarget);
        }
    };

    const startColor = theme.palette.mode === 'dark' ? '#1A2027' : '#fff';

    return (
        <>
            <Box
                component={Paper}
                elevation={0}
                onClick={handleClick}
                sx={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: backgroundColor || startColor,
                    color: backgroundColor ? theme.palette.getContrastText(backgroundColor) : theme.palette.text.secondary,
                    cursor: isHeader ? 'default' : 'pointer',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    fontWeight: isHeader ? 700 : (isSymbol && !isEmoji) ? 500 : 400,
                    fontSize: getFontSize(),
                    lineHeight: 1,
                    userSelect: 'none',
                    '&:hover': {
                        backgroundColor: !isHeader && !backgroundColor ? theme.palette.action.hover : undefined,
                    },
                }}
            >
                {value}
            </Box>
            <Popover
                open={Boolean(popoverAnchor)}
                anchorEl={popoverAnchor}
                onClose={() => setPopoverAnchor(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 1 }}>{resultPeriods}</Typography>
            </Popover>
        </>
    );
}
