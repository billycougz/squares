'use client';
import { Avatar, Box, Card, CardContent, Chip, Divider, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { EmojiEvents, AttachMoney, SportsScore } from '@mui/icons-material';

export default function ResultsPanel({ boardData, initials, anchor, onRefresh }) {
	const { squarePrice, results, teams, payoutSliderValues, retainAmount = 0 } = boardData;
	const theme = useTheme();
	const isMobileWidth = useMediaQuery('(max-width: 600px)');
	const isMobileHeight = useMediaQuery('(max-height: 600px)');
	const isMobile = isMobileWidth || isMobileHeight;

	const getPayoutValue = (periodIndex) => {
		if (!squarePrice) {
			return null;
		}
		const previousValue = periodIndex ? payoutSliderValues[periodIndex - 1] : 0;
		const currentValue = payoutSliderValues[periodIndex];
		const periodPercent = currentValue - previousValue;
		return (periodPercent * (squarePrice - retainAmount / 100));
	};

	const ResultCard = ({ result, index }) => {
		const { quarter, scores, winner } = result;
		const payout = getPayoutValue(index);
		const isFinal = quarter === 'Q4' || quarter === 'Final';
		const displayPeriod = isFinal ? 'FINAL' : quarter.replace('Q', '').replace('H', '');
		const periodTypeLabel = quarter.startsWith('H') ? 'HALF' : quarter.startsWith('Q') ? 'QTR' : '';
		const isWinner = winner === initials;

		return (
			<Box sx={{ position: 'relative' }}>
				<Card
					variant='outlined'
					sx={{
						borderColor: isWinner ? 'primary.main' : 'rgba(0,0,0,0.08)',
						borderWidth: isWinner ? 2 : 1,
						borderRadius: 3,
						overflow: 'hidden',
						bgcolor: isWinner ? 'primary.main' : 'white',
						boxShadow: isWinner ? '0 8px 24px rgba(24, 118, 209, 0.15)' : 'none',
						transition: 'transform 0.2s',
					}}
				>
					<Box sx={{ display: 'flex', minHeight: 100 }}>
						{/* Left Strip - Period */}
						<Box
							sx={{
								width: 90,
								minWidth: 90,
								bgcolor: isWinner ? 'primary.main' : '#f4f6f8',
								color: isWinner ? 'primary.contrastText' : 'text.secondary',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								borderRight: '1px solid',
								borderColor: isWinner ? 'primary.main' : 'divider',
							}}
						>
							<Typography variant='caption' fontWeight='700' sx={{ opacity: 0.8, letterSpacing: 1.5, mb: -0.5 }}>
								{isFinal ? '' : periodTypeLabel}
							</Typography>
							<Typography
								variant='h3'
								fontWeight='800'
								sx={isFinal ? { fontSize: '1.1rem', letterSpacing: '1.5px' } : {}}
							>
								{displayPeriod}
							</Typography>
						</Box>

						{/* Right Content */}
						<Box sx={{ flex: 1, p: 2, display: 'flex', alignItems: 'center', bgcolor: 'white' }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, width: '100%' }}>
								{/* Scores */}
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
											<Typography variant='body2' fontWeight='600' color='text.secondary'>
												{teams.horizontal.code}
											</Typography>
											<Typography variant='h6' fontWeight='700' sx={{ lineHeight: 1 }}>
												{scores?.horizontal ?? '-'}
											</Typography>
										</Box>
										<Divider sx={{ borderStyle: 'dashed' }} />
										<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
											<Typography variant='body2' fontWeight='600' color='text.secondary'>
												{teams.vertical.code}
											</Typography>
											<Typography variant='h6' fontWeight='700' sx={{ lineHeight: 1 }}>
												{scores?.vertical ?? '-'}
											</Typography>
										</Box>
									</Box>
								</Box>
								{/* Winner & Payout */}
								<Box sx={{ textAlign: 'right', flexShrink: 0 }}>
									<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 0.5,
												color: winner ? 'secondary.main' : 'text.disabled',
											}}
										>
											{winner && <EmojiEvents fontSize='small' />}
											<Typography variant='body2' fontWeight='700' sx={{ textTransform: 'uppercase' }}>
												{winner || 'TBD'}
											</Typography>
										</Box>
										{squarePrice && (
											<Chip
												icon={<AttachMoney sx={{ '&&': { fontSize: 16 } }} />}
												label={payout ? `$${payout}` : '$0'}
												size='small'
												color='success'
												variant={winner ? 'filled' : 'outlined'}
												sx={{
													fontWeight: '800',
													height: 24,
													bgcolor: winner ? 'success.main' : 'transparent',
													color: winner ? 'white' : 'success.main',
													borderColor: 'success.main',
												}}
											/>
										)}
									</Box>
								</Box>
							</Box>
						</Box>
					</Box>
				</Card>
				{isWinner && (
					<Chip
						label='YOU WON!'
						color='primary'
						size='small'
						sx={{
							position: 'absolute',
							top: -12,
							right: 16,
							fontWeight: 'bold',
							height: 24,
							border: '2px solid white',
							boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
						}}
					/>
				)}
			</Box>
		);
	};

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					mt: isMobile ? 2 : 0,
					px: isMobile ? 2 : 0,
					py: isMobile ? 2 : 0,
				}}
			>

				{results.map((result, index) => (
					<ResultCard key={result.quarter} result={result} index={index} />
				))}
				{results.length === 0 && (
					<Typography color='text.secondary' textAlign='center' py={4}>
						No results yet.
					</Typography>
				)}
			</Box>
		</Box>
	);
}
