import { useState } from 'react';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import CustomAccordion from '../../components/Accordion';
import FinanceDialog from '../../components/FinanceDialog';
import { updateBoard } from '../../api';

export default function AdminPanel({ boardData, setSnackbarMessage, onUpdate }) {
	const { gridData, boardName, userCode, isAdmin } = boardData;
	const [isFinanceDialogOpen, setIsFinanceDialogOpen] = useState(false);

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?boardName=${boardName}&userCode=${userCode}`;
		navigator.clipboard.writeText(encodeURI(link));
		setSnackbarMessage('Share link copied to clipboard.');
	};

	const setNumbers = async () => {
		const doContinue = window.confirm('Set the numbers? This can only be done once.');
		if (doContinue) {
			const { Item } = await updateBoard({ boardName, operation: 'numbers' });
			onUpdate({ ...Item, isAdmin });
		}
	};

	const handleFinanceSave = async (value) => {
		const { Item } = await updateBoard({ boardName, operation: 'finances', value });
		onUpdate({ ...Item, isAdmin });
		setIsFinanceDialogOpen(false);
	};

	const areNumbersSet = gridData[0].some((value) => value);

	return (
		<CustomAccordion title='Admin Controls'>
			<FormControl>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: '-1em' }}>
					<Button size='small' variant='contained' onClick={() => setIsFinanceDialogOpen(true)}>
						<EditIcon sx={{ pr: 1 }} fontSize='small' />
						Edit Finances
					</Button>
					{isFinanceDialogOpen && (
						<FinanceDialog
							open={isFinanceDialogOpen}
							onSave={handleFinanceSave}
							onClose={() => setIsFinanceDialogOpen(false)}
							boardData={boardData}
						/>
					)}
					<Button variant='contained' size='small' onClick={handleCopyShareLink}>
						<IosShareIcon sx={{ pr: 1 }} fontSize='small' />
						Share
					</Button>
					{!areNumbersSet && (
						<Button variant='contained' size='small' onClick={setNumbers}>
							<BorderStyleIcon sx={{ pr: 1 }} fontSize='small' />
							Set Numbers
						</Button>
					)}
				</Box>
			</FormControl>
		</CustomAccordion>
	);
}
