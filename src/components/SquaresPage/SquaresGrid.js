'use client';
import { Typography, useTheme, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert } from '@mui/material';
import { updateBoard } from '@/lib/api';
import Square from '@/components/Square';
import { useContext, useRef, useState, useEffect } from 'react';
import AppContext from '@/contexts/AppContext';

export default function SquaresGrid({ initials, setSnackbarMessage, onUpdate, highlightColor, clickMode, sx = [] }) {
	const theme = useTheme();
	const { boardData, boardInsights } = useContext(AppContext);
	const [scale, setScale] = useState(1);
	const containerRef = useRef(null);
	const contentRef = useRef(null);

	const { id, gridData, boardName, squarePrice, maxSquares, teams, results } = boardData;

	const handleSquareClick = async ([row, col]) => {
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

	const getCellColor = (row, col) => {
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
			const availableHeight = window.innerHeight - 20;
			// Use 99% of the container width to maximize size (user requested)
			const availableWidth = container.clientWidth * 0.99;

			if (availableWidth <= 0 || availableHeight <= 0) return;

			const contentWidth = (numCols + 1) * squareSize;
			const contentHeight = (numRows + 1) * squareSize;

			const scaleX = availableWidth / contentWidth;
			const scaleY = availableHeight / contentHeight;

			const newScale = Math.min(scaleX, scaleY, 1);
			setScale(newScale);
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
					height: 'calc(100vh - 120px)', // Fixed height for centering in portrait
					overflow: 'hidden',
					p: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',    // Center horizontally
					justifyContent: 'center', // Center vertically
					position: 'relative',
					transition: 'all 0.3s ease-in-out'
				},
				...(Array.isArray(sx) ? sx : [sx])
			]}
		>
			<Box
				sx={{
					width: ((numCols + 1) * squareSize) * scale,
					height: ((numRows + 1) * squareSize) * scale,
					mt: 2, // Standard margin top
					'@media (orientation: landscape)': {
						mt: 0, // No margin in landscape to save vertical space
					},
					// No display: flex here, acts as a bounding box
					position: 'relative', // Ensure it holds layout space
					// overflow: 'hidden' // Optional: clips if calculation is slightly off, but safer to leave visible for debugging
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
						transform: `scale(${scale})`,
						transformOrigin: '0 0', // Top Left to match the wrapper's flow
						transition: 'transform 0.3s ease-in-out',
						// Force the content to its natural size so scale works correctly
						width: (numCols + 1) * squareSize
					}}
				>
					{/* Header Row for Horizontal Team */}
					<Grid container item wrap="nowrap">
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

					<Grid container item wrap="nowrap">
						{/* Vertical Team Label Column */}
						<Grid item sx={{ display: 'flex', flexDirection: 'column' }}>
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
						</Grid>

						{/* The Grid Itself */}
						<Box sx={{ flexGrow: 1 }}>
							{gridData.map((values, rowIndex) => (
								<Grid container item key={rowIndex} wrap="nowrap">
									{values.map((value, colIndex) => (
										<Square
											key={`${rowIndex}-${colIndex}`}
											value={value}
											location={[rowIndex, colIndex]}
											backgroundColor={getCellColor(rowIndex, colIndex)}
											resultQuarters={resultMap[rowIndex]?.[colIndex]?.join(', ')}
											onClick={handleSquareClick}
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

			<Alert
				variant='outlined'
				severity='info'
				sx={{
					marginTop: 2,
					display: { xs: 'flex', sm: 'none' },
					'@media only screen and (orientation: landscape)': {
						display: 'none',
					},
					fontSize: '0.85rem'
				}}
			>
				Flip your phone to landscape for a larger view.
			</Alert>
		</Box>
	);
}

function getResultCellMap(results) {
	return results.reduce((map, result) => {
		const { row, col, quarter } = result;
		if (result.row) {
			map[row] = map[row] || {};
			map[row][col] = map[row][col] || [];
			map[row][col].push(quarter);
		}
		return map;
	}, {});
}
