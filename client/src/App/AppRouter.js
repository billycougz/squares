import { useContext, useEffect, useState } from 'react';
import LandingPage from '../pages/LandingPage';
import AppContext from './AppContext';
import SquaresPage from '../pages/SquaresPage';
import { loadBoard } from '../api';

function Router() {
	const { boardData, setBoardData } = useContext(AppContext);

	const [lastActiveTime, setLastActiveTime] = useState(null);

	// Everything in this useEffect handles logic to refresh the data after the page has been inactive
	useEffect(() => {
		const handleVisibilityChange = async () => {
			if (!boardData) {
				setLastActiveTime(null);
				return;
			}
			const currentTime = new Date();
			if (document.visibilityState !== 'visible') {
				setLastActiveTime(currentTime);
				// console.log(`Board no longer active as of ${currentTime}.`);
			} else {
				const elapsedTime = lastActiveTime ? (currentTime - lastActiveTime) / (1000 * 60) : null;
				const refreshTimeout = 5; // in minutes
				if (elapsedTime && elapsedTime > refreshTimeout) {
					const updatedData = await loadBoard({ id: boardData.id });
					setBoardData(updatedData);
					console.log(`Board updated after becoming active at ${currentTime}.`);
				}
			}
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [lastActiveTime]);

	return boardData?.id ? <SquaresPage /> : <LandingPage />;
}

export default Router;
