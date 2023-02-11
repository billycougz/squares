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

	const handleBoardLoaded = (data) => {
		setBoardData(data);
	};

	const handleBoardUpdate = (gridData) => {
		setBoardData({ ...boardData, gridData });
	};

	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ flexGrow: 1, margin: '1em' }}>
				{boardData ? (
					<SquaresBoard boardData={boardData} onUpdate={handleBoardUpdate} />
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
