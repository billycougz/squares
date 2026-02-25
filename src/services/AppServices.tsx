'use client';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Snackbar, SnackbarProps } from '@mui/material';
import Loader from '@/components/layout/Loader';
import StyledDialog from '@/components/dialogs/StyledDialog';
import { StyledDialogProps } from '@/components/dialogs/StyledDialog';

const AppServicesContext = createContext<{
    showSnackbar: (message: string, config?: Partial<SnackbarProps>) => void;
    setDialog: (config: Omit<StyledDialogProps, 'children'> & { children: ReactNode } | null) => void;
    setIsLoading: (loading: boolean) => void;
} | undefined>(undefined);

const defaultConfig = {
    autoHideDuration: 3000,
    anchorOrigin: { vertical: 'top' as const, horizontal: 'center' as const },
};

/**
 * Provider for global app services
 * - Snackbar
 * - Dialog
 * - Loader
 */
const AppServicesProvider = ({ children }: { children: ReactNode }) => {
    const [snackbarConfig, setSnackbarConfig] = useState<(SnackbarProps & { message: string }) | null>(null);
    const [dialogConfig, setDialogConfig] = useState<(Omit<StyledDialogProps, 'children'> & { children: ReactNode }) | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const showSnackbar = (message: string, config: Partial<SnackbarProps> = {}) => {
        setSnackbarConfig({ ...defaultConfig, ...config, message } as SnackbarProps & { message: string });
    };

    const hideSnackbar = () => {
        setSnackbarConfig(null);
    };

    return (
        <AppServicesContext.Provider value={{ showSnackbar, setDialog: setDialogConfig, setIsLoading }}>
            {children}
            <Loader open={isLoading} />
            {Boolean(dialogConfig) && <StyledDialog {...dialogConfig!} />}
            {snackbarConfig && <Snackbar open={Boolean(snackbarConfig)} {...snackbarConfig} onClose={hideSnackbar} />}
        </AppServicesContext.Provider>
    );
};

const useAppServices = () => {
    return useContext(AppServicesContext);
};

export { AppServicesProvider, useAppServices };
