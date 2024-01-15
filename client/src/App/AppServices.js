import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';
import Loader from '../components/Loader';
import DialogComponent from '../components/DialogComponent';

const AppServicesContext = createContext();

const defaultConfig = {
	autoHideDuration: 3000,
	anchorOrigin: { vertical: 'top', horizontal: 'center' },
};

/**
 * Provider for global app services
 * - Snackbar
 * - Dialog
 * - Loader
 */
const AppServicesProvider = ({ children }) => {
	const [snackbarConfig, setSnackbarConfig] = useState(null);
	const [dialogConfig, setDialogConfig] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const showSnackbar = (message, config = {}) => {
		setSnackbarConfig({ ...defaultConfig, ...config, message });
	};

	const hideSnackbar = () => {
		setSnackbarConfig(null);
	};

	return (
		<AppServicesContext.Provider value={{ showSnackbar, setDialog: setDialogConfig, setIsLoading }}>
			{children}
			<Loader open={isLoading} />
			{Boolean(dialogConfig) && <DialogComponent {...dialogConfig} />}
			{snackbarConfig && <Snackbar open={Boolean(snackbarConfig)} {...snackbarConfig} onClose={hideSnackbar} />}
		</AppServicesContext.Provider>
	);
};

const useAppServices = () => {
	return useContext(AppServicesContext);
};

export { AppServicesProvider, useAppServices };
