import { Avatar, Chip, DialogContentText } from '@mui/material';
import CustomAccordion from '../../components/Accordion';
import CustomTable from '../../components/Table';

export default function SummaryPanel({ boardData, initials, squareMap }) {
	const { squarePrice } = boardData;
	return (
		<CustomAccordion title='Player Square Summary'>
			<Chip
				sx={{
					margin: '0 1em 1em 0',
				}}
				avatar={
					<Avatar
						sx={{
							width: 'auto',
							borderRadius: 'inherit',
							padding: '0 10px',
							fontWeight: 'bold',
						}}
					>
						{squareMap['_remaining']}
					</Avatar>
				}
				label='Remaining Squares'
			/>
			{!squarePrice ? (
				''
			) : (
				<>
					<Chip
						sx={{
							margin: '0 1em 1em 0',
						}}
						avatar={
							<Avatar
								sx={{
									width: 'auto',
									borderRadius: 'inherit',
									padding: '0 10px',
									fontWeight: 'bold',
								}}
							>
								{`$${squarePrice}`}
							</Avatar>
						}
						label='Square Price'
					/>
					<Chip
						sx={{
							margin: '0 0 1em 0',
						}}
						avatar={
							<Avatar
								sx={{
									width: 'auto',
									borderRadius: 'inherit',
									padding: '0 10px',
									fontWeight: 'bold',
								}}
							>{`$${(100 - squareMap['_remaining']) * squarePrice}`}</Avatar>
						}
						label='Current Pot'
					/>
				</>
			)}

			{squareMap['_remaining'] === 100 ? (
				<DialogContentText sx={{ textAlign: 'center' }}>
					The number of squares each player has claimed will show here.
				</DialogContentText>
			) : (
				<CustomTable
					initials={initials}
					highlightProperty='Initials'
					headers={['Initials', 'Squares', squarePrice && 'Amount']}
					rows={Object.keys(squareMap)
						.sort()
						.filter((key) => key !== '_remaining')
						.map((key) => ({ Initials: key, Squares: squareMap[key], Amount: `$${squareMap[key] * squarePrice}` }))}
				/>
			)}
		</CustomAccordion>
	);
}
