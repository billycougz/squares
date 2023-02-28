import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

export default function Square({ value, location: [row, col], backgroundColor, onClick }) {
	const theme = useTheme();
	const isMedium = useMediaQuery(theme.breakpoints.up('md'));
	const disabled = !row || !col;
	const inputStyle = {
		textAlign: 'center',
		padding: '0',
		caretColor: 'transparent',
		cursor: 'pointer',
		backgroundColor,
		fontSize: isMedium ? '1.75rem' : '',
		WebkitTextFillColor: backgroundColor ? 'white' : '',
	};

	const handleClick = () => {
		onClick([row, col]);
	};

	return (
		<Grid xs visibility={!row && !col ? 'hidden' : ''}>
			<Item onClick={handleClick}>
				<TextField
					id='outlined-basic'
					variant='outlined'
					value={value !== null ? value : ''}
					disabled={disabled}
					inputProps={{ style: inputStyle, readOnly: 'readonly', inputMode: 'none' }}
				/>
			</Item>
		</Grid>
	);
}
