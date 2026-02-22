'use client';
import { Typography, useTheme, Paper, Alert, SxProps, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { updateBoard } from '@/lib/api';
import Square from '@/components/Square';
import { useContext, useRef, useState, useEffect } from 'react';
import AppContext from '@/contexts/AppContext';

interface Team {
    name: string;
    color: string;
}

interface Result {
    row: number;
    col: number;
    quarter: string;
}

interface BoardData {
    id: string;
    gridData: (string | null)[][];
    boardName: string;
    squarePrice: number;
    maxSquares: number;
    teams: {
        vertical: Team;
        horizontal: Team;
    };
    results: Result[];
}

interface BoardInsights {
    remainingSquares: number;
    areNumbersSet: boolean;
    getClaimCount: (initials: string) => number;
}

interface AppContextType {
    boardData: BoardData;
    boardInsights: BoardInsights;
}

interface SquaresGridProps {
    initials: string;
    setSnackbarMessage: (message: string) => void;
    onUpdate: (board: BoardData) => void;
    highlightColor: string;
    clickMode: 'select' | 'remove' | 'result' | 'numbers' | 'finances' | 'update';
    sx?: SxProps<Theme>;
}

export default function SquaresGrid({ initials, setSnackbarMessage, onUpdate, highlightColor, clickMode, sx = [] }: SquaresGridProps) {
    const theme = useTheme();
    const { boardData, boardInsights } = useContext(AppContext) as AppContextType;
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const { id, gridData, boardName, squarePrice, maxSquares, teams, results } = boardData;

    const handleSquareClick = async ([row, col]: [number, number]) => {
        if (!row || !col) {
            // Numbers row or column
            return;
        }
        if (clickMode === 'select' && gridData[row][col]) {
            // Already selected square
            return;
        }
        if (clickMode === 'select' && !initials) {
            setSnackbarMessage('Please enter your initials before selecting a square.');
            return;
        }
        const currentInitialsCount = boardInsights.getClaimCount(initials);
        if (clickMode === 'select' && maxSquares && currentInitialsCount === maxSquares) {
            setSnackbarMessage("You've reached the square limit.");
            return;
        }
        const value = clickMode === 'remove' ? null : initials;
        const { Item } = await updateBoard({ id, boardName, row, col, operation: clickMode, value });
        if (clickMode === 'remove') {
            setSnackbarMessage('Square removed.');
        }
        if (clickMode === 'select') {
            if (Item.gridData[row][col] !== initials) {
                setSnackbarMessage('This square was taken by another player.');
            } else {
                const personalTotal = currentInitialsCount + 1;
                const financeMsg = squarePrice ? ` and owe $${personalTotal * squarePrice}` : '';
                setSnackbarMessage(`You now have ${personalTotal} squares${financeMsg}.`);
            }
        }
        onUpdate({ ...Item });
    };

    const getCellColor = (row: number, col: number) => {
        const { vertical, horizontal } = teams;
        if (!row && col) {
            return vertical.color;
        } else if (!col && row) {
            return horizontal.color;
        }
        if (resultMap[row]?.[col]) {
            return theme.palette.success.light;
        }
        if (gridData[row][col] === initials) {
            return highlightColor;
        }
        return '';
    };

    const resultMap = getResultCellMap(results);

    const squareSize = 48;
    const numCols = gridData[0].length;
    const numRows = gridData.length;

    // Calculate offsets - if > 11, assumes we have numbers row/col overlaid
    const colOffset = numCols > 11 ? 2 : 1;
    const rowOffset = numRows > 11 ? 2 : 1;

    const horizontalHeaderWidth = (numCols - colOffset) * squareSize;
    const verticalHeaderHeight = (numRows - rowOffset) * squareSize;

    useEffect(() => {
        if (!containerRef.current) {
            setScale(1);
            return;
        }

        const calculateScale = () => {
            const container = containerRef.current;
            if (!container) return;

            // Use slightly less vertical buffer to maximize space
            const availableHeight = container.clientHeight - 20;
            // Use 99% of the container width to maximize size 
            const availableWidth = container.clientWidth * 0.99;

            if (availableWidth <= 0 || availableHeight <= 0) return;

            const contentWidth = (numCols + 1) * squareSize;
            const contentHeight = (numRows + 1) * squareSize;

            const scaleX = availableWidth / contentWidth;
            const scaleY = availableHeight / contentHeight;

            let newScale = Math.min(scaleX, scaleY, 1);
            // Round to avoid sub-pixel loops and unnecessary re-renders
            newScale = Math.floor(newScale * 1000) / 1000;
            if (Math.abs(newScale - scale) > 0.001) {
                setScale(newScale);
            }
        };

        // Initial calculation
        calculateScale();

        // Robust ResizeObserver handled updates
        const observer = new ResizeObserver(() => {
            calculateScale();
        });

        observer.observe(containerRef.current);
        // Also listen to window resize to handle height changes (which might not affect container width immediately)
        window.addEventListener('resize', calculateScale);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateScale);
        };

    }, [gridData, numCols, numRows, squareSize]);

    return (
        <Box
            ref={containerRef}
            sx={[
                {
                    width: '100%',
                    height: '100%', // Flexible height relative to container
                    overflow: 'hidden',
                    p: 0,
                    position: 'relative',
                },
                ...(Array.isArray(sx) ? sx : [sx])
            ]}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: (numCols + 1) * squareSize,
                    height: (numRows + 1) * squareSize,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease-in-out',
                }}
            >
                <Grid
                    container
                    wrap="nowrap"
                    direction="column"
                    ref={contentRef}
                    sx={{
                        minWidth: 'min-content',
                        m: 0,
                        // transform: `scale(${scale})`, // Moved to parent transform for stability
                        // transformOrigin: '0 0', 
                        // transition: 'transform 0.3s ease-in-out',
                        // Force the content to its natural size
                        width: (numCols + 1) * squareSize
                    }}
                >
                    {/* Header Row for Horizontal Team */}
                    <Grid container wrap="nowrap">
                        {/* Empty Corner - accounts for V-Col + Grid Offset */}
                        <Box sx={{ width: squareSize * (colOffset + 1), flexShrink: 0 }} />

                        {/* Horizontal Team Label */}
                        <Box
                            component={Paper}
                            elevation={3}
                            sx={{
                                background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%), ${teams.horizontal.color}`,
                                color: 'white',
                                width: horizontalHeaderWidth,
                                minWidth: horizontalHeaderWidth,
                                height: squareSize, // Match vertical header width
                                borderRadius: '8px 8px 0 0',
                                // py: 1.5, // Remove fixed padding to let centering work with fixed height
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 0, // Removed margin to attach to grid
                                borderBottom: '1px solid rgba(255,255,255,0.2)' // Subtle separator
                            }}
                        >
                            <Typography
                                variant='h6'
                                sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: '3px', // Increased spacing
                                    lineHeight: 1,
                                    fontWeight: 800, // Blacker font
                                    fontSize: { xs: '0.9rem', sm: '1.25rem' },
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    px: 2,
                                    textShadow: '0px 2px 4px rgba(0,0,0,0.3)' // Text shadow for pop
                                }}
                            >
                                {teams.horizontal.name}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid container wrap="nowrap">
                        {/* Vertical Team Label Column */}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {/* Spacer for top numbers row */}
                            <Box sx={{ height: squareSize * rowOffset, width: squareSize }} />

                            <Box
                                component={Paper}
                                elevation={3}
                                sx={{
                                    display: 'flex',
                                    background: `linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%), ${teams.vertical.color}`,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: verticalHeaderHeight,
                                    minHeight: verticalHeaderHeight,
                                    width: squareSize,
                                    borderRadius: '8px 0 0 8px',
                                    mr: 0, // Removed margin to attach to grid
                                    borderRight: '1px solid rgba(255,255,255,0.2)' // Subtle separator
                                    // If we have 2 columns offset, we want the bar to be on the left
                                    // but we might want it to fill the extra space?
                                    // Actually, standard design: Team Name Bar is 1 unit wide.
                                    // If offset is 2, the second unit is the numbers column (rendered in the grid).
                                    // So we just need enough spacer above.
                                }}
                            >
                                <Box
                                    sx={{
                                        py: 2,
                                        textAlign: 'center',
                                        textTransform: 'capitalize',
                                        color: 'white',
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                    }}
                                >
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            fontWeight: 800, // Blacker font
                                            fontSize: { xs: '0.9rem', sm: '1.25rem' },
                                            letterSpacing: '3px', // Increased spacing
                                            whiteSpace: 'nowrap',
                                            textShadow: '0px 2px 4px rgba(0,0,0,0.3)' // Text shadow for pop
                                        }}
                                    >
                                        {teams.vertical.name}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* The Grid Itself */}
                        <Box sx={{ flexGrow: 1 }}>
                            {gridData.map((values, rowIndex) => (
                                <Grid container key={rowIndex} wrap="nowrap">
                                    {values.map((value, colIndex) => (
                                        <Square
                                            key={`${rowIndex}-${colIndex}`}
                                            value={value}
                                            location={[rowIndex, colIndex]}
                                            backgroundColor={getCellColor(rowIndex, colIndex)}
                                            resultQuarters={resultMap[rowIndex]?.[colIndex]?.join(', ')}
                                            onClick={() => handleSquareClick([rowIndex, colIndex])}
                                            adminMode={clickMode}
                                            isHeader={!rowIndex || !colIndex}
                                        />
                                    ))}
                                </Grid>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

function getResultCellMap(results: Result[]) {
    return results.reduce((map: Record<number, Record<number, string[]>>, result) => {
        const { row, col, quarter } = result;
        if (result.row !== undefined && result.row !== null) {
            map[row] = map[row] || {};
            map[row][col] = map[row][col] || [];
            map[row][col].push(quarter);
        }
        return map;
    }, {});
}
