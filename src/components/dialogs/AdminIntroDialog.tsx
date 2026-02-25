'use client';
import { useContext, useState } from 'react';
import {
	Box,
	Button,
	InputAdornment,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import ManageFinanceContent from './content/ManageFinanceContent';
import ManagePaymentInfoContent from './content/ManagePaymentInfoContent';
import AppContext from '@/contexts/AppContext';
import { updateBoard } from '@/lib/api';
import IosShareIcon from '@mui/icons-material/IosShare';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useLocalStorage } from 'usehooks-ts';
import StyledDialog, { StepActions } from './StyledDialog';

interface AdminMessageDialogProps {
	onClose: () => void;
	setSnackbarMessage: (message: string) => void;
}

/* ─── Reusable step content card ──────────────────────────────── */
function ContentCard({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
	return (
		<Box
			sx={{
				display: 'flex',
				gap: 2,
				p: 2,
				borderRadius: '14px',
				background: 'rgba(59, 130, 246, 0.04)',
				border: '1px solid rgba(59, 130, 246, 0.08)',
			}}
		>
			{icon && (
				<Box sx={{ flexShrink: 0, mt: 0.25, color: 'primary.main' }}>{icon}</Box>
			)}
			<Box sx={{ flex: 1 }}>{children}</Box>
		</Box>
	);
}

/* ─── Checklist item ──────────────────────────────────────────── */
function CheckItem({ icon, text }: { icon: React.ReactNode; text: string }) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75 }}>
			<Box
				sx={{
					width: 32,
					height: 32,
					borderRadius: '8px',
					background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#fff',
					flexShrink: 0,
				}}
			>
				{icon}
			</Box>
			<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
				{text}
			</Typography>
		</Box>
	);
}

