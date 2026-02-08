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
	InputBase,
	InputAdornment,
} from '@mui/material';
import { useDocumentTitle, useLocalStorage } from 'usehooks-ts';
import { createBoard, loadBoard } from '../api';
import Loader from '../components/Loader';
import styled from '@emotion/styled';
import LandingInfoDialog from '../components/LandingInfoDialog';
import { MuiTelInput } from 'mui-tel-input';
import PhoneNumberWarning from '../components/PhoneNumberWarning';
import AppContext from '../App/AppContext';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const FadeContainer = styled.div`
	opacity: ${({ $fadeIn }) => ($fadeIn ? 1 : 0)};
	transform: translateY(${({ $fadeIn }) => ($fadeIn ? '0' : '20px')});
	transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
	transition-delay: 1.2s;
	position: relative;
	max-width: 450px;
	margin: auto;
	padding: 0 20px;
	margin-bottom: 100px;
	margin-top: 10px;
`;

const TitleContainer = styled.div`
	position: relative;
	top: ${({ $fadeIn }) => ($fadeIn ? 5 : 40)}%;
	left: 50%;
	transform: ${({ $fadeIn }) => ($fadeIn ? 'translateX(-50%)' : 'translate(-50%, -50%)')};
	transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
	width: 100vw;
	img {
		width: 100%;
		max-width: 320px;
		filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
	}
`;

const FormCard = styled(Paper)`
	background: rgba(255, 255, 255, 0.95) !important;
	backdrop-filter: blur(10px);
	border-radius: 24px !important;
	padding: 24px !important;
	box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
	border: 1px solid rgba(255, 255, 255, 0.3) !important;
	text-align: left;
`;

const RecentBoardsCard = styled(Paper)`
	background: rgba(255, 255, 255, 0.1) !important;
	backdrop-filter: blur(10px);
	border-radius: 20px !important;
	padding: 16px !important;
	border: 1px solid rgba(255, 255, 255, 0.2) !important;
	margin-bottom: 24px !important;
	color: white !important;
`;

