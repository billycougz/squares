import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/theme';
import '../styles/styles.css';
import AppContextProvider from './AppContextProvider';
import Router from './AppRouter';
import { AppServicesProvider } from './AppServices';

const handleAppVersion = () => {
	const currentVersion = '1.0.0';
	const versionKey = 'squares-version';
	const lastAccessedVersion = window.localStorage.getItem(versionKey);
	if (currentVersion !== lastAccessedVersion) {
		window.localStorage.clear();
		console.log('Storage cleared');
	}
	console.log(`App Version: ${currentVersion}`);
	window.localStorage.setItem(versionKey, currentVersion);
};

handleAppVersion();

export default function App() {
	return (
		<AppContextProvider>
			<ThemeProvider theme={theme}>
				<AppServicesProvider>
					<Box sx={{ flexGrow: 1 }}>
						<Router />
					</Box>
				</AppServicesProvider>
			</ThemeProvider>
		</AppContextProvider>
	);
}
