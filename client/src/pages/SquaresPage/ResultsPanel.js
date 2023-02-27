import { Alert } from '@mui/material';
import CustomAccordion from '../../components/Accordion';
import CustomTable from '../../components/Table';

export default function ResultsPanel({ boardData, initials, anchor }) {
	const { squarePrice, results, teams, payoutSliderValues } = boardData;

	const getPayoutValue = (quarterIndex) => {
		if (!squarePrice) {
			return null;
		}
		const previousValue = quarterIndex ? payoutSliderValues[quarterIndex - 1] : 0;
		const currentValue = payoutSliderValues[quarterIndex];
		const difference = currentValue - previousValue;
		return `$${squarePrice * difference}`;
	};

	return (
		<CustomAccordion title='Results & Payouts' defaultExpanded={anchor === 'results'}>
			{!squarePrice ? (
				''
			) : (
				<Alert
					variant='outlined'
					severity='warning'
					size='small'
					sx={{ margin: '-1em 0 1em 0', display: { xs: 'flex', sm: 'none' } }}
				>
					Scroll horizontally or flip to landscape to see payout amounts.
				</Alert>
			)}
			<CustomTable
				initials={initials}
				highlightProperty='Winner'
				headers={['Quarter', teams.horizontal.name, teams.vertical.name, 'Winner', squarePrice && 'Amount']}
				rows={results.map(({ quarter, horizontal, vertical, winner }, index) => ({
					Quarter: quarter,
					Winner: winner,
					[teams.horizontal.name]: horizontal,
					[teams.vertical.name]: vertical,
					Amount: getPayoutValue(index),
				}))}
			/>
		</CustomAccordion>
	);
}