export default function LandingPage({ }) {
	useDocumentTitle('Squares • Digital Football Squares');

	const { setBoardData, setBoardUser } = useContext(AppContext);

	const [recentSquares, setRecentSquares] = useLocalStorage('recent-squares', []);

	const [formErrors, setFormErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [fadeIn, setFadeIn] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [showPhoneNumberWarning, setShowPhoneNumberWarning] = useState(false);
	const [games, setGames] = useState([]);
	const [selectedGame, setSelectedGame] = useState(null);

	const [formData, setFormData] = useState({
		boardName: '',
		phoneNumber: '',
		teams: {
			horizontal: nflTeams.find((team) => team.default === 'horizontal'),
			vertical: nflTeams.find((team) => team.default === 'vertical'),
		},
	});

	const fetchConfig = async () => {
		const gistUrl = 'https://api.github.com/gists/150875f37c1e5ecf493794eefd168278';
		const gist = await fetch(gistUrl).then((res) => res.json());
		const gistContent = gist?.files['squares-config.json']?.content;
		if (gistContent) {
			handleConfig(gistContent);
		}
	};

	const handleConfig = (gistContent) => {
		const { games } = JSON.parse(gistContent);
		if (games && games.length) {
			const { teams } = games[0];
			setGames(games);
			setSelectedGame(games[0]);
			updateSelectedTeams(teams);
		}
	};

	// ToDo: Eventually handle game together with teams
	const updateSelectedTeams = (teams) => {
		const horizontal = nflTeams.find((team) => team.code === teams?.horizontal);
		const vertical = nflTeams.find((team) => team.code === teams?.vertical);
		if (horizontal && vertical) {
			setFormData((prevState) => ({
				...prevState,
				teams: {
					horizontal,
					vertical,
				},
			}));
		}
	};

	useEffect(() => {
		fetchConfig();
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
					boardName: new Date().toLocaleString(),
					// Needs to be passed as +1 xxx xxx xxxx
					phoneNumber: searchParams.get('phoneNumber'),
					test: true,
				});
			}
		};
		handleUrlParams();
		const timer = setTimeout(() => {
			setFadeIn(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	const handleGameChange = (e) => {
		const game = games.find((game) => game.title === e.target.value);
		updateSelectedTeams(game.teams);
		setSelectedGame(game);
	};

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
		updateRecentSquares(boardData, adminCode);
		// adminPhoneNumber passed onCreate to enable storing the subscription once initials set
		setBoardUser({ isAdmin: Boolean(adminCode), adminPhoneNumber });
		// ToDo: anchor is transient and should be handled separately
		setBoardData({ ...boardData, anchor });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const updateRecentSquares = (loadedBoard, adminCode) => {
		const mostRecentBoard = {
			id: loadedBoard.id,
			boardName: loadedBoard.boardName,
			adminCode: adminCode,
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
		<Box
			sx={{
				textAlign: 'center',
				borderRadius: '0',
				background: 'radial-gradient(circle at top left, #1e40af, #1e3a8a, #172554)',
				color: 'white',
				minHeight: '100vh',
				height: '100dvh',
				overflow: 'auto',
				position: 'fixed',
				width: '100%',
				top: 0,
				left: 0,
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
					opacity: 0.05,
					pointerEvents: 'none'
				}
			}}
		>
			<Loader open={isLoading} />


			<TitleContainer $fadeIn={fadeIn}>
				<img src='/Squares_SiteLogo.svg' alt='Squares Logo' />
			</TitleContainer>

			<FadeContainer $fadeIn={fadeIn}>
				{showInfo && <LandingInfoDialog onClose={() => setShowInfo(false)} />}
				{recentSquares.length > 0 ? (
					<RecentBoardsCard>
						<Typography
							variant='overline'
							sx={{
								opacity: 0.8,
								display: 'block',
								textAlign: 'left',
								mb: 1.5,
								fontWeight: 700,
								letterSpacing: 2
							}}
						>
							Your Recent Boards
						</Typography>
						<FormControl fullWidth size='small'>
							<Select
								value=''
								displayEmpty
								renderValue={() => <span style={{ color: 'white' }}>Select a recent board...</span>}
								sx={{
									backgroundColor: 'rgba(255,255,255,0.1)',
									color: 'white',
									borderRadius: '12px',
									'& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
									'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
									'& .MuiSvgIcon-root': { color: 'white' }
								}}
							>
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
					</RecentBoardsCard>
				) : (
					<Button
						variant='outlined'
						sx={{
							color: 'white',
							borderColor: 'rgba(255,255,255,0.3)',
							borderRadius: '12px',
							textTransform: 'none',
							mb: 3,
							width: '100%',
							py: 1.2,
							fontSize: '0.9rem',
							fontWeight: 600,
							'&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
						}}
						onClick={() => setShowInfo(true)}
					>
						How it works
					</Button>
				)}

				<FormCard>
					<Typography
						variant='h5'
						sx={{
							color: '#1e3a8a',
							fontWeight: 800,
							mb: 3,
							fontSize: '1.5rem',
							letterSpacing: '-0.02em'
						}}
					>
						Create New Board
					</Typography>

					{Boolean(games?.length) && (
						<FormControl fullWidth>
							<Select
								value={selectedGame?.title || ''}
								onChange={handleGameChange}
								sx={{
									color: 'rgb(1, 67, 97)',
									background: 'rgb(229, 246, 253)',
									mb: '20px',
									fontSize: '14px',
									borderRadius: '12px',
									'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
									padding: '4px',
								}}
								input={
									<InputBase
										startAdornment={
											<InputAdornment position='start' sx={{ ml: 1 }}>
												<TaskAltIcon sx={{ color: '#0288d1', fontSize: '20px' }} />
											</InputAdornment>
										}
									/>
								}
							>
								{games.map((game) => (
									<MenuItem key={game.title} value={game.title}>
										{game.title}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					<FormGroup>
						<TextField
							label='Board Name'
							value={formData.boardName}
							placeholder='e.g. Super Bowl LIX'
							error={formErrors.boardName}
							onChange={(e) => updateFormField('boardName', e.target.value)}
							fullWidth
							variant='outlined'
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: '12px',
									backgroundColor: '#f8fafc'
								}
							}}
						/>

						{showPhoneNumberWarning && <PhoneNumberWarning onClose={handlePhoneNumberWarningClose} />}
						<MuiTelInput
							placeholder='Phone Number'
							defaultCountry='US'
							forceCallingCode
							disableDropdown
							value={formData.phoneNumber}
							error={formErrors.phoneNumber}
							onChange={(value) => updateFormField('phoneNumber', value)}
							fullWidth
							sx={{
								margin: '16px 0',
								'& .MuiOutlinedInput-root': {
									borderRadius: '12px',
									backgroundColor: '#f8fafc'
								}
							}}
						/>

						<Typography variant='caption' sx={{ color: '#64748b', mb: 3, display: 'block', px: 1 }}>
							We'll text you a link to your board and notify you when the game starts.
						</Typography>

						{/* Disabled team selection */ false && <TeamSelectionMenu />}

						<Button
							fullWidth
							variant='contained'
							onClick={handleCreateClick}
							sx={{
								borderRadius: '12px',
								py: 1.5,
								fontSize: '1rem',
								fontWeight: 700,
								textTransform: 'none',
								boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
								background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
								'&:hover': {
									background: 'linear-gradient(to right, #1d4ed8, #1e40af)',
								}
							}}
						>
							Create Board
						</Button>
					</FormGroup>
				</FormCard>
			</FadeContainer>
		</Box>
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
	{ code: 'KC', name: 'Chiefs', location: 'Kansas City', color: '#E31837', default: 'horizontal' },
	{ code: 'LV', name: 'Raiders', location: 'Las Vegas', color: '#000000' },
	{ code: 'LAC', name: 'Chargers', location: 'Los Angeles', color: '#002A5E' },
	{ code: 'LAR', name: 'Rams', location: 'Los Angeles', color: '#002244' },
	{ code: 'MIA', name: 'Dolphins', location: 'Miami', color: '#008E97' },
	{ code: 'MIN', name: 'Vikings', location: 'Minnesota', color: '#4F2683' },
	{ code: 'NE', name: 'Patriots', location: 'New England', color: '#002244' },
	{ code: 'NO', name: 'Saints', location: 'New Orleans', color: '#D3BC8D' },
	{ code: 'NYG', name: 'Giants', location: 'New York', color: '#0B2265' },
	{ code: 'NYJ', name: 'Jets', location: 'New York', color: '#203731' },
	{ code: 'PHI', name: 'Eagles', location: 'Philadelphia', color: '#004C54' },
	{ code: 'PIT', name: 'Steelers', location: 'Pittsburgh', color: '#FFB612' },
	{ code: 'SF', name: '49ers', location: 'San Francisco', color: '#AA0000', default: 'vertical' },
	{ code: 'SEA', name: 'Seahawks', location: 'Seattle', color: '#002244' },
	{ code: 'TB', name: 'Buccaneers', location: 'Tampa Bay', color: '#D50A0A' },
	{ code: 'TEN', name: 'Titans', location: 'Tennessee', color: '#0C2340' },
	{ code: 'WAS', name: 'Commanders', location: 'Washington', color: '#773141' },
];
