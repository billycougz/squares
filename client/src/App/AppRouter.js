import { useContext } from 'react';
import LandingPage from '../pages/LandingPage';
import AppContext from './AppContext';
import SquaresPage from '../pages/SquaresPage';

function Router() {
	const { boardData } = useContext(AppContext);
	return boardData?.id ? <SquaresPage /> : <LandingPage />;
}

export default Router;
