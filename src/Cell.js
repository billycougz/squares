import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

export default function Cell({ value = '', location: [row, col], backgroundColor, onClick }) {
	const disabled = !row || !col;
	const inputStyle = {
		textAlign: 'center',
		fontSize: '2rem',
		padding: '0',
		caretColor: 'transparent',
		cursor: 'pointer',
		backgroundColor,
		WebkitTextFillColor: backgroundColor ? 'white' : '',
	};

	const handleClick = () => {
		if (disabled || value) {
			return;
		}
		onClick([row, col]);
	};
	return (
		<Grid xs>
			<Item onClick={handleClick}>
				<TextField
					id='outlined-basic'
					variant='outlined'
					value={value}
					disabled={disabled}
					inputProps={{ style: inputStyle }}
				/>
			</Item>
		</Grid>
	);
}
