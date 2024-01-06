import { useState } from 'react';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import CustomAccordion from '../../components/Accordion';
import FinanceDialog from '../../components/FinanceDialog';
import { updateBoard } from '../../api';
import ResultsDialog from '../../components/ResultsDialog';
import AdminMessageDialog from '../../components/AdminMessageDialog';

export default function AdminPanel({ boardData, setSnackbarMessage, onUpdate }) {
	const { id, gridData, boardName, userCode, isAdmin, teams, results } = boardData;
	const [activeDialog, setActiveDialog] = useState('');

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?id=${id}`;
		navigator.clipboard.writeText(encodeURI(link));
		setSnackbarMessage('Share link copied to clipboard.');
	};

	const setNumbers = async () => {
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

	const areNumbersSet = gridData[0].some((value) => value);

	return (
		<CustomAccordion title='Admin Controls'>
			<FormControl>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: '-1em' }}>
					<Button size='small' variant='contained' onClick={() => setActiveDialog('finance')} fullWidth>
						<EditIcon sx={{ pr: 1 }} fontSize='small' />
						Finances
					</Button>
					{activeDialog === 'finance' && (
						<FinanceDialog onSave={handleFinanceSave} onClose={() => setActiveDialog('')} boardData={boardData} />
					)}
					<Button size='small' variant='contained' onClick={() => setActiveDialog('results')} fullWidth>
						<EditIcon sx={{ pr: 1 }} fontSize='small' />
						Results
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
					<Button variant='contained' size='small' onClick={handleCopyShareLink} fullWidth>
						<IosShareIcon sx={{ pr: 1 }} fontSize='small' />
						Share
					</Button>
					{!areNumbersSet && (
						<Button variant='contained' size='small' onClick={setNumbers} fullWidth>
							<BorderStyleIcon sx={{ pr: 1 }} fontSize='small' />
							Set Numbers
						</Button>
					)}
				</Box>
			</FormControl>
		</CustomAccordion>
	);
}
