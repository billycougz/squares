import { useContext, useEffect, useState } from 'react';
import LandingPage from '../pages/LandingPage';
import AppContext from './AppContext';
import SquaresPage from '../pages/SquaresPage';
import { loadBoard } from '../api';
import { useAppServices } from './AppServices';
import { generateRefreshMessage } from '../utils/generateRefreshMessage';

function Router() {
	const { boardData, setBoardData } = useContext(AppContext);
	const { showSnackbar } = useAppServices();

	const [lastActiveTime, setLastActiveTime] = useState(null);

	// TODO: 2/7/2026 - Do we still want this on top of new refresh with messaging?
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
					if (updatedData && !updatedData.error) {
						const message = generateRefreshMessage(boardData, updatedData);
						if (message) {
							showSnackbar(message);
						}
						setBoardData(updatedData);
						console.log(`Board updated after becoming active at ${currentTime}.`);
					}
				}
			}
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [lastActiveTime, boardData, setBoardData, showSnackbar]);

	return boardData?.id ? <SquaresPage /> : <LandingPage />;
}

export default Router;
