import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { useLocalStorage } from 'usehooks-ts';
import theme from './styles/theme';
import './styles/styles.css';
import SquaresBoard from './pages/SquaresPage';
import LandingPage from './pages/LandingPage';

export default function App() {
	const [boardData, setBoardData] = useState(null);
	const [recentSquares, setRecentSquares] = useLocalStorage('recent-squares', []);

	useEffect(() => {
		if (!boardData) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [boardData]);

	const updateRecentSquares = (currentSquares) => {
		const previousSquares = recentSquares.filter((squares) => squares.boardName !== currentSquares.boardName);
		setRecentSquares([{ ...currentSquares, anchor: undefined }, ...previousSquares]);
	};

	const handleBoardLoaded = (loadedBoard) => {
		updateRecentSquares(loadedBoard);
		setBoardData(loadedBoard);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ flexGrow: 1 }}>
				{boardData ? (
					<SquaresBoard boardData={boardData} onUpdate={setBoardData} onHomeClick={() => setBoardData(null)} />
				) : (
					<LandingPage onBoardLoaded={handleBoardLoaded} recentSquares={recentSquares} />
				)}
			</Box>
		</ThemeProvider>
	);
}
