import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

export default function CustomAccordion({ title, children, defaultExpanded }) {
	return (
		<Accordion sx={{ borderRadius: '5px' }} defaultExpanded={defaultExpanded}>
			<AccordionSummary expandIcon={<ExpandMoreOutlined />}>
				<Typography>{title}</Typography>
			</AccordionSummary>

			<AccordionDetails>{children}</AccordionDetails>
		</Accordion>
	);
}
