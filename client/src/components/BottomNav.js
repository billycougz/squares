import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaidIcon from '@mui/icons-material/Paid';
import GridOnIcon from '@mui/icons-material/GridOn';
import TuneIcon from '@mui/icons-material/Tune';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AppContext from '../App/AppContext';

export default function SimpleBottomNavigation({ onViewChange, view }) {
	const { boardUser } = React.useContext(AppContext);
	const { isAdmin } = boardUser;
	return (
		<Box sx={{ position: 'fixed', bottom: 0, width: '100%', borderTop: '1px solid #e0e0e0', zIndex: 1000 }}>
			<BottomNavigation
				showLabels
				value={view}
				onChange={(event, newValue) => {
					onViewChange(newValue);
				}}
			>
				<BottomNavigationAction value='board' label='Board' icon={<GridOnIcon />} />
				<BottomNavigationAction value='players' label='Summary' icon={<AssessmentIcon />} />
				<BottomNavigationAction value='numbers' label='Numbers' icon={<FormatListNumberedIcon />} />
				<BottomNavigationAction value='results' label='Results' icon={<PaidIcon />} />
				{isAdmin && <BottomNavigationAction value='admin' label='Admin' icon={<TuneIcon />} />}
			</BottomNavigation>
		</Box>
	);
}
