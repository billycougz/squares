import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/theme';
import '../styles/styles.css';
import AppContextProvider from './AppContextProvider';
import Router from './AppRouter';

export default function App() {
	return (
		<AppContextProvider>
			<ThemeProvider theme={theme}>
				<Box sx={{ flexGrow: 1 }}>
					<Router />
				</Box>
			</ThemeProvider>
		</AppContextProvider>
	);
}
