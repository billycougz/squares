import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/theme';
import '../styles/styles.css';
import AppContextProvider from './AppContextProvider';
import Router from './AppRouter';
import { AppServicesProvider } from './AppServices';

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
