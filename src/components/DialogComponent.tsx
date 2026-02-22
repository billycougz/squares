'use client';
import { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface CloseConfig {
    display?: boolean;
    text?: string;
    action?: () => void;
}

interface SaveConfig {
    display?: boolean;
    text?: string;
    disabled?: boolean;
    action?: () => void;
}

interface DialogComponentProps {
    title: string;
    children: ReactNode;
    actionOptional?: boolean;
    closeConfig?: CloseConfig;
    saveConfig?: SaveConfig;
    CustomActions?: React.ElementType;
}

const defaultCloseConfig = {
    display: true,
    text: 'Close',
    action: () => { },
};

const defaultSaveConfig = {
    display: false,
    text: 'Save',
    disabled: false,
    action: () => { },
};

export default function DialogComponent({
    title,
    children,
    actionOptional,
    closeConfig,
    saveConfig,
    CustomActions
}: DialogComponentProps) {
    const mergedCloseConfig = { ...defaultCloseConfig, ...closeConfig };
    const mergedSaveConfig = { ...defaultSaveConfig, ...saveConfig };

    return (
        <Dialog open={true} onClose={actionOptional ? mergedCloseConfig.action : undefined}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            {CustomActions && <CustomActions />}
            {!CustomActions && (
                <DialogActions>
                    {mergedCloseConfig.display && (
                        <Button onClick={mergedCloseConfig.action}>{mergedCloseConfig.text}</Button>
                    )}
                    {mergedSaveConfig.display && (
                        <Button disabled={mergedSaveConfig.disabled} onClick={mergedSaveConfig.action}>
                            {mergedSaveConfig.text}
                        </Button>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
}
