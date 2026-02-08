import { useContext, useState } from 'react';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, DialogContentText, Divider, Grid, Typography, useMediaQuery } from '@mui/material';
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
import LinkIcon from '@mui/icons-material/Link';

export default function AdminPanel({ setSnackbarMessage, setView }) {
	const { boardData, boardInsights, setBoardData } = useContext(AppContext);
	const { setIsLoading, setDialog } = useAppServices();
	const {
		id,
		gridData,
		boardName,
		teams,
		results,
		squarePrice,
		maxSquares,
		payoutSliderValues,
		retainAmount,
		reversePercent,
	} = boardData;

	const [activeDialog, setActiveDialog] = useState('');



	const handleCopyLink = (name) => {
		const { origin } = document.location;
		let link = encodeURI(`${origin}/?id=${id}`);
		if (name === 'admin') {
			link += `&adminCode=${boardData.adminCode}`;
			navigator.clipboard.writeText(link);
			setSnackbarMessage('Administration link copied. This link enables access to the admin controls.');
		} else if (name === 'link') {
			navigator.clipboard.writeText(link);
			setSnackbarMessage('User link copied to clipboard.');
		} else {
			let msg = `Join my Squares pool!\n\n`;
			if (squarePrice) {
				const safeRetain = Number(retainAmount) || 0;
				const safeSliderValues = payoutSliderValues || [25, 50, 75, 100];
				const safeReversePercent = Number(reversePercent) || 0;

				const payouts = safeSliderValues.map((value, index) => {
					const previousValue = index ? safeSliderValues[index - 1] : 0;
					const quarterPercent = value - previousValue;
					let amount = (squarePrice - safeRetain / 100) * quarterPercent;

					if (safeReversePercent) {
						const reverseAmount = (amount * safeReversePercent) / 100;
						amount = amount - reverseAmount;
					}
					return amount;
				});

				const limitStr = maxSquares ? `limit of ${maxSquares} squares per person` : 'no limit on number of squares';
				msg += `$${squarePrice} per square, ${limitStr}. Quarter payouts are $${payouts.join(', $')}.\n\n`;
			}
			msg += link;

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

	const isMobile = useMediaQuery('(max-width: 600px)');

	return (
		<CustomAccordion title='Admin Controls'>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3, px: isMobile ? 2 : 0 }}>
				{/* Access Section */}
				<Box>
					<Typography variant='caption' fontWeight='700' color='text.secondary' sx={{ mb: 1, display: 'block', letterSpacing: 1 }}>
						ACCESS
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<Button
								variant='outlined'
								onClick={() => handleCopyLink('share')}
								fullWidth
								startIcon={<IosShareIcon />}
								sx={{ justifyContent: 'flex-start', py: 1 }}
							>
								Copy Invite Message
							</Button>
							<Typography variant='caption' display='block' sx={{ mt: 0.5, color: 'text.secondary', ml: 1 }}>
								Copy a pre-written invite message
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Button
								variant='outlined'
								onClick={() => handleCopyLink('link')}
								fullWidth
								startIcon={<LinkIcon />}
								sx={{ justifyContent: 'flex-start', py: 1 }}
							>
								Copy User Link
							</Button>
							<Typography variant='caption' display='block' sx={{ mt: 0.5, color: 'text.secondary', ml: 1 }}>
								Copy just the board link
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Button
								variant='outlined'
								onClick={() => handleCopyLink('admin')}
								fullWidth
								color='warning'
								startIcon={<AdminPanelSettingsIcon />}
								sx={{ justifyContent: 'flex-start', py: 1 }}
							>
								Copy Admin Link
							</Button>
							<Typography variant='caption' display='block' sx={{ mt: 0.5, color: 'text.secondary', ml: 1 }}>
								Private link to access admin controls
							</Typography>
						</Grid>
					</Grid>
				</Box>

				<Divider />

				{/* Settings Section */}
				<Box>
					<Typography variant='caption' fontWeight='700' color='text.secondary' sx={{ mb: 1, display: 'block', letterSpacing: 1 }}>
						SETTINGS
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<Button
								variant='outlined'
								onClick={() => setActiveDialog('finance')}
								fullWidth
								startIcon={<AttachMoneyIcon />}
								sx={{ justifyContent: 'flex-start', py: 1 }}
							>
								Manage Finances
							</Button>
							<Typography variant='caption' display='block' sx={{ mt: 0.5, color: 'text.secondary', ml: 1 }}>
								Set price and payouts
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Button
								variant='outlined'
								onClick={() => setActiveDialog('paymentInfo')}
								fullWidth
								startIcon={<InfoIcon />}
								sx={{ justifyContent: 'flex-start', py: 1 }}
							>
								Payment Info
							</Button>
							<Typography variant='caption' display='block' sx={{ mt: 0.5, color: 'text.secondary', ml: 1 }}>
								Add Venmo/payment details
							</Typography>
						</Grid>
					</Grid>
				</Box>

				<Divider />

				{/* Actions Section */}
				<Box>
					<Typography variant='caption' fontWeight='700' color='text.secondary' sx={{ mb: 1, display: 'block', letterSpacing: 1 }}>
						ACTIONS
					</Typography>
					<Grid container spacing={2}>
						{!boardInsights.areNumbersSet && (
							<Grid item xs={12} sm={6}>
								<Button
									variant='contained'
									onClick={handleSetNumbersClick}
									fullWidth
									startIcon={<BorderStyleIcon />}
									sx={{ py: 1 }}
								>
									Set Numbers
								</Button>
								<Typography variant='caption' display='block' sx={{ mt: 0.5, color: 'text.secondary', ml: 1 }}>
									Randomly assign board numbers
								</Typography>
							</Grid>
						)}
						<Grid item xs={12} sm={!boardInsights.areNumbersSet ? 6 : 12}>
							<Button
								variant='contained'
								onClick={handleEnterResultsClick}
								fullWidth
								startIcon={<EditIcon />}
								sx={{ py: 1 }}
							>
								Enter Results
							</Button>
							<Typography variant='caption' display='block' sx={{ mt: 0.5, color: 'text.secondary', ml: 1 }}>
								Update quarterly scores
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>

			{/* Dialogs */}
			{activeDialog === 'finance' && (
				<FinanceDialog onSave={handleFinanceSave} onClose={() => setActiveDialog('')} boardData={boardData} />
			)}
			{activeDialog === 'paymentInfo' && <ManagePaymentDialog onClose={() => setActiveDialog('')} />}
			{activeDialog === 'results' && (
				<ResultsDialog
					results={results}
					teams={teams}
					gridData={gridData}
					onSave={handleSubmitResult}
					onClose={() => setActiveDialog('')}
				/>
			)}
		</CustomAccordion>
	);
}
