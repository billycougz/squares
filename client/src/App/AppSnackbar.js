import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';

const SnackbarContext = createContext();

const defaultConfig = {
	autoHideDuration: 3000,
	anchorOrigin: { vertical: 'top', horizontal: 'center' },
};

const SnackbarProvider = ({ children }) => {
	const [snackbarConfig, setSnackbarConfig] = useState(null);

	const showSnackbar = (message, config = {}) => {
		setSnackbarConfig({ ...defaultConfig, ...config, message });
	};

	const hideSnackbar = () => {
		setSnackbarConfig(null);
	};

	return (
		<SnackbarContext.Provider value={{ showSnackbar }}>
			{children}
			{snackbarConfig && <Snackbar open={Boolean(snackbarConfig)} {...snackbarConfig} onClose={hideSnackbar} />}
		</SnackbarContext.Provider>
	);
};

const useSnackbar = () => {
	return useContext(SnackbarContext);
};

export { SnackbarProvider, useSnackbar };
