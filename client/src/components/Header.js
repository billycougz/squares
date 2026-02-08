import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Refresh } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import InstallDialog from './InstallDialog';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HeaderMenu from './HeaderMenu';
import MyBoardsDialog from './MyBoardsDialog';

function isMobile() {
	return window.innerWidth <= 768;
}

function isStandalone() {
	return window.matchMedia('(display-mode: standalone)').matches;
}

export default function CustomHeader({ boardName, onHomeClick, onInfoClick, onRefresh, onSelectBoard }) {
	const [showInstallDialog, setShowInstallDialog] = useState(false);
	const [showMyBoardsDialog, setShowMyBoardsDialog] = useState(false);
	const [menuAnchor, setMenuAnchor] = useState(null);
	const handleMenuClick = (event) => {
		setMenuAnchor(event.currentTarget);
	};
	return (
		<AppBar position='sticky' sx={{ top: 0, zIndex: (theme) => theme.zIndex.appBar, background: 'radial-gradient(circle at top left, #1e40af, #1e3a8a, #172554)' }}>
			<Toolbar variant='dense' sx={{ justifyContent: 'space-between' }}>
				<IconButton size='large' edge='start' color='inherit' aria-label='Home' onClick={onHomeClick}>
					<HomeIcon />
				</IconButton>
				<Typography variant='h6'>{boardName}</Typography>
				<div>
					{onRefresh && (
						<IconButton color='inherit' onClick={onRefresh}>
							<Refresh />
						</IconButton>
					)}
					{/** ToDo: Enable this */}
					{false && isMobile() && !isStandalone() && (
						<IconButton onClick={() => setShowInstallDialog(true)}>
							<DownloadIcon sx={{ color: 'white' }} />
						</IconButton>
					)}
					{showInstallDialog && <InstallDialog onClose={() => setShowInstallDialog(false)} />}
					<IconButton onClick={handleMenuClick}>
						<MenuIcon sx={{ color: 'white' }} />
					</IconButton>
					<HeaderMenu
						anchorEl={menuAnchor}
						onClose={() => setMenuAnchor(null)}
						onInfoClick={onInfoClick}
						onMyBoardsClick={() => setShowMyBoardsDialog(true)}
					/>
					<MyBoardsDialog
						open={showMyBoardsDialog}
						onClose={() => setShowMyBoardsDialog(false)}
						onSelectBoard={onSelectBoard}
					/>
				</div>
			</Toolbar>
		</AppBar>
	);
}
