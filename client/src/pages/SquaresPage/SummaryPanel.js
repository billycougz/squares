import { useState } from 'react';
import { Avatar, Box, Card, CardContent, Divider, Grid, IconButton, List, ListItem, TableSortLabel, Typography, useMediaQuery } from '@mui/material';
import { AttachMoney, GridOn, People } from '@mui/icons-material';
import CustomAccordion from '../../components/Accordion';

export default function SummaryPanel({ boardData, initials, squareMap, onRefresh }) {
	const [sortConfig, setSortConfig] = useState({ key: 'player', direction: 'asc' });
	const isMobileWidth = useMediaQuery('(max-width: 600px)');
	const isMobileHeight = useMediaQuery('(max-height: 600px)');
	const isMobile = isMobileWidth || isMobileHeight;
	const { squarePrice } = boardData;
	const remaining = squareMap['_remaining'];

	const handleSort = (key) => {
		setSortConfig((current) => ({
			key,
			direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	const StatBox = ({ label, value, icon, color }) => (
		<Card variant='outlined' sx={{ height: '100%', borderColor: 'rgba(0,0,0,0.08)', borderRadius: 2 }}>
			<CardContent sx={{ p: '16px !important', textAlign: 'center' }}>
				<Box sx={{ color: color, mb: 1, display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
					{icon}
				</Box>
				<Typography variant='h5' fontWeight='700' sx={{ mb: 0.5 }}>
					{value}
				</Typography>
				<Typography variant='caption' color='text.secondary' sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
					{label}
				</Typography>
			</CardContent>
		</Card>
	);

	const sortedPlayers = Object.keys(squareMap)
		.filter((key) => key !== '_remaining')
		.sort((a, b) => {
			if (sortConfig.key === 'player') {
				return sortConfig.direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
			}
			const valA = squareMap[a];
			const valB = squareMap[b];
			return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
		});

	const playerCount = sortedPlayers.length;

	const SortableHeader = ({ label, sortKey, align = 'center' }) => (
		<Grid item xs={squarePrice ? 4 : 6} sx={{ display: 'flex', justifyContent: 'center' }}>
			<TableSortLabel
				active={sortConfig.key === sortKey}
				direction={sortConfig.key === sortKey ? sortConfig.direction : 'asc'}
				onClick={() => handleSort(sortKey)}
			>
				<Typography variant='caption' fontWeight='700' color='text.secondary'>
					{label}
				</Typography>
			</TableSortLabel>
		</Grid>
	);

	return (
		<CustomAccordion title='Summary'>
			<Box sx={{ mb: 3, mt: 2, px: isMobile ? 2 : 0 }}>
				{isMobile && (
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant='h5' fontWeight='700'>
							Summary
						</Typography>
					</Box>
				)}
				<Grid container spacing={2}>
					<Grid item xs={squarePrice ? 4 : 6}>
						<StatBox
							icon={<People fontSize='small' />}
							label='Players'
							value={playerCount}
							color='secondary.main'
						/>
					</Grid>
					<Grid item xs={squarePrice ? 4 : 6}>
						<StatBox
							icon={<GridOn fontSize='small' />}
							label='Remaining'
							value={remaining}
							color='primary.main'
						/>
					</Grid>
					{!!squarePrice && (
						<Grid item xs={4}>
							<StatBox
								icon={<AttachMoney fontSize='small' />}
								label='Price'
								value={`$${squarePrice}`}
								color='success.main'
							/>
						</Grid>
					)}
				</Grid>
			</Box>

			{remaining === 100 ? (
				<Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
					No squares claimed yet.
				</Typography>
			) : (
				<List
					disablePadding
					sx={{
						bgcolor: 'background.paper',
						borderRadius: isMobile ? 0 : 2,
						border: '1px solid rgba(0,0,0,0.06)',
						borderLeft: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
						borderRight: isMobile ? 'none' : '1px solid rgba(0,0,0,0.06)',
					}}
				>
					<ListItem sx={{ bgcolor: 'grey.50', py: 1.5 }}>
						<Grid container alignItems='center'>
							<SortableHeader label='PLAYER' sortKey='player' />
							<SortableHeader label='SQUARES' sortKey='squares' />
							{!!squarePrice && <SortableHeader label='AMOUNT' sortKey='amount' />}
						</Grid>
					</ListItem>
					<Divider />
					{sortedPlayers.map((playerInitials) => {
						const count = squareMap[playerInitials];
						const amount = squarePrice ? count * squarePrice : 0;
						const isUser = playerInitials === initials;

						return (
							<Box key={playerInitials}>
								<ListItem
									sx={{
										bgcolor: isUser ? 'action.selected' : 'inherit',
										transition: 'background-color 0.2s',
									}}
								>
									<Grid container alignItems='center'>
										<Grid item xs={squarePrice ? 4 : 6} sx={{ display: 'flex', justifyContent: 'center' }}>
											<Avatar
												variant='rounded'
												sx={{
													width: 32,
													height: 32,
													fontSize: '0.75rem',
													bgcolor: isUser ? 'primary.main' : 'grey.300',
													fontWeight: 'bold',
													color: isUser ? 'white' : 'grey.700'
												}}
											>
												{playerInitials}
											</Avatar>
										</Grid>
										<Grid item xs={squarePrice ? 4 : 6} sx={{ display: 'flex', justifyContent: 'center' }}>
											<Typography variant='body2' fontWeight='600' sx={{ textAlign: 'center' }}>
												{count}
											</Typography>
										</Grid>
										{!!squarePrice && (
											<Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
												<Typography variant='body2' color='success.main' fontWeight='700' sx={{ textAlign: 'center' }}>
													${amount}
												</Typography>
											</Grid>
										)}
									</Grid>
								</ListItem>
								<Divider component='li' sx={{ '&:last-child': { display: 'none' } }} />
							</Box>
						);
					})}
				</List>
			)}
		</CustomAccordion>
	);
}
