import { useState } from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SquaresBoard from './SquaresBoard';
import LandingPage from './LandingPage';

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

	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ flexGrow: 1, margin: { sm: '1em' } }}>
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
