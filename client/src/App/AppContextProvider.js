import React, { useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({ children }) => {
	const [boardData, setBoardData] = useState(null);
	const [boardInsights, setBoardInsights] = useState({});

	const handleBoardDataChange = (updatedData) => {
		setBoardData(updatedData);
		setBoardInsights({});
	};

	return (
		<AppContext.Provider value={{ boardInsights, boardData, setBoardData: handleBoardDataChange }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
