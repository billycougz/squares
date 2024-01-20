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
