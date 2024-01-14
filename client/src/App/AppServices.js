import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';
import Loader from '../components/Loader';

const AppServicesContext = createContext();

const defaultConfig = {
	autoHideDuration: 3000,
	anchorOrigin: { vertical: 'top', horizontal: 'center' },
};

/**
 * Provider for global app services
 * - Snackbar
 * - Loader
 */
const AppServicesProvider = ({ children }) => {
	const [snackbarConfig, setSnackbarConfig] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const showSnackbar = (message, config = {}) => {
		setSnackbarConfig({ ...defaultConfig, ...config, message });
	};

	const hideSnackbar = () => {
		setSnackbarConfig(null);
	};

	return (
		<AppServicesContext.Provider value={{ showSnackbar, setIsLoading }}>
			{children}
			<Loader open={isLoading} />
			{snackbarConfig && <Snackbar open={Boolean(snackbarConfig)} {...snackbarConfig} onClose={hideSnackbar} />}
		</AppServicesContext.Provider>
	);
};

const useAppServices = () => {
	return useContext(AppServicesContext);
};

export { AppServicesProvider, useAppServices };
