import { useState } from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SquaresBoard from './SquaresBoard';
import LandingPage from './LandingPage';
import { updateBoard } from './api';

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

	const handleBoardLoaded = ({ boardData, isAdmin }) => {
		setBoardData(boardData);
		setIsAdmin(isAdmin);
	};

	const handleBoardUpdate = async (gridData) => {
		const updateData = { ...boardData, gridData };
		const response = await updateBoard(updateData);
		setBoardData(updateData);
	};

	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ flexGrow: 1, margin: '1em' }}>
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
