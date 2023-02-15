import { useState } from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SquaresBoard from './SquaresBoard';
import LandingPage from './LandingPage';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import SelectAllIcon from '@mui/icons-material/SelectAll';

const theme = createTheme({
	typography: {
		h1: {
			fontSize: '4.5rem',
		},
	},
});

export default function App() {
	const [boardData, setBoardData] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const recentSquares = JSON.parse(localStorage.getItem('recent-squares') || '[]');

	const updateRecentSquares = (squaresData) => {
		const updatedSquares = recentSquares.filter((squares) => squares.boardName !== squaresData.boardName);
		updatedSquares.push(squaresData);
		localStorage.setItem('recent-squares', JSON.stringify(updatedSquares));
	};

	const handleBoardLoaded = ({ boardData, isAdmin }) => {
		updateRecentSquares({ ...boardData, isAdmin });
		setBoardData(boardData);
		setIsAdmin(isAdmin);
	};

	const handleBoardUpdate = async (updatedBoard) => {
		setBoardData(updatedBoard);
	};

	const handleHomeClick = () => {
		setIsAdmin(false);
		setBoardData(null);
	};

	return (
		<ThemeProvider theme={theme}>
			<AppBar position='static'>
				<Toolbar variant='dense'>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='Home'
						sx={{ mr: 2 }}
						onClick={handleHomeClick}
					>
						<SelectAllIcon />
					</IconButton>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						{boardData ? `${boardData.boardName} | Squares` : 'Squares'}
					</Typography>
					<IconButton></IconButton>
				</Toolbar>
			</AppBar>

			<Box sx={{ flexGrow: 1, margin: '10px 0' }}>
				{boardData ? (
					<SquaresBoard boardData={boardData} onUpdate={handleBoardUpdate} isAdmin={isAdmin} />
				) : (
					<LandingPage onBoardLoaded={handleBoardLoaded} />
				)}
			</Box>
		</ThemeProvider>
	);
}

const SquaresBoardModel = {
	gridData: [],
	name: '',
	adminCode: '',
	userCode: '',
	limit: 100,
};
