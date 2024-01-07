import { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import ManageFinanceContent from './ManageFinanceContent';
import AppContext from '../App/AppContext';

export default function FinanceDialog({ onClose, onSave }) {
	const { boardData } = useContext(AppContext);

	const [financeData, setFinanceData] = useState({
		maxSquares: boardData.maxSquares,
		squarePrice: boardData.squarePrice,
		payoutSliderValues: boardData.payoutSliderValues,
	});

	const [hasDataChanged, setHasDataChanged] = useState(false);

	const handleDataChange = (updatedFinanceData) => {
		const hasValueChanged =
			updatedFinanceData.maxSquares !== boardData.maxSquares ||
			updatedFinanceData.squarePrice !== boardData.squarePrice ||
			JSON.stringify(updatedFinanceData.payoutSliderValues) !== JSON.stringify(boardData.payoutSliderValues);
		setHasDataChanged(hasValueChanged);
		setFinanceData(updatedFinanceData);
	};

	return (
		<Dialog open={true} onClose={onClose} fullWidth>
			<DialogTitle>Square Finances</DialogTitle>
			<ManageFinanceContent financeData={financeData} onDataChange={handleDataChange} />
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={() => onSave(financeData)} disabled={!hasDataChanged}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