export default function AdminMessageDialog({ onClose, setSnackbarMessage }: AdminMessageDialogProps) {
	const { boardData, setBoardData, updateSubscriptions, boardUser } = useContext(AppContext);
	const {
		id,
		boardName,
		squarePrice,
		maxSquares,
		payoutSliderValues,
		venmoUsername,
		financeMessage,
		retainAmount,
		reversePercent,
	} = boardData;

	const [financeData, setFinanceData] = useState({
		squarePrice,
		maxSquares,
		payoutSliderValues,
		venmoUsername,
		financeMessage,
		retainAmount,
		reversePercent,
	});

	const [initials, setInitials] = useLocalStorage('squares-initials', '');
	const [initialsUnderChange, setInitialsUnderChange] = useState(initials);
	const [errors, setErrors] = useState<Record<string, boolean>>({});
	const [stepIndex, setStepIndex] = useState(0);

	const handleCopyShareLink = () => {
		const { origin } = document.location;
		const link = `${origin}/?id=${id}`;
		const msg = `Join my Squares pool!\n\n${encodeURI(link)}`;
		navigator.clipboard.writeText(msg);
		setSnackbarMessage('Participant link copied to clipboard.');
	};

	const handleInitialsChange = (value: string) => {
		setErrors({ ...errors, initials: false });
		setInitialsUnderChange(value.toUpperCase());
	};

	/* ─── Step content ────────────────────────────────────────── */
	const steps = [
		{
			title: 'Welcome To Squares',
			titleIcon: <SportsFootballIcon sx={{ fontSize: 20 }} />,
			updateInitials: true,
			content: (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
						Squares is the easiest way to play Football Squares with friends and family
						— no matter where everyone is located!
					</Typography>
					<Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
						Get started by entering your initials below.
					</Typography>
					<TextField
						error={errors.initials}
						placeholder="Your Initials"
						size="small"
						fullWidth
						value={initialsUnderChange}
						onChange={(e) => handleInitialsChange(e.target.value)}
						helperText={errors.initials ? 'Your initials are required.' : ''}
						sx={{
							'& .MuiOutlinedInput-root': { borderRadius: '12px' },
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircleIcon color="primary" />
								</InputAdornment>
							),
						}}
					/>
				</Box>
			),
		},
		{
			title: 'Administering Squares',
			titleIcon: <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />,
			content: (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
						As the board creator, you'll administer the game. Here's what to do at each stage:
					</Typography>

					<Box>
						<Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.06em', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
							Before The Game
						</Typography>
						<CheckItem icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />} text="Set the square finances" />
						<CheckItem icon={<GroupsIcon sx={{ fontSize: 16 }} />} text="Invite your participants" />
					</Box>

					<Box>
						<Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.06em', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
							Once All Squares Are Claimed
						</Typography>
						<CheckItem icon={<Grid4x4Icon sx={{ fontSize: 16 }} />} text="Set the board numbers" />
					</Box>

					<Box>
						<Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.06em', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
							At The End Of Each Quarter
						</Typography>
						<CheckItem icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />} text="Enter the results" />
						<CheckItem icon={<PaymentsIcon sx={{ fontSize: 16 }} />} text="Pay the winner" />
					</Box>

					<Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
						You are the only person who can remove initials from a square.
					</Typography>
				</Box>
			),
		},
		{
			title: 'Square Finances',
			titleIcon: <AttachMoneyIcon sx={{ fontSize: 20 }} />,
			isFinance: true,
			content: <ManageFinanceContent financeData={financeData} onDataChange={setFinanceData} />,
		},
		{
			title: 'Payment Information',
			titleIcon: <PaymentsIcon sx={{ fontSize: 20 }} />,
			isFinance: true,
			content: (
				<ManagePaymentInfoContent
					paymentInfoData={financeData}
					onDataChange={(paymentInfoData: any) =>
						setFinanceData({ ...financeData, ...paymentInfoData })
					}
				/>
			),
		},
		{
			title: 'Invite Participants',
			titleIcon: <ShareIcon sx={{ fontSize: 20 }} />,
			content: (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
					<Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
						Your board is ready! Copy the invitation message and send it to everyone you want to invite.
					</Typography>
					<Button
						variant="contained"
						size="large"
						onClick={handleCopyShareLink}
						fullWidth
						startIcon={<IosShareIcon />}
						sx={{
							borderRadius: '12px',
							py: 1.5,
							fontFamily: '"Outfit", sans-serif',
							fontWeight: 700,
							fontSize: '0.95rem',
							textTransform: 'none',
							background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
							boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
							'&:hover': {
								background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
							},
						}}
					>
						Copy Invitation Message
					</Button>
				</Box>
			),
		},
		{
			title: 'You\'re All Set',
			titleIcon: <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />,
			content: (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<ContentCard icon={<SportsFootballIcon sx={{ fontSize: 20 }} />}>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>To Play</Typography>
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							Tap any square to instantly claim it with your initials.
						</Typography>
					</ContentCard>

					<Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.06em', fontSize: '0.7rem' }}>
						Admin Controls
					</Typography>

					<ContentCard icon={<Grid4x4Icon sx={{ fontSize: 20 }} />}>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>Board Numbers</Typography>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Set the numbers once all squares are claimed.
						</Typography>
					</ContentCard>

					<ContentCard icon={<EmojiEventsIcon sx={{ fontSize: 20 }} />}>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>Quarterly Results</Typography>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Enter scores at the end of each quarter.
						</Typography>
					</ContentCard>

					<ContentCard icon={<GroupsIcon sx={{ fontSize: 20 }} />}>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>Invite & Finances</Typography>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Copy the participant link or update finances anytime from the Admin tab.
						</Typography>
					</ContentCard>

					<Box sx={{ textAlign: 'center', pt: 1 }}>
						<Typography variant="caption" sx={{ color: 'text.secondary' }}>
							Feedback?{' '}
							<Link href="mailto:couganapps@gmail.com" underline="hover" sx={{ fontWeight: 600 }}>
								CouganApps@gmail.com
							</Link>
						</Typography>
					</Box>
				</Box>
			),
		},
	];

	/* ─── Step navigation ─────────────────────────────────────── */
	const handleStepChange = async (direction: number) => {
		if (direction === 1) {
			if (steps[stepIndex].isFinance) {
				const { Item } = await updateBoard({ id, boardName, operation: 'finances', value: financeData });
				setBoardData({ ...Item });
			} else if (steps[stepIndex].updateInitials) {
				const newErrors = { initials: !Boolean(initialsUnderChange) };
				if (Object.values(newErrors).some((v) => v)) {
					setErrors(newErrors);
					return;
				}
				setInitials(initialsUnderChange);
			}
		}
		setStepIndex(stepIndex + direction);
	};

	const handleStart = async () => {
		const value = { adminIntroComplete: true };
		await updateBoard({ id, operation: 'update', value });
		if (boardUser.adminPhoneNumber) {
			updateSubscriptions(initials, boardUser.adminPhoneNumber);
		}
		onClose();
	};

	const currentStep = steps[stepIndex];

	const Actions = () => (
		<StepActions
			stepIndex={stepIndex}
			totalSteps={steps.length}
			onBack={() => handleStepChange(-1)}
			onNext={() => handleStepChange(1)}
			onFinish={handleStart}
			finishLabel="Get Started"
		/>
	);

	return (
		<StyledDialog
			title={currentStep.title}
			titleIcon={currentStep.titleIcon}
			step={{ current: stepIndex, total: steps.length }}
			CustomActions={Actions}
		>
			{currentStep.content}
		</StyledDialog>
	);
}
