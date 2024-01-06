import { Accordion, AccordionDetails, AccordionSummary, useMediaQuery } from '@mui/material';
import { ExpandMoreOutlined } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

export default function CustomAccordion({ title, children, defaultExpanded }) {
	// Ahhhhhhh, sorry to my future self about the mobile handling...
	const hasMobileHeight = useMediaQuery('(max-width:600px)');
	const hasMobileWidth = useMediaQuery('(max-height:600px)');
	const isMobile = hasMobileHeight || hasMobileWidth;
	return (
		<Accordion sx={{ borderRadius: '5px' }} defaultExpanded={!isMobile ? defaultExpanded : true}>
			<AccordionSummary expandIcon={!isMobile ? <ExpandMoreOutlined /> : null}>
				<Typography>{title}</Typography>
			</AccordionSummary>

			<AccordionDetails>{children}</AccordionDetails>
		</Accordion>
	);
}
