import { useEffect, useState } from 'react';
import {
	Button,
	Checkbox,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
	TextField,
	Box,
	FormControlLabel,
	FormGroup,
} from '@mui/material';
import { useDocumentTitle } from 'usehooks-ts';
import { createBoard, loadBoard } from '../api';
import Loader from '../components/Loader';
import styled from '@emotion/styled';
import LandingInfoDialog from '../components/LandingInfoDialog';
import { MuiTelInput } from 'mui-tel-input';
import PhoneNumberWarning from '../components/PhoneNumberWarning';

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

export default function LandingPage({ onBoardLoaded, recentSquares }) {
	const [formData, setFormData] = useState({
		boardName: '',
		userCode: '',
		adminCode: '',
		phoneNumber: '',
		teams: {
			horizontal: nflTeams.find((team) => team.default === 'horizontal'),
			vertical: nflTeams.find((team) => team.default === 'vertical'),
		},
	});
	const [isLoading, setIsLoading] = useState(false);
	const [fadeIn, setFadeIn] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [showPhoneInput, setShowPhoneInput] = useState(true);
	const [showPhoneNumberWarning, setShowPhoneNumberWarning] = useState(false);

	useDocumentTitle('Squares');

	useEffect(() => {
		const handleUrlParams = () => {
			const { searchParams } = new URL(document.location.href);
			if (searchParams.get('id')) {
				handleLoad({
					id: searchParams.get('id'),
					isAdmin: Boolean(searchParams.get('adminCode')),
					anchor: searchParams.get('anchor'),
				});
				window.history.replaceState({}, document.title, '/');
			}
		};
		handleUrlParams();
		const timer = setTimeout(() => {
			setFadeIn(true);
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	const handleCreate = async () => {
		setIsLoading(true);
		delete formData.isAdmin;
		const boardData = await createBoard(formData);
		if (!boardData.error) {
			onBoardLoaded({ ...boardData, isAdmin: true });
		} else {
			alert(boardData.error);
		}
		setIsLoading(false);
	};

	const handleLoad = async (requestData) => {
		setIsLoading(true);
		const boardData = await loadBoard(requestData);
		if (boardData.error) {
			alert(boardData.error);
		} else {
			onBoardLoaded({ ...boardData, isAdmin: requestData.isAdmin, anchor: requestData.anchor });
		}
		setIsLoading(false);
	};

	const handleTogglePhoneInput = () => {
		if (showPhoneInput) {
			setShowPhoneNumberWarning(true);
		} else {
			setShowPhoneInput(true);
		}
	};

	const handlePhoneNumberWarningClose = (proceed) => {
		if (proceed) {
			setShowPhoneInput(false);
		}
		setShowPhoneNumberWarning(false);
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
							helperText='Create a name for your Squares board'
							onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
							fullWidth
							size='small'
						/>

						<FormControlLabel
							control={
								<Checkbox
									defaultChecked
									value={showPhoneInput}
									checked={showPhoneInput}
									onChange={handleTogglePhoneInput}
								/>
							}
							label='Send me the link to my Squares board'
							sx={{
								'.MuiButtonBase-root': { padding: '9px' },
								'.MuiTypography-root': { fontSize: '.8rem' },
							}}
						/>

						{showPhoneNumberWarning && <PhoneNumberWarning onClose={handlePhoneNumberWarningClose} />}

						{showPhoneInput && (
							<MuiTelInput
								size='small'
								defaultCountry='US'
								forceCallingCode
								disableDropdown
								value={formData.phoneNumber}
								onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
								fullWidth
								sx={{ marginBottom: '1em' }}
							/>
						)}

						{/* Disabled team selection */ false && <TeamSelectionMenu />}

						<Button
							fullWidth
							disabled={!formData.boardName || (showPhoneInput && formData.phoneNumber.length !== 15)}
							variant='contained'
							onClick={handleCreate}
						>
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
