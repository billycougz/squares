import { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogContent } from '@mui/material';
import ManageFinanceContent from './ManageFinanceContent';
import AppContext from '../App/AppContext';

export default function FinanceDialog({ onClose, onSave }) {
	const { boardData } = useContext(AppContext);
	const { squarePrice, maxSquares, paymentMethod, payoutSliderValues, adminPaymentLink, financeMessage } = boardData;

	const [financeData, setFinanceData] = useState({
		squarePrice,
		maxSquares,
		paymentMethod,
		payoutSliderValues,
		adminPaymentLink,
		financeMessage,
	});

	const [hasDataChanged, setHasDataChanged] = useState(false);

	const handleDataChange = (updatedFinanceData) => {
		const hasValueChanged =
			updatedFinanceData.adminPaymentLink !== adminPaymentLink ||
			updatedFinanceData.financeMessage !== financeMessage ||
			updatedFinanceData.maxSquares !== maxSquares ||
			updatedFinanceData.squarePrice !== squarePrice ||
			JSON.stringify(updatedFinanceData.payoutSliderValues) !== JSON.stringify(payoutSliderValues);
		setHasDataChanged(hasValueChanged);
		setFinanceData(updatedFinanceData);
	};

	return (
		<Dialog open={true} onClose={onClose} fullWidth>
			<DialogTitle>Square Finances</DialogTitle>
			<DialogContent>
				<ManageFinanceContent financeData={financeData} onDataChange={handleDataChange} />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={() => onSave(financeData)} disabled={!hasDataChanged}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
