'use client';
import { ReactNode } from 'react';
import StyledDialog from './StyledDialog';

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

/**
 * Backward-compatible wrapper around StyledDialog.
 * Existing consumers don't need to change their props.
 */
export default function DialogComponent({
    title,
    children,
    actionOptional,
    closeConfig,
    saveConfig,
    CustomActions
}: DialogComponentProps) {
    return (
        <StyledDialog
            title={title}
            dismissible={actionOptional}
            closeConfig={closeConfig}
            saveConfig={saveConfig}
            CustomActions={CustomActions}
        >
            {children}
        </StyledDialog>
    );
}
