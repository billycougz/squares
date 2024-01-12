import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import GroupIcon from '@mui/icons-material/Group';
import PaidIcon from '@mui/icons-material/Paid';
import GridOnIcon from '@mui/icons-material/GridOn';
import TuneIcon from '@mui/icons-material/Tune';
import AppContext from '../App/AppContext';

export default function SimpleBottomNavigation({ onViewChange, view }) {
	const { boardUser } = React.useContext(AppContext);
	const { isAdmin } = boardUser;
	return (
		<Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
			<BottomNavigation
				showLabels
				value={view}
				onChange={(event, newValue) => {
					onViewChange(newValue);
				}}
			>
				<BottomNavigationAction value='board' label='Board' icon={<GridOnIcon />} />
				<BottomNavigationAction value='players' label='Players' icon={<GroupIcon />} />
				<BottomNavigationAction value='results' label='Results' icon={<PaidIcon />} />
				{isAdmin && <BottomNavigationAction value='admin' label='Admin' icon={<TuneIcon />} />}
			</BottomNavigation>
		</Box>
	);
}
