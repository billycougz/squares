import { Box, Typography } from '@mui/material';
import DialogComponent from './DialogComponent';

export default function InfoDialog({ onClose }) {
	return (
		<DialogComponent title='Squares Basics' closeConfig={{ action: onClose }}>
			<Box>
				<Typography sx={{ marginBottom: '1em' }}>
					Squares is simple. Enter your initials once, then tap any square to claim it.
				</Typography>
				<Typography>
					To receive notifications at the end of each quarter, tap the blue message icon next to your initials.
				</Typography>
			</Box>
		</DialogComponent>
	);
}
