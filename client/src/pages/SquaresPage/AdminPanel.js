import { useContext, useState } from 'react';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import CustomAccordion from '../../components/Accordion';
import FinanceDialog from '../../components/FinanceDialog';
import { updateBoard } from '../../api';
import ResultsDialog from '../../components/ResultsDialog';
import AdminIntroDialog from '../../components/AdminIntroDialog';
import AppContext from '../../App/AppContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function AdminPanel({ setSnackbarMessage, onUpdate }) {
	const { boardData, boardInsights } = useContext(AppContext);
	const { id, gridData, boardName, userCode, isAdmin, teams, results } = boardData;
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
		const doContinue = window.confirm('Set the numbers? This can only be done once.');
		if (doContinue) {
			const { Item } = await updateBoard({ id, boardName, operation: 'numbers' });
			onUpdate({ ...Item, isAdmin });
		}
	};

	const handleFinanceSave = async (value) => {
		const { Item } = await updateBoard({ id, boardName, operation: 'finances', value });
		onUpdate({ ...Item, isAdmin });
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
		onUpdate({ ...Item, isAdmin });
		setActiveDialog('');
	};

	return (
		<CustomAccordion title='Admin Controls'>
			<FormControl>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: '-1em' }}>
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

					{/* ToDo 12/30/23 - <Button size='small' variant='contained' onClick={() => setActiveDialog('admin-message')}>
						<EditIcon sx={{ pr: 1 }} fontSize='small' />
						Admin Message
					</Button>
					{activeDialog === 'admin-message' && (
						<AdminMessageDialog
							results={results}
							teams={teams}
							gridData={gridData}
							onSave={null}
							onClose={() => setActiveDialog('')}
						/>
					)} */}
					<Button variant='contained' size='small' onClick={handleCopyShareLink} fullWidth startIcon={<IosShareIcon />}>
						Copy link for participants
					</Button>
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
