import { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Head from 'next/head';
import AppContext from '@/contexts/AppContext';
import dynamic from 'next/dynamic';

const LoadingFallback = () => (
    <Box
        sx={{
            minHeight: '100vh',
            bgcolor: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        <CircularProgress sx={{ color: 'white' }} />
    </Box>
);

const LandingPage = dynamic(() => import('@/components/LandingPage'), {
    ssr: false,
    loading: LoadingFallback
});
const SquaresPage = dynamic(() => import('@/components/SquaresPage'), {
    ssr: false,
    loading: LoadingFallback
});
import { useAppServices } from '@/services/AppServices';
import { loadBoard } from '@/lib/api';
import { generateRefreshMessage } from '@/utils/generateRefreshMessage';

export default function Home() {
    const { boardData, setBoardData } = useContext(AppContext);
    const { showSnackbar } = useAppServices();
    const [lastActiveTime, setLastActiveTime] = useState(null);


    // Visibility/Auto-refresh logic ported from AppRouter.js
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!boardData) {
                setLastActiveTime(null);
                return;
            }
            const currentTime = new Date();
            if (document.visibilityState !== 'visible') {
                setLastActiveTime(currentTime);
            } else {
                const elapsedTime = lastActiveTime ? (currentTime - lastActiveTime) / (1000 * 60) : null;
                const refreshTimeout = 5; // in minutes
                if (elapsedTime && elapsedTime > refreshTimeout) {
                    const updatedData = await loadBoard({ id: boardData.id });
                    if (updatedData && !updatedData.error) {
                        const message = generateRefreshMessage(boardData, updatedData);
                        if (message) {
                            showSnackbar(message);
                        }
                        setBoardData(updatedData);
                        console.log(`Board updated after becoming active at ${currentTime}.`);
                    }
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [lastActiveTime, boardData, setBoardData, showSnackbar]);

    return (
        <>
            <Head>
                <title>{boardData?.boardName ? `${boardData.boardName} • Squares` : 'Squares • Digital Football Squares'}</title>
            </Head>
            <main>
                {boardData?.id ? <SquaresPage /> : <LandingPage />}
            </main>
        </>
    );
}
