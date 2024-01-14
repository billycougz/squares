import React, { useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({ children }) => {
	const [boardUser, setBoardUser] = useState({});
	const [boardData, setBoardData] = useState({});
	const [boardInsights, setBoardInsights] = useState({});

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
				boardData,
				setBoardData: handleBoardDataChange,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
