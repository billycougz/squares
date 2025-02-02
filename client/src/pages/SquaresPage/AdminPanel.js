import { useContext, useState } from 'react';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, DialogContentText, Divider, FormControl, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import CustomAccordion from '../../components/Accordion';
import FinanceDialog from '../../components/FinanceDialog';
import { updateBoard } from '../../api';
import ResultsDialog from '../../components/ResultsDialog';
import AppContext from '../../App/AppContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAppServices } from '../../App/AppServices';
import InfoIcon from '@mui/icons-material/Info';
import ManagePaymentDialog from '../../components/ManagePaymentDialog';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function AdminPanel({ setSnackbarMessage, setView }) {
	const { boardData, boardInsights, setBoardData } = useContext(AppContext);
	const { setIsLoading, setDialog } = useAppServices();
	const { id, gridData, boardName, teams, results } = boardData;

	const [activeDialog, setActiveDialog] = useState('');

	const handleCopyLink = (name) => {
		const { origin } = document.location;
		let link = encodeURI(`${origin}/?id=${id}`);
		if (name === 'admin') {
			link += `&adminCode=${boardData.adminCode}`;
			navigator.clipboard.writeText(link);
			setSnackbarMessage('Administration link copied. This link enables access to the admin controls.');
		} else {
			const msg = `Join my Squares pool!\n\n${link}`;
			navigator.clipboard.writeText(msg);
			setSnackbarMessage("Invitation message copied. Send this message to any many people as you'd like.");
		}
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
					<Typography>
						<ContentCopyIcon fontSize='small' /> Board Access
					</Typography>
					<Button
						variant='contained'
						size='small'
						onClick={() => handleCopyLink('share')}
						fullWidth
						startIcon={<IosShareIcon />}
					>
						Invite participants
					</Button>

					<Button
						variant='contained'
						size='small'
						onClick={() => handleCopyLink('admin')}
						fullWidth
						startIcon={<AdminPanelSettingsIcon />}
					>
						Copy administration link
					</Button>

					<Typography sx={{ mt: '10px' }}>
						<SettingsIcon fontSize='small' /> Board Settings
					</Typography>

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

					<Typography sx={{ mt: '10px' }}>
						<AddTaskIcon fontSize='small' /> Board Actions
					</Typography>

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
