import React, { useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({ children }) => {
	const [boardData, setBoardData] = useState(null);
	const [boardInsights, setBoardInsights] = useState({});

	const handleBoardDataChange = (updatedData) => {
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
		setBoardInsights({
			remainingSquares: squareMap?.['_remaining'],
			areNumbersSet: updatedData?.gridData[0][1], // If one number is set they all are
		});
	};

	return (
		<AppContext.Provider value={{ boardInsights, boardData, setBoardData: handleBoardDataChange }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
