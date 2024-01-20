import { useContext, useEffect, useState } from 'react';
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
	TextField,
	Box,
	FormGroup,
} from '@mui/material';
import { useDocumentTitle, useLocalStorage } from 'usehooks-ts';
import { createBoard, loadBoard } from '../api';
import Loader from '../components/Loader';
import styled from '@emotion/styled';
import LandingInfoDialog from '../components/LandingInfoDialog';
import { MuiTelInput } from 'mui-tel-input';
import PhoneNumberWarning from '../components/PhoneNumberWarning';
import AppContext from '../App/AppContext';

const FadeContainer = styled.div`
	opacity: ${({ $fadeIn }) => ($fadeIn ? 1 : 0)};
	transition: opacity 1s ease-in-out;
	transition-delay: 1s;
	top: 30px;
	position: relative;
	max-width: 500px;
	margin: auto;
	margin-bottom: 150px;
`;

const TitleContainer = styled.div`
	position: relative;
	top: ${({ $fadeIn }) => ($fadeIn ? 2 : 50)}%;
	left: 50%;
	transform: ${({ $fadeIn }) => ($fadeIn ? 'translateX(-50%)' : 'translate(-50%, -50%)')};
	transition: top 1s ease-out, transform 1s ease-out;
	width: 100vw;
`;

