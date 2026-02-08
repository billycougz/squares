import { Avatar, Box, Card, CardContent, Chip, Divider, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { EmojiEvents, AttachMoney, SportsScore } from '@mui/icons-material';
import CustomAccordion from '../../components/Accordion';

export default function ResultsPanel({ boardData, initials, anchor, onRefresh }) {
	const { squarePrice, results, teams, payoutSliderValues, retainAmount = 0 } = boardData;
	const theme = useTheme();
	const isMobileWidth = useMediaQuery('(max-width: 600px)');
	const isMobileHeight = useMediaQuery('(max-height: 600px)');
	const isMobile = isMobileWidth || isMobileHeight;

	const getPayoutValue = (quarterIndex) => {
		if (!squarePrice) {
			return null;
		}
		const previousValue = quarterIndex ? payoutSliderValues[quarterIndex - 1] : 0;
		const currentValue = payoutSliderValues[quarterIndex];
		const difference = currentValue - previousValue;
		return (difference * (squarePrice - retainAmount / 100));
	};

	const ResultCard = ({ result, index }) => {
		const { quarter, scores, winner } = result;
		const payout = getPayoutValue(index);
		const quarterLabel = quarter === 'Q4' ? 'FINAL' : quarter;
		const displayQuarter = quarter === 'Q4' ? 'FINAL' : quarter.replace('Q', '');
		const isFinal = displayQuarter.toLowerCase() === 'final';
		const isWinner = winner === initials;

		return (
			<Card
				variant='outlined'
				sx={{
					borderColor: isWinner ? 'primary.main' : 'rgba(0,0,0,0.08)',
					borderWidth: isWinner ? 2 : 1,
					borderRadius: 3,
					position: 'relative',
					overflow: 'visible',
					bgcolor: 'white',
					boxShadow: isWinner ? '0 8px 24px rgba(24, 118, 209, 0.15)' : 'none',
					transition: 'transform 0.2s',
				}}
			>
				<Box sx={{ display: 'flex', minHeight: 100 }}>
					{/* Left Strip - Quarter */}
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
							borderTopLeftRadius: 12,
							borderBottomLeftRadius: 12,
						}}
					>
						<Typography variant='caption' fontWeight='700' sx={{ opacity: 0.8, letterSpacing: 1.5, mb: -0.5 }}>
							QTR
						</Typography>
						<Typography
							variant='h3'
							fontWeight='800'
							sx={isFinal ? { fontSize: '2rem' } : {}}
						>
							{displayQuarter}
						</Typography>
					</Box>

					{/* Right Content */}
					<Box sx={{ flex: 1, p: 2, display: 'flex', alignItems: 'center' }}>
						<Grid container spacing={2} alignItems='center'>
							{/* Scores */}
							<Grid item xs={7}>
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
							</Grid>
							{/* Winner & Payout */}
							<Grid item xs={5} sx={{ textAlign: 'right' }}>
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
							</Grid>
						</Grid>
					</Box>
				</Box>

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
			</Card>
		);
	};

	return (
		<CustomAccordion title='Results & Payouts' defaultExpanded={anchor === 'results'}>
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
				{isMobile && (
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography variant='h5' fontWeight='700'>
							Results
						</Typography>
					</Box>
				)}
				{results.map((result, index) => (
					<ResultCard key={result.quarter} result={result} index={index} />
				))}
				{results.length === 0 && (
					<Typography color='text.secondary' textAlign='center' py={4}>
						No results yet.
					</Typography>
				)}
			</Box>
		</CustomAccordion>
	);
}
