import React, { useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({ children }) => {
	const [boardUser, setBoardUser] = useState({});
	const [boardData, setBoardData] = useState({});
	const [boardInsights, setBoardInsights] = useState({});
	const [subscriptions, setSubscriptions] = useState(JSON.parse(localStorage.getItem('squares-subscriptions')) || {});

	const updateSubscriptions = (initials, phoneNumber) => {
		const { id } = boardData;
		subscriptions[id] = subscriptions[id] || {};
		subscriptions[id][initials] = phoneNumber;
		localStorage.setItem('squares-subscriptions', JSON.stringify(subscriptions));
		setSubscriptions({ ...subscriptions });
	};

	// ToDo: Build this into boardUser once initials are handled
	const getSubscribedNumber = (initials) => {
		const { id } = boardData;
		return subscriptions?.[id]?.[initials];
	};

	const handleBoardDataChange = (updatedData) => {
		if (!updatedData || (updatedData && !updatedData.id)) {
			setBoardUser({});
		} else {
			// Track recent boards in localStorage (using same key as landing page)
			const recentBoards = JSON.parse(localStorage.getItem('recent-squares') || '[]');

			// Find existing board to preserve adminCode if not provided
			const existingBoard = recentBoards.find((board) => board.id === updatedData.id);

			// If this board exists in our recent list, we only use the adminCode we already had.
			// This prevents gaining admin privileges from a leaked API response during refresh/update.
			// If the board is new to us, we accept the adminCode if provided (e.g. from first load).
			const adminCode = existingBoard ? existingBoard.adminCode : updatedData.adminCode;
			if (!adminCode) {
				delete updatedData.adminCode;
			}

			// Remove existing entry for this board if it exists
			const filteredBoards = recentBoards.filter((board) => board.id !== updatedData.id);

			// Add current board to the beginning (matching landing page format + lastAccessed)
			const newBoard = {
				id: updatedData.id,
				boardName: updatedData.boardName,
				adminCode,
				lastAccessed: new Date().toISOString(),
			};

			// Keep only the 10 most recent boards
			const updatedRecentBoards = [newBoard, ...filteredBoards].slice(0, 10);

			localStorage.setItem('recent-squares', JSON.stringify(updatedRecentBoards));
		}

		const squareMap = updatedData?.gridData.reduce(
			(map, row, rowIndex) => {
				if (!rowIndex) {
					return map;
				}
				row.forEach((value, colIndex) => {
					if (!colIndex) {
						return map;
					}
					if (!value) {
						value = '_remaining';
					}
					map[value] = map[value] ? map[value] + 1 : 1;
				});
				return map;
			},
			{ _remaining: 0 }
		);
		setBoardData(updatedData);
		const firstNumberSquare = updatedData?.gridData[0][1];
		setBoardInsights({
			remainingSquares: squareMap?.['_remaining'],
			areNumbersSet: firstNumberSquare || firstNumberSquare === 0,
			getClaimCount: (initials) => squareMap[initials] || 0,
		});
	};

	return (
		<AppContext.Provider
			value={{
				boardUser,
				setBoardUser,
				boardInsights,
				updateSubscriptions,
				getSubscribedNumber,
				boardData,
				setBoardData: handleBoardDataChange,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