export default function LandingPage({}) {
	useDocumentTitle('Squares');

	const { setBoardData, setBoardUser } = useContext(AppContext);

	const [recentSquares, setRecentSquares] = useLocalStorage('recent-squares', []);

	const [formErrors, setFormErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [fadeIn, setFadeIn] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [showPhoneNumberWarning, setShowPhoneNumberWarning] = useState(false);

	const [formData, setFormData] = useState({
		boardName: '',
		phoneNumber: '',
		teams: {
			horizontal: nflTeams.find((team) => team.default === 'horizontal'),
			vertical: nflTeams.find((team) => team.default === 'vertical'),
		},
	});

	useEffect(() => {
		const handleUrlParams = () => {
			const { searchParams } = new URL(document.location.href);
			if (searchParams.get('id')) {
				handleLoad({
					id: searchParams.get('id'),
					adminCode: searchParams.get('adminCode'),
					anchor: searchParams.get('anchor'),
				});
				window.history.replaceState({}, document.title, '/');
			}
			if (searchParams.get('wpc')) {
				// Set test create params
				setFormData({
					...formData,
					boardName: `WPC Test ${new Date().toLocaleString()}`,
					// Needs to be passed as +1 xxx xxx xxxx
					phoneNumber: searchParams.get('phoneNumber'),
				});
			}
		};
		handleUrlParams();
		const timer = setTimeout(() => {
			setFadeIn(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	const phoneIsValidOrEmpty = (value) => {
		return !value || (value && value.length === 15);
	};

	const handleCreateClick = async () => {
		const errors = {
			boardName: !Boolean(formData.boardName),
			phoneNumber: !phoneIsValidOrEmpty(formData.phoneNumber),
		};
		if (Object.values(errors).some((value) => value)) {
			setFormErrors(errors);
			return;
		}
		if (!formData.phoneNumber) {
			setShowPhoneNumberWarning(true);
			return;
		}
		handleCreate();
	};

	const handleCreate = async () => {
		setIsLoading(true);
		const boardData = await createBoard(formData);
		const { error, subscribedPhoneNumber } = boardData;
		if (!error) {
			handleBoardReady({
				boardData,
				adminCode: boardData.adminCode,
				adminPhoneNumber: subscribedPhoneNumber,
			});
		} else {
			alert(boardData.error);
		}
		setIsLoading(false);
	};

	/**
	 * Called both on load by URL and on select of a recent board
	 */
	const handleLoad = async ({ id, adminCode, anchor }) => {
		setIsLoading(true);
		const boardData = await loadBoard({ id, adminCode });
		if (boardData.error) {
			alert(boardData.error);
		} else {
			handleBoardReady({ boardData, adminCode, anchor });
		}
		setIsLoading(false);
	};

	/**
	 * Called both after a board is created and after a board is loaded
	 */
	const handleBoardReady = ({ boardData, adminCode, adminPhoneNumber, anchor }) => {
		const recentBoard = recentSquares.find(({ id }) => id === boardData.id);
		// adminCode can be provided as a param or preexist if found in recentSquares
		// recentSquares scenario occurs on clicking link sent upon results
		adminCode = adminCode || recentBoard?.adminCode;
		if (!adminCode) {
			// ToDo: Handle adminCode better - don't send from API if not admin
			delete boardData.adminCode;
		}
		updateRecentSquares(boardData);
		// adminPhoneNumber passed onCreate to enable storing the subscription once initials set
		setBoardUser({ isAdmin: Boolean(adminCode), adminPhoneNumber });
		// ToDo: anchor is transient and should be handled separately
		setBoardData({ ...boardData, anchor });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const updateRecentSquares = (loadedBoard) => {
		const mostRecentBoard = {
			id: loadedBoard.id,
			boardName: loadedBoard.boardName,
			adminCode: loadedBoard.adminCode,
		};
		const additionalRecentBoards = recentSquares.filter(({ id }) => id !== loadedBoard.id);
		setRecentSquares([mostRecentBoard, ...additionalRecentBoards]);
	};

	const handlePhoneNumberWarningClose = (proceed) => {
		if (proceed) {
			handleCreate();
		}
		setShowPhoneNumberWarning(false);
	};

	const updateFormField = (field, value) => {
		if (field === 'phoneNumber' && value === '+1') {
			// Handles quirk where +1 remains in the value even after phone number completely deleted
			value = '';
		}
		setFormData({ ...formData, [field]: value });
		setFormErrors({ ...formErrors, [field]: false });
	};

	const TeamSelectionMenu = () => {
		<Box sx={{ width: '100%' }}>
			{['horizontal', 'vertical'].map((teamSide) => (
				<FormControl variant='filled' fullWidth sx={{ mb: 1, mt: 1 }} size='small'>
					<InputLabel sx={{ color: 'white !important', textTransform: 'capitalize' }}>{teamSide} Team</InputLabel>
					<Select
						value={formData.teams[teamSide].name}
						label={`${teamSide} Team`}
						sx={{ backgroundColor: `${formData.teams[teamSide].color} !important`, color: 'white' }}
					>
						{nflTeams.map(({ code, location, name, color }) => (
							<MenuItem
								sx={{ backgroundColor: color, color: 'white', '&:hover': { color } }}
								key={name}
								value={name}
								onClick={() =>
									setFormData({
										...formData,
										teams: { ...formData.teams, [teamSide]: { code, location, name, color } },
									})
								}
							>
								{`${location} ${name}`}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			))}
		</Box>;
	};

	return (
		<Paper
			sx={{
				textAlign: 'center',
				padding: '1em',
				borderRadius: '0',
				backgroundColor: 'rgb(25, 118, 210)',
				color: 'white',
				height: '100vh',
				overflow: 'scroll',
			}}
		>
			<Loader open={isLoading} />

			<TitleContainer $fadeIn={fadeIn}>
				<img src='/kara-logo-plays.png' alt='Squares Logo' height='100' />
				<Typography variant='h1' sx={{ mt: '-30px' }}>
					Squares
				</Typography>
				<Typography sx={{ letterSpacing: '3px', textTransform: 'uppercase', marginTop: '' }}>
					Digital football squares
				</Typography>
			</TitleContainer>

			<FadeContainer $fadeIn={fadeIn}>
				<Button variant='outlined' sx={{ color: 'white', borderColor: 'white' }} onClick={() => setShowInfo(true)}>
					How to play
				</Button>
				{showInfo && <LandingInfoDialog onClose={() => setShowInfo(false)} />}
				{Boolean(recentSquares.length) && (
					<Paper sx={{ padding: '1em', marginTop: '1em' }}>
						<Typography variant='h5' sx={{ opacity: '.69', textAlign: 'left', marginBottom: '8px' }}>
							Your Squares
						</Typography>
						<FormControl fullWidth size='small'>
							<InputLabel sx={{ fontSize: '.8rem', marginTop: '3px' }}>SHOW RECENT SQUARES</InputLabel>
							<Select value='' size='small'>
								{recentSquares.map((squaresData, index) => (
									<MenuItem
										key={`${squaresData.boardName}-${index}`}
										value={squaresData.boardName}
										onClick={() => handleLoad(squaresData)}
									>
										{squaresData.boardName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Paper>
				)}

				<Paper sx={{ padding: '1em', marginTop: '1em' }}>
					<Typography variant='h5' sx={{ opacity: '.69', textAlign: 'left', marginBottom: '8px' }}>
						Create Squares
					</Typography>

					<FormGroup>
						<TextField
							label='Squares Name'
							value={formData.boardName}
							helperText='Create a name for your Squares board.'
							error={formErrors.boardName}
							onChange={(e) => updateFormField('boardName', e.target.value)}
							fullWidth
							size='small'
						/>

						{showPhoneNumberWarning && <PhoneNumberWarning onClose={handlePhoneNumberWarningClose} />}
						<MuiTelInput
							placeholder='Phone Number'
							size='small'
							defaultCountry='US'
							forceCallingCode
							disableDropdown
							value={formData.phoneNumber}
							error={formErrors.phoneNumber}
							helperText={
								<span>
									Optional but recommended.
									<br /> Squares uses your phone number to send you your unique board link and board event
									notifications.
								</span>
							}
							onChange={(value) => updateFormField('phoneNumber', value)}
							fullWidth
							sx={{ margin: '10px 0' }}
						/>

						{/* Disabled team selection */ false && <TeamSelectionMenu />}

						<Button fullWidth variant='contained' onClick={handleCreateClick}>
							Create
						</Button>
					</FormGroup>
				</Paper>
			</FadeContainer>
		</Paper>
	);
}

const nflTeams = [
	{ code: 'ARI', name: 'Cardinals', location: 'Arizona', color: '#97233F' },
	{ code: 'ATL', name: 'Falcons', location: 'Atlanta', color: '#A71930' },
	{ code: 'BAL', name: 'Ravens', location: 'Baltimore', color: '#241773' },
	{ code: 'BUF', name: 'Bills', location: 'Buffalo', color: '#00338D' },
	{ code: 'CAR', name: 'Panthers', location: 'Carolina', color: '#0085CA' },
	{ code: 'CHI', name: 'Bears', location: 'Chicago', color: '#0B162A' },
	{ code: 'CIN', name: 'Bengals', location: 'Cincinnati', color: '#FB4F14' },
	{ code: 'CLE', name: 'Browns', location: 'Cleveland', color: '#311D00' },
	{ code: 'DAL', name: 'Cowboys', location: 'Dallas', color: '#041E42' },
	{ code: 'DEN', name: 'Broncos', location: 'Denver', color: '#FB4F14' },
	{ code: 'DET', name: 'Lions', location: 'Detroit', color: '#0076B6' },
	{ code: 'GB', name: 'Packers', location: 'Green Bay', color: '#203731' },
	{ code: 'HOU', name: 'Texans', location: 'Houston', color: '#03202F' },
	{ code: 'IND', name: 'Colts', location: 'Indianapolis', color: '#002C5F' },
	{ code: 'JAX', name: 'Jaguars', location: 'Jacksonville', color: '#006778' },
	{ code: 'KC', name: 'Chiefs', location: 'Kansas City', color: '#E31837', default: 'vertical' },
	{ code: 'LV', name: 'Raiders', location: 'Las Vegas', color: '#000000' },
	{ code: 'LAC', name: 'Chargers', location: 'Los Angeles', color: '#002A5E' },
	{ code: 'LAR', name: 'Rams', location: 'Los Angeles', color: '#002244' },
	{ code: 'MIA', name: 'Dolphins', location: 'Miami', color: '#008E97' },
	{ code: 'MIN', name: 'Vikings', location: 'Minnesota', color: '#4F2683' },
	{ code: 'NE', name: 'Patriots', location: 'New England', color: '#002244' },
	{ code: 'NO', name: 'Saints', location: 'New Orleans', color: '#D3BC8D' },
	{ code: 'NYG', name: 'Giants', location: 'New York', color: '#0B2265' },
	{ code: 'NYJ', name: 'Jets', location: 'New York', color: '#203731' },
	{ code: 'PHI', name: 'Eagles', location: 'Philadelphia', color: '#004C54', default: 'horizontal' },
	{ code: 'PIT', name: 'Steelers', location: 'Pittsburgh', color: '#FFB612' },
	{ code: 'SF', name: '49ers', location: 'San Francisco', color: '#AA0000' },
	{ code: 'SEA', name: 'Seahawks', location: 'Seattle', color: '#002244' },
	{ code: 'TB', name: 'Buccaneers', location: 'Tampa Bay', color: '#D50A0A' },
	{ code: 'TEN', name: 'Titans', location: 'Tennessee', color: '#0C2340' },
	{ code: 'WAS', name: 'Commanders', location: 'Washington', color: '#773141' },
];
