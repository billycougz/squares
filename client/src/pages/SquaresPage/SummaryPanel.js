import { Avatar, Chip } from '@mui/material';
import CustomAccordion from '../../components/Accordion';
import CustomTable from '../../components/Table';

export default function SummaryPanel({ boardData, initials, squareMap }) {
	const { squarePrice } = boardData;
	return (
		<CustomAccordion title='Square Summary'>
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

			<CustomTable
				initials={initials}
				highlightProperty='Initials'
				headers={['Initials', 'Squares', squarePrice && 'Owed']}
				rows={Object.keys(squareMap)
					.sort()
					.filter((key) => key !== '_remaining')
					.map((key) => ({ Initials: key, Squares: squareMap[key], Owed: `$${squareMap[key] * squarePrice}` }))}
			/>
		</CustomAccordion>
	);
}
