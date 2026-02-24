'use client';
import { useContext, useState } from 'react';
import PaymentsIcon from '@mui/icons-material/Payments';
import AppContext from '@/contexts/AppContext';
import { useAppServices } from '@/services/AppServices';
import { updateBoard } from '@/lib/api';
import ManagePaymentInfoContent from '@/components/dialog-content/ManagePaymentInfoContent';
import StyledDialog from './StyledDialog';

interface PaymentInfoData {
    venmoUsername: string;
    financeMessage: string;
}

interface ManagePaymentDialogProps {
    onClose: () => void;
}

export default function ManagePaymentDialog({ onClose }: ManagePaymentDialogProps) {
    const { boardData, setBoardData } = useContext(AppContext);
    const { id, boardName } = boardData;

    const { setIsLoading } = useAppServices();

    const [paymentInfoData, setPaymentInfoData] = useState<PaymentInfoData>({
        venmoUsername: boardData.venmoUsername,
        financeMessage: boardData.financeMessage,
    });

    const handleContinue = async () => {
        const { Item } = await updateBoard({ id, boardName, operation: 'finances', value: paymentInfoData });
        setBoardData(Item);
        onClose();
    };

    const isSaveDisabled =
        paymentInfoData.venmoUsername === boardData.venmoUsername &&
        paymentInfoData.financeMessage === boardData.financeMessage;

    return (
        <StyledDialog
            title="Payment Information"
            titleIcon={<PaymentsIcon sx={{ fontSize: 20 }} />}
            closeConfig={{ text: 'Cancel', action: onClose }}
            saveConfig={{ display: true, text: 'Save', action: handleContinue, disabled: isSaveDisabled }}
        >
            <ManagePaymentInfoContent onDataChange={setPaymentInfoData} paymentInfoData={paymentInfoData} />
        </StyledDialog>
    );
}
