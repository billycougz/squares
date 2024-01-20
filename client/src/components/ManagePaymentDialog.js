import { useContext, useState } from 'react';
import AppContext from '../App/AppContext';
import { useAppServices } from '../App/AppServices';
import { updateBoard } from '../api';
import ManagePaymentInfoContent from './ManagePaymentInfoContent';
import DialogComponent from './DialogComponent';

export default function ManagePaymentDialog({ onClose }) {
	const { boardData, setBoardData } = useContext(AppContext);
	const { id, boardName } = boardData;

	const { setIsLoading } = useAppServices();

	const [paymentInfoData, setPaymentInfoData] = useState({
		adminPaymentLink: boardData.adminPaymentLink,
		financeMessage: boardData.financeMessage,
	});

	const handleContinue = async () => {
		const { Item } = await updateBoard({ id, boardName, operation: 'finances', value: paymentInfoData });
		setBoardData(Item);
		onClose();
	};

	const isSaveDisabled =
		paymentInfoData.adminPaymentLink === boardData.adminPaymentLink &&
		paymentInfoData.financeMessage === boardData.financeMessage;

	const props = {
		title: 'Payment Information',
		closeConfig: { text: 'Cancel', action: onClose },
		saveConfig: { display: true, text: 'Save', action: handleContinue, disabled: isSaveDisabled },
	};

	return (
		<DialogComponent {...props}>
			<ManagePaymentInfoContent onDataChange={setPaymentInfoData} paymentInfoData={paymentInfoData} />
		</DialogComponent>
	);
}
