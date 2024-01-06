import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Popover, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useState } from 'react';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

export default function Square({ value, location: [row, col], backgroundColor, onClick, resultQuarters }) {
	const theme = useTheme();
	const isMedium = useMediaQuery(theme.breakpoints.up('md'));
	const disabled = !row || !col;
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	const inputStyle = {
		textAlign: 'center',
		padding: '0',
		caretColor: 'transparent',
		cursor: 'pointer',
		backgroundColor,
		// border: 'solid 2px transparent',
		// borderColor: isResult ? '#ff9800' : 'transparent',
		// boxSizing: 'border-box',
		fontSize: isMedium ? '1.75rem' : '',
		WebkitTextFillColor: backgroundColor ? 'white' : '',
	};

	const handleClick = (e) => {
		onClick([row, col]);
		if (resultQuarters) {
			setPopoverAnchor(e.currentTarget);
		}
	};

	return (
		<Grid xs visibility={!row && !col ? 'hidden' : ''}>
			<Item onClick={handleClick}>
				<TextField
					id={`${row}-${col}`}
					variant='outlined'
					value={value !== null ? value : ''}
					disabled={disabled}
					inputProps={{ style: inputStyle, readOnly: 'readonly', inputMode: 'none' }}
				/>
			</Item>
			<Popover
				open={Boolean(popoverAnchor)}
				anchorEl={popoverAnchor}
				onClose={() => setPopoverAnchor(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Typography sx={{ p: 1 }}>{resultQuarters}</Typography>
			</Popover>
		</Grid>
	);
}
