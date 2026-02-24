'use client';
import { useContext, useState } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AppContext from '@/contexts/AppContext';
import ManageFinanceContent from '@/components/dialog-content/ManageFinanceContent';
import StyledDialog from './StyledDialog';

interface FinanceData {
    squarePrice: number;
    maxSquares: number;
    payoutSliderValues: number[];
    venmoUsername: string;
    financeMessage: string;
    retainAmount: number;
    reversePercent: number;
}

interface FinanceDialogProps {
    onClose: () => void;
    onSave: (data: FinanceData) => void;
}

export default function FinanceDialog({ onClose, onSave }: FinanceDialogProps) {
    const { boardData } = useContext(AppContext);
    const { squarePrice, maxSquares, payoutSliderValues, venmoUsername, financeMessage, retainAmount, reversePercent } =
        boardData;

    const [financeData, setFinanceData] = useState<FinanceData>({
        squarePrice,
        maxSquares,
        payoutSliderValues,
        venmoUsername,
        financeMessage,
        retainAmount,
        reversePercent,
    });

    const [hasDataChanged, setHasDataChanged] = useState(false);

    const handleDataChange = (updatedFinanceData: FinanceData) => {
        const hasValueChanged =
            updatedFinanceData.retainAmount !== retainAmount ||
            updatedFinanceData.reversePercent !== reversePercent ||
            updatedFinanceData.venmoUsername !== venmoUsername ||
            updatedFinanceData.financeMessage !== financeMessage ||
            updatedFinanceData.maxSquares !== maxSquares ||
            updatedFinanceData.squarePrice !== squarePrice ||
            JSON.stringify(updatedFinanceData.payoutSliderValues) !== JSON.stringify(payoutSliderValues);
        setHasDataChanged(hasValueChanged);
        setFinanceData(updatedFinanceData);
    };

    return (
        <StyledDialog
            title="Square Finances"
            titleIcon={<AttachMoneyIcon sx={{ fontSize: 20 }} />}
            fullWidth
            closeConfig={{ text: 'Cancel', action: onClose }}
            saveConfig={{
                display: true,
                text: 'Save',
                disabled: !hasDataChanged,
                action: () => onSave(financeData),
            }}
        >
            <ManageFinanceContent financeData={financeData} onDataChange={handleDataChange} />
        </StyledDialog>
    );
}
