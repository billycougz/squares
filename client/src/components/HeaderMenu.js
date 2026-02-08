import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import { Menu, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function HeaderMenu({ anchorEl, onClose, onInfoClick, onMyBoardsClick }) {
	const open = Boolean(anchorEl);
	const handleClick = (item) => {
		onClose();
		switch (item) {
			case 'myBoards':
				return onMyBoardsClick();
			case 'info':
				return onInfoClick();
			case 'feedback':
				window.location.href = `mailto:CouganApps@gmail.com`;
				return;
			case 'coffee':
				return window.open('https://www.buymeacoffee.com/wpcougan', '_blank');
		}
	};
	return (
		<Menu anchorEl={anchorEl} open={open} onClose={onClose} dense>
			<MenuList dense sx={{ padding: 0 }}>
				<MenuItem onClick={() => handleClick('myBoards')}>
					<ListItemIcon>
						<DashboardIcon color='info' fontSize='small' />
					</ListItemIcon>
					<ListItemText>My Boards</ListItemText>
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => handleClick('info')}>
					<ListItemIcon>
						<InfoIcon color='info' fontSize='small' />
					</ListItemIcon>
					<ListItemText>Board Introduction</ListItemText>
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => handleClick('feedback')}>
					<ListItemIcon>
						<ThumbUpAltIcon color='info' fontSize='small' />
					</ListItemIcon>
					<ListItemText>App Feedback</ListItemText>
				</MenuItem>
				<Divider />
				<MenuItem onClick={() => handleClick('coffee')}>
					<ListItemIcon>
						<VolunteerActivismIcon color='info' fontSize='small' />
					</ListItemIcon>
					<ListItemText>Support the Developer</ListItemText>
				</MenuItem>
				<Divider />
				<Box sx={{ px: 2, py: 0.5, backgroundColor: '#f1f5f9', mt: 0.5 }}>
					<Typography variant="caption" sx={{ display: 'block', textAlign: 'center', fontSize: '0.65rem', color: '#475569', fontWeight: 600, letterSpacing: '0.05em' }}>
						VERSION 02-08-2026
					</Typography>
				</Box>
			</MenuList>
		</Menu>
	);
}
//  sx={{ color: '#fed200' }}
