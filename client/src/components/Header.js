import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import { InfoOutlined } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import InstallDialog from './InstallDialog';
import { useState } from 'react';

function isMobile() {
	return window.innerWidth <= 768;
}

function isStandalone() {
	return window.matchMedia('(display-mode: standalone)').matches;
}

export default function CustomHeader({ boardName, onHomeClick, onInfoClick }) {
	const [showInstallDialog, setShowInstallDialog] = useState(false);
	return (
		<AppBar position='static'>
			<Toolbar variant='dense' sx={{ justifyContent: 'space-between' }}>
				<IconButton size='large' edge='start' color='inherit' aria-label='Home' onClick={onHomeClick}>
					<SelectAllIcon />
				</IconButton>
				<Typography variant='h6'>{boardName}</Typography>
				<div>
					{/** ToDo: Enable this */}
					{false && isMobile() && !isStandalone() && (
						<IconButton onClick={() => setShowInstallDialog(true)}>
							<DownloadIcon sx={{ color: 'white' }} />
						</IconButton>
					)}
					{showInstallDialog && <InstallDialog onClose={() => setShowInstallDialog(false)} />}
					<IconButton onClick={onInfoClick}>
						<InfoOutlined sx={{ color: 'white' }} />
					</IconButton>
				</div>
			</Toolbar>
		</AppBar>
	);
}
