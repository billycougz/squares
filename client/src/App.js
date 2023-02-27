import { useState } from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { useLocalStorage } from 'usehooks-ts';
import theme from './styles/theme';
import './styles/styles.css';
import CustomHeader from './components/Header';
import SquaresBoard from './pages/SquaresPage';
import LandingPage from './pages/LandingPage';

export default function App() {
	const [boardData, setBoardData] = useState(null);
	const [recentSquares, setRecentSquares] = useLocalStorage('recent-squares', []);

	const updateRecentSquares = (currentSquares) => {
		const previousSquares = recentSquares.filter((squares) => squares.boardName !== currentSquares.boardName);
		setRecentSquares([{ ...currentSquares, anchor: undefined }, ...previousSquares]);
	};

	const handleBoardLoaded = (loadedBoard) => {
		updateRecentSquares(loadedBoard);
		setBoardData(loadedBoard);
	};

	return (
		<ThemeProvider theme={theme}>
			<CustomHeader boardName={boardData?.boardName} onHomeClick={() => setBoardData(null)} />

			<Box sx={{ flexGrow: 1, margin: '10px 0' }}>
				{boardData ? (
					<SquaresBoard boardData={boardData} onUpdate={setBoardData} />
				) : (
					<LandingPage onBoardLoaded={handleBoardLoaded} recentSquares={recentSquares} />
				)}
			</Box>
		</ThemeProvider>
	);
}
