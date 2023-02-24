import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import SelectAllIcon from '@mui/icons-material/SelectAll';

export default function CustomHeader({ boardName, onHomeClick }) {
	return (
		<AppBar position='static'>
			<Toolbar variant='dense'>
				<IconButton size='large' edge='start' color='inherit' aria-label='Home' sx={{ mr: 2 }} onClick={onHomeClick}>
					<SelectAllIcon />
				</IconButton>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					{boardName ? `${boardName} | Squares` : 'Squares'}
				</Typography>
				<IconButton></IconButton>
			</Toolbar>
		</AppBar>
	);
}
