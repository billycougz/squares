'use client';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from 'react';
import { useDocumentTitle, useLocalStorage } from 'usehooks-ts';
import { loadBoard, subscribeNumberToBoard } from '@/lib/api';
import AppContext from '@/contexts/AppContext';
import MobileView from './MobileView';
import NonMobileView from './NonMobileView';
import AdminIntroDialog from '@/components/AdminIntroDialog';
import CustomHeader from '@/components/Header';
import InfoDialog from '@/components/InfoDialog';
import SmsDialog from '@/components/SmsDialog';
import Loader from '@/components/Loader';
import { generateRefreshMessage } from '@/utils/generateRefreshMessage';

const hideOnLandscapeStyles = {
    '@media only screen and (orientation: landscape)': {
        display: 'none',
    },
};

export default function SquaresPage() {
    const theme = useTheme();
    const { boardData, setBoardData, boardUser, setBoardUser, boardInsights, getSubscribedNumber, updateSubscriptions } = useContext(AppContext);
    const { id, gridData, boardName, results, anchor, venmoUsername } = boardData;
    const { isAdmin } = boardUser;

    const [initials, setInitials] = useLocalStorage('squares-initials', '');
    const [view, setView] = useState('board');
    const [clickMode, setClickMode] = useState<'select' | 'remove' | 'result' | 'numbers' | 'finances' | 'update'>('select');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showInfoDialog, setShowInfoDialog] = useState<any>(false);
    const [showAdminIntroDialog, setShowAdminIntroDialog] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Ahhhhhhh, sorry to my future self about the mobile handling...
    const hasMobileHeight = useMediaQuery('(max-width:600px)');
    const hasMobileWidth = useMediaQuery('(max-height:600px)');
    const isMobile = hasMobileHeight || hasMobileWidth;

    useDocumentTitle(`${boardName}`);

    // Sync hasPaid state when board changes
    useEffect(() => {
        const storedValue = localStorage.getItem(`squares-paid-${id}`);
        setHasPaid(storedValue === 'true');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, setHasPaid]);

    // Sync admin status when board changes
    useEffect(() => {
        const recentBoards = JSON.parse(localStorage.getItem('recent-squares') || '[]');
        const currentBoard = recentBoards.find((board: any) => board.id === id);
        if (currentBoard) {
            setBoardUser({ isAdmin: Boolean(currentBoard.adminCode) });
        }
    }, [id, setBoardUser]);

    useEffect(() => {
        // Handle results anchor
        if (anchor === 'results') {
            const relevantResults = results.filter((result: any) => !!result.winner);
            if (relevantResults.length > 0) {
                const { winner } = relevantResults[relevantResults.length - 1];
                if (winner === initials) {
                    setSnackbarMessage('Congratulations, you won the latest squares quarter!');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardData]);

    const handleIntroFlows = () => {
        if (boardUser.isAdmin && !boardData.adminIntroComplete) {
            setShowAdminIntroDialog(true);
            return true;
        } else if (!initials) {
            setShowInfoDialog({ intro: true });
            return true;
        } else if (!boardInsights?.getClaimCount(initials)) {
            const isSubscribed = Boolean(getSubscribedNumber(initials));
            setShowInfoDialog({ intro: !isSubscribed });
            return true;
        }
        return false;
    };

    useEffect(() => {
        const introShown = handleIntroFlows();
        if (!introShown) {
            const message = generateRefreshMessage(null, boardData);
            if (message) {
                setSnackbarMessage(message);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll to top when view changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    const highlightColor = (theme.palette.primary as any).main;

    const squareMap = gridData.reduce(
        (map: any, row: any, rowIndex: number) => {
            if (!rowIndex) {
                return map;
            }
            row.forEach((value: any, colIndex: number) => {
                if (!colIndex) {
                    return map;
                }
                if (!value) {
                    value = '_remaining';
                }
                map[value] = map[value] ? map[value] + 1 : 1;
            });
            return map;
        },
        { _remaining: 0 }
    );

    const getLatestBoardData = async () => {
        setIsLoading(true);
        const data = await loadBoard({ id });
        if (data && !data.error) {
            const message = generateRefreshMessage(boardData, data);
            setBoardData(data);
            setSnackbarMessage(message || 'Board refreshed successfully.');
        } else {
            setSnackbarMessage('Failed to refresh board');
        }
        setIsLoading(false);
    };

    const handleSelectBoard = async (board: any) => {
        setIsLoading(true);
        const data = await loadBoard({ id: board.id, adminCode: board.adminCode });
        if (data && !data.error) {
            setBoardUser({ isAdmin: Boolean(board.adminCode) });
            setBoardData(data);
            setSnackbarMessage(`Loaded board: ${board.boardName}`);
        } else {
            setSnackbarMessage('Failed to load board');
        }
        setIsLoading(false);
    };

    const handlePaymentConfirm = () => {
        setHasPaid(true);
        localStorage.setItem(`squares-paid-${id}`, 'true');
        setShowPaymentDialog(false);
        setSnackbarMessage('Payment status updated!');
    };

    const handleSmsSave = async ({ phoneNumber }: { phoneNumber: string }) => {
        const { msg } = await subscribeNumberToBoard({ id, boardName, phoneNumber: phoneNumber.replace(/\s/g, '') });
        updateSubscriptions(initials, phoneNumber);
        setSnackbarMessage(msg);
        setIsSmsDialogOpen(false);
    };

    return (
        <Box sx={{ bgcolor: 'background.default', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Loader open={isLoading} />
            <Box sx={isMobile && hideOnLandscapeStyles}>
                <CustomHeader
                    boardName={boardName}
                    onHomeClick={() => setBoardData(null)}
                    onInfoClick={() => setShowInfoDialog({ intro: false })}
                    onRefresh={getLatestBoardData}
                    onSelectBoard={handleSelectBoard}
                    initials={initials}
                    onInitialsChange={setInitials}
                    onSmsClick={() => setIsSmsDialogOpen(true)}
                    venmoUsername={venmoUsername}
                    hasPaid={hasPaid}
                    isAdmin={isAdmin}
                />
            </Box>

            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setSnackbarMessage('')}
                message={snackbarMessage}
            />
            {showInfoDialog && <InfoDialog onClose={() => setShowInfoDialog(false)} isIntro={showInfoDialog?.intro} />}
            {showAdminIntroDialog && (
                <AdminIntroDialog setSnackbarMessage={setSnackbarMessage} onClose={() => setShowAdminIntroDialog(false)} />
            )}
            <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Have you completed your payment via Venmo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handlePaymentConfirm}
                        variant="contained"
                        autoFocus
                        color="success"
                    >
                        Yes, I&apos;ve Paid
                    </Button>
                </DialogActions>
            </Dialog>

            {isSmsDialogOpen && (
                <SmsDialog
                    open={isSmsDialogOpen}
                    onSave={handleSmsSave}
                    onClose={() => setIsSmsDialogOpen(false)}
                    boardName={boardName}
                    initials={initials}
                />
            )}

            {isMobile ? (
                <MobileView
                    view={view}
                    setView={setView}
                    setSnackbarMessage={setSnackbarMessage}
                    boardData={boardData}
                    initials={initials}
                    setInitials={setInitials}
                    squareMap={squareMap}
                    getLatestBoardData={getLatestBoardData}
                    anchor={anchor}
                    id={id}
                    boardName={boardName}
                    venmoUsername={venmoUsername}
                    hasPaid={hasPaid}
                    isAdmin={isAdmin}
                    boardUser={boardUser}
                    setShowPaymentDialog={setShowPaymentDialog}
                    clickMode={clickMode}
                    setClickMode={setClickMode}
                    setBoardData={setBoardData}
                    highlightColor={highlightColor}
                />
            ) : (
                <NonMobileView
                    id={id}
                    initials={initials}
                    setInitials={setInitials}
                    boardName={boardName}
                    setSnackbarMessage={setSnackbarMessage}
                    getLatestBoardData={getLatestBoardData}
                    venmoUsername={venmoUsername}
                    hasPaid={hasPaid}
                    isAdmin={isAdmin}
                    setView={setView}
                    boardData={boardData}
                    squareMap={squareMap}
                    anchor={anchor}
                    boardUser={boardUser}
                    setShowPaymentDialog={setShowPaymentDialog}
                    clickMode={clickMode}
                    setClickMode={setClickMode}
                    setBoardData={setBoardData}
                    highlightColor={highlightColor}
                />
            )}
        </Box>
    );
}
