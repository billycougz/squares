import { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Head from 'next/head';
import AppContext from '@/contexts/AppContext';
import dynamic from 'next/dynamic';
import { useAppServices } from '@/services/AppServices';
import { loadBoard } from '@/lib/api';
import { generateRefreshMessage } from '@/utils/generateRefreshMessage';
import { GetServerSideProps } from 'next';
import { BoardModel } from '@/models/BoardModel';
import { appConfig } from '@/lib/config';

const LoadingFallback = () => (
    <Box
        sx={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at top left, #1e40af, #1e3a8a, #172554)',
            position: 'fixed',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        <CircularProgress sx={{ color: 'white' }} />
    </Box>
);

const LandingPage = dynamic(() => import('@/components/landing/LandingPage'), {
    ssr: false,
    loading: LoadingFallback
});
const SquaresPage = dynamic(() => import('@/components/board'), {
    ssr: false,
    loading: LoadingFallback
});

interface HomeProps {
    ogBoardName?: string | null;
    ogBoardId?: string | null;
    baseUrl: string;
}

export default function Home({ ogBoardName, ogBoardId, baseUrl }: HomeProps) {
    const { boardData, setBoardData } = useContext(AppContext);
    const { showSnackbar } = useAppServices();
    const [lastActiveTime, setLastActiveTime] = useState<Date | null>(null);

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
                const elapsedTime = lastActiveTime ? (currentTime.getTime() - lastActiveTime.getTime()) / (1000 * 60) : null;
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

    const ogTitle = ogBoardName ? `${ogBoardName} • Squares` : 'Squares • Digital Squares';
    const ogDescription = ogBoardName
        ? `Join the ${ogBoardName} board on Squares!`
        : 'The easiest way to play Squares with friends and family.';
    const pageTitle = boardData?.boardName ? `${boardData.boardName} • Squares` : ogTitle;
    const ogUrl = ogBoardId ? `${baseUrl}/?id=${ogBoardId}` : baseUrl;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Squares" />
                <meta property="og:url" content={ogUrl} />
                <meta property="og:image" content={`${baseUrl}/Squares_LogosOpenGraphImage_Text_Blue.png`} />
                <meta property="og:image:width" content="1201" />
                <meta property="og:image:height" content="631" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={ogDescription} />
                <meta name="twitter:image" content={`${baseUrl}/Squares_LogosTwitterCardImage_Text_Blue.png`} />
            </Head>
            <main>
                {boardData?.id ? <SquaresPage /> : <LandingPage />}
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ query }) => {
    const baseUrl = appConfig.baseUrl;
    const id = typeof query.id === 'string' ? query.id : null;
    if (!id) return { props: { baseUrl } };

    try {
        const boardName = await BoardModel.findNameById(id);
        return { props: { ogBoardName: boardName, ogBoardId: id, baseUrl } };
    } catch {
        return { props: { baseUrl } };
    }
};
