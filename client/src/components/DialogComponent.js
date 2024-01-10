import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const defaultCloseConfig = {
	display: true,
	text: 'Close',
	action: () => {},
};

const defaultSaveConfig = {
	display: false,
	text: 'Save',
	action: () => {},
};

export default function DialogComponent({ title, children, actionOptional, closeConfig, saveConfig }) {
	closeConfig = { ...defaultCloseConfig, ...closeConfig };
	saveConfig = { ...defaultSaveConfig, ...saveConfig };
	return (
		<Dialog open={true} onClose={actionOptional ? closeConfig.action : null}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				{closeConfig.display && <Button onClick={closeConfig.action}>{closeConfig.text}</Button>}
				{saveConfig.display && <Button onClick={saveConfig.action}>{saveConfig.text}</Button>}
			</DialogActions>
		</Dialog>
	);
}
