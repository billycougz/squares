'use client';
import { useEffect, useState } from 'react';
import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
    Typography,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StyledDialog from './StyledDialog';

interface Team {
    name: string;
    code?: string;
}

interface Teams {
    horizontal: Team;
    vertical: Team;
}

interface Scores {
    horizontal: number;
    vertical: number;
}

interface Result {
    scores?: Scores;
}

interface ResultsDialogProps {
    onClose: () => void;
    onSave: (data: { quarterIndex: number; scores: Scores; cell: [number, number] }) => void;
    gridData: number[][];
    teams: Teams;
    results: Result[];
}

export default function ResultsDialog({ onClose, onSave, gridData, teams, results }: ResultsDialogProps) {
    const [scores, setScores] = useState<Scores>({ horizontal: 0, vertical: 0 });
    const firstEmptyQuarter = results.findIndex((result) => !result.scores);
    const [quarterIndex, setQuarterIndex] = useState(firstEmptyQuarter >= 0 ? firstEmptyQuarter : results.length - 1);

    useEffect(() => {
        setScores({
            horizontal: results[quarterIndex].scores?.horizontal || 0,
            vertical: results[quarterIndex].scores?.vertical || 0,
        });
    }, [quarterIndex, results]);

    const handleChange = (value: string, side: keyof Scores) => {
        setScores({ ...scores, [side]: Number(value) || 0 });
    };

    const getLastDigit = (number: number) => {
        return Math.abs(number) % 10;
    };

    /**
     * Finds the winning cell [col, row] based on score last digits.
     *
     * Grid layout:
     *   - gridData[0] (top row)    = horizontal team's numbers → determines the column
     *   - gridData[r][0] (left col) = vertical team's numbers  → determines the row
     */
    function getResultCell(): [number, number] {
        // Horizontal team's score last digit → find in top row → winning column
        const hDigit = getLastDigit(scores.horizontal);
        const col = gridData[0].indexOf(hDigit);

        // Vertical team's score last digit → find in left column → winning row
        const vDigit = getLastDigit(scores.vertical);
        const row = gridData.findIndex((r) => r[0] === vDigit);

        return [col, row];
    }

    const handleSave = () => {
        const cell = getResultCell();
        onSave({ quarterIndex, scores, cell });
    };

    // Dynamic period labels from the results array
    const periodLabels = results.map((r: any) => r.quarter || 'Final');

    return (
        <StyledDialog
            title="Enter Results"
            titleIcon={<EmojiEventsIcon sx={{ fontSize: 20 }} />}
            closeConfig={{ text: 'Cancel', action: onClose }}
            saveConfig={{
                display: true,
                text: 'Save',
                disabled: !scores,
                action: handleSave,
            }}
            fullWidth
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Quarter toggle chips */}
                <ToggleButtonGroup
                    value={quarterIndex}
                    exclusive
                    onChange={(_, val) => { if (val !== null) setQuarterIndex(val); }}
                    fullWidth
                    sx={{
                        '& .MuiToggleButton-root': {
                            borderRadius: '10px !important',
                            border: '1px solid rgba(59, 130, 246, 0.2) !important',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textTransform: 'none',
                            py: 1,
                            transition: 'all 0.2s ease',
                            '&.Mui-selected': {
                                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: '#fff',
                                borderColor: 'transparent !important',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
                                },
                            },
                        },
                        gap: 1,
                    }}
                >
                    {periodLabels.map((q, i) => (
                        <ToggleButton key={q} value={i}>{q}</ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {/* Score inputs */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        value={scores.horizontal || ''}
                        onChange={(e) => handleChange(e.target.value, 'horizontal')}
                        label={teams.horizontal.name}
                        type="number"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                        InputProps={{
                            inputProps: { min: '0', inputMode: 'numeric' as const },
                        }}
                    />
                    <Typography
                        sx={{
                            textAlign: 'center',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: 'text.secondary',
                            letterSpacing: '0.1em',
                        }}
                    >
                        VS
                    </Typography>
                    <TextField
                        value={scores.vertical || ''}
                        onChange={(e) => handleChange(e.target.value, 'vertical')}
                        label={teams.vertical.name}
                        type="number"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                        InputProps={{
                            inputProps: { min: '0', inputMode: 'numeric' as const },
                        }}
                    />
                </Box>
            </Box>
        </StyledDialog>
    );
}
