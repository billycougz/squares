import { useContext, useState } from 'react';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, DialogContentText, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import CustomAccordion from '../../components/Accordion';
import FinanceDialog from '../../components/FinanceDialog';
import { updateBoard } from '../../api';
import ResultsDialog from '../../components/ResultsDialog';
import AppContext from '../../App/AppContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAppServices } from '../../App/AppServices';
import InfoIcon from '@mui/icons-material/Info';
import ManagePaymentInfoContent from '../../components/ManagePaymentInfoContent';
import ManagePaymentDialog from '../../components/ManagePaymentDialog';

export default function AdminPanel({ setSnackbarMessage, setView }) {
	const { boardData, boardInsights, setBoardData } = useContext(AppContext);
	const { setIsLoading, setDialog } = useAppServices();
	const { id, gridData, boardName, teams, results } = boardData;

	const [activeDialog, setActiveDialog] = useState('');

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?id=${id}`;
		navigator.clipboard.writeText(encodeURI(link));
		setSnackbarMessage('Participant link copied to clipboard.');
	};

	const handleSetNumbersClick = async () => {
		if (boardInsights.remainingSquares) {
			setSnackbarMessage('The numbers cannot be set until all squares have been claimed.');
			return;
		}
		const handleContinue = async () => {
			setDialog(null);
			setIsLoading(true);
			const { Item } = await updateBoard({ id, boardName, operation: 'numbers' });
			setBoardData(Item);
			setView('board');
			setIsLoading(false);
		};
		setDialog({
			title: 'Set Board Numbers',
			children: <DialogContentText>The numbers will be randomly set. This can't be undone.</DialogContentText>,
			closeConfig: { text: 'Cancel', action: () => setDialog(null) },
			saveConfig: { display: true, text: 'Confirm', action: handleContinue },
		});
	};

	const handleFinanceSave = async (value) => {
		const { Item } = await updateBoard({ id, boardName, operation: 'finances', value });
		setBoardData(Item);
		setActiveDialog('');
	};

	const handleEnterResultsClick = () => {
		if (boardInsights.remainingSquares) {
			setSnackbarMessage('Results cannot be entered until all squares have been claimed.');
			return;
		}
		if (!boardInsights.areNumbersSet) {
			setSnackbarMessage('Results cannot be entered until the numbers have been set.');
			return;
		}
		setActiveDialog('results');
	};

	const handleSubmitResult = async ({ quarterIndex, scores, cell }) => {
		const [col, row] = cell;
		const { Item } = await updateBoard({
			id,
			scores,
			boardName,
			row,
			col,
			operation: 'result',
			value: Number(quarterIndex),
		});
		setBoardData(Item);
		setView('results');
		setActiveDialog('');
	};

	return (
		<CustomAccordion title='Admin Controls'>
			<FormControl>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: '-1em' }}>
					<Button variant='contained' size='small' onClick={handleCopyShareLink} fullWidth startIcon={<IosShareIcon />}>
						Copy link for participants
					</Button>

					<Button
						size='small'
						variant='contained'
						onClick={() => setActiveDialog('finance')}
						fullWidth
						startIcon={<AttachMoneyIcon />}
					>
						Manage Finances
					</Button>
					{activeDialog === 'finance' && (
						<FinanceDialog onSave={handleFinanceSave} onClose={() => setActiveDialog('')} boardData={boardData} />
					)}

					<Button
						size='small'
						variant='contained'
						onClick={() => setActiveDialog('paymentInfo')}
						fullWidth
						startIcon={<InfoIcon />}
					>
						Manage Payment Info
					</Button>

					{activeDialog === 'paymentInfo' && <ManagePaymentDialog onClose={() => setActiveDialog('')} />}

					{!boardInsights.areNumbersSet && (
						<Button
							variant='contained'
							size='small'
							onClick={handleSetNumbersClick}
							fullWidth
							startIcon={<BorderStyleIcon />}
						>
							Set Numbers
						</Button>
					)}

					<Button size='small' variant='contained' onClick={handleEnterResultsClick} fullWidth startIcon={<EditIcon />}>
						Enter Results
					</Button>
					{activeDialog === 'results' && (
						<ResultsDialog
							results={results}
							teams={teams}
							gridData={gridData}
							onSave={handleSubmitResult}
							onClose={() => setActiveDialog('')}
						/>
					)}
				</Box>
			</FormControl>
		</CustomAccordion>
	);
}
