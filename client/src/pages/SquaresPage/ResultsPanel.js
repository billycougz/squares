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
			<CustomTable
				initials={initials}
				highlightProperty='Winner'
				headers={[' ', squarePrice && 'Payout', teams.horizontal.code, teams.vertical.code, 'Winner']}
				rows={results.map(({ quarter, scores, winner }, index) => ({
					' ': quarter,
					Winner: winner,
					[teams.horizontal.code]: scores?.horizontal,
					[teams.vertical.code]: scores?.vertical,
					Payout: getPayoutValue(index),
				}))}
			/>
		</CustomAccordion>
	);
}
