'use client';

import { useContext, useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Typography,
    TextField,
    Box,
    FormGroup,
    InputBase,
    InputAdornment,
    useTheme,
    SelectChangeEvent,
} from '@mui/material';
import { useDocumentTitle, useLocalStorage } from 'usehooks-ts';
import { createBoard, loadBoard } from '@/lib/api';
import Loader from '@/components/Loader';
import styled from '@emotion/styled';
import LandingInfoDialog from '@/components/LandingInfoDialog';
import { MuiTelInput } from 'mui-tel-input';
import PhoneNumberWarning from '@/components/PhoneNumberWarning';
import AppContext from '@/contexts/AppContext';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { nflTeams, NFLTeam } from '@/lib/constants';

interface RecentBoard {
    id: string;
    boardName: string;
    adminCode?: string;
}

interface FadeContainerProps {
    $fadeIn: boolean;
}

const FadeContainer = styled.div<FadeContainerProps>`
	opacity: ${({ $fadeIn }) => ($fadeIn ? 1 : 0)};
	transition: opacity 0.6s ease-out;
	position: relative;
	width: 100%;
	max-width: 450px;
	margin: -35px auto 0;
	padding: 0 20px;
	margin-bottom: 100px;
	box-sizing: border-box;

	@media (min-width: 900px) {
		margin: 0;
		text-align: left;
	}
`;

const TitleContainer = styled.div`
	padding: 5px 0 0;
	width: 100%;
	max-width: 100%;
	overflow: hidden;
	box-sizing: border-box;
	
	@media (min-width: 900px) {
		padding: 0;
		text-align: left;
	}

	img {
		display: block;
		margin: 0 auto;
		width: 100%;
		max-width: 280px;
		filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));

		@media (min-width: 900px) {
			max-width: 350px;
			margin: 0;
		}
	}
`;

const FormCard = styled(Paper)`
	background: rgba(255, 255, 255, 0.95) !important;
	backdrop-filter: blur(10px);
	border-radius: 24px !important;
	padding: 24px !important;
	box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
	border: 1px solid rgba(255, 255, 255, 0.3) !important;
	text-align: left;
	width: 100%;
	box-sizing: border-box;
`;

const RecentBoardsCard = styled(Paper)`
	background: rgba(255, 255, 255, 0.1) !important;
	backdrop-filter: blur(10px);
	border-radius: 20px !important;
	padding: 16px !important;
	border: 1px solid rgba(255, 255, 255, 0.2) !important;
	margin-bottom: 24px !important;
	color: white !important;
	width: 100%;
	box-sizing: border-box;
`;

interface FormData {
    boardName: string;
    phoneNumber: string;
    teams: {
        horizontal: NFLTeam | undefined;
        vertical: NFLTeam | undefined;
    };
    test?: boolean;
}

interface FormErrors {
    boardName?: boolean;
    phoneNumber?: boolean;
}

export default function LandingPage() {
    const theme = useTheme();
    useDocumentTitle('Squares • Digital Football Squares');

    const { setBoardData, setBoardUser } = useContext(AppContext);

    const [recentSquares, setRecentSquares] = useLocalStorage<RecentBoard[]>('recent-squares', []);

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showPhoneNumberWarning, setShowPhoneNumberWarning] = useState(false);
    const [games, setGames] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState<any>(null);

    const [formData, setFormData] = useState<FormData>({
        boardName: '',
        phoneNumber: '',
        teams: {
            horizontal: nflTeams.find((team) => team.default === 'horizontal'),
            vertical: nflTeams.find((team) => team.default === 'vertical'),
        },
    });

    const fetchConfig = async () => {
        const gistUrl = 'https://api.github.com/gists/150875f37c1e5ecf493794eefd168278';
        try {
            const gist = await fetch(gistUrl).then((res) => res.json());
            const gistContent = gist?.files['squares-config.json']?.content;
            if (gistContent) {
                handleConfig(gistContent);
            }
        } catch (error) {
            console.error('Failed to fetch config:', error);
        }
    };

    const handleConfig = (gistContent: string) => {
        const { games } = JSON.parse(gistContent);
        if (games && games.length) {
            const { teams } = games[0];
            setGames(games);
            setSelectedGame(games[0]);
            updateSelectedTeams(teams);
        }
    };

    const updateSelectedTeams = (teams: { horizontal: string; vertical: string }) => {
        const horizontal = nflTeams.find((team) => team.code === teams?.horizontal);
        const vertical = nflTeams.find((team) => team.code === teams?.vertical);
        if (horizontal && vertical) {
            setFormData((prevState) => ({
                ...prevState,
                teams: {
                    horizontal,
                    vertical,
                },
            }));
        }
    };

    function updateRecentSquares(loadedBoard: any, adminCode?: string) {
        const mostRecentBoard: RecentBoard = {
            id: loadedBoard.id,
            boardName: loadedBoard.boardName,
            adminCode: adminCode,
        };
        const additionalRecentBoards = recentSquares.filter(({ id }) => id !== loadedBoard.id);
        setRecentSquares([mostRecentBoard, ...additionalRecentBoards]);
    }

    function handleBoardReady({ boardData, adminCode, adminPhoneNumber, anchor }: any) {
        const recentBoard = recentSquares.find(({ id }) => id === boardData.id);
        adminCode = adminCode || recentBoard?.adminCode;
        if (!adminCode) {
            delete boardData.adminCode;
        }
        updateRecentSquares(boardData, adminCode);
        setBoardUser({ isAdmin: Boolean(adminCode), adminPhoneNumber });
        setBoardData({ ...boardData, anchor });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleLoad({ id, adminCode, anchor }: { id: string; adminCode?: string; anchor?: string }) {
        setIsLoading(true);
        const boardData = await loadBoard({ id, adminCode });
        if (boardData.error) {
            alert(boardData.error);
        } else {
            handleBoardReady({ boardData, adminCode, anchor });
        }
        setIsLoading(false);
    }

    async function handleCreate() {
        setIsLoading(true);
        const boardData = await createBoard(formData);
        const { error, subscribedPhoneNumber } = boardData;
        if (!error) {
            handleBoardReady({
                boardData,
                adminCode: boardData.adminCode,
                adminPhoneNumber: subscribedPhoneNumber,
            });
        } else {
            alert(boardData.error);
        }
        setIsLoading(false);
    }

    async function handleCreateClick() {
        const errors: FormErrors = {
            boardName: !Boolean(formData.boardName),
            phoneNumber: !phoneIsValidOrEmpty(formData.phoneNumber),
        };
        if (Object.values(errors).some((value) => value)) {
            setFormErrors(errors);
            return;
        }
        if (!formData.phoneNumber) {
            setShowPhoneNumberWarning(true);
            return;
        }
        handleCreate();
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchConfig();
        const handleUrlParams = () => {
            const { searchParams } = new URL(document.location.href);
            const id = searchParams.get('id');
            const adminCode = searchParams.get('adminCode');
            const anchor = searchParams.get('anchor');

            if (id) {
                handleLoad({
                    id,
                    adminCode: adminCode || undefined,
                    anchor: anchor || undefined,
                });
                window.history.replaceState({}, document.title, '/');
            }

            const wpc = searchParams.get('wpc');
            const phoneNumber = searchParams.get('phoneNumber');
            if (wpc) {
                setFormData({
                    ...formData,
                    boardName: new Date().toLocaleString(),
                    phoneNumber: phoneNumber || '',
                    test: true,
                });
            }
        };
        handleUrlParams();
        setFadeIn(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGameChange = (e: SelectChangeEvent<string>) => {
        const game = games.find((game) => game.title === e.target.value);
        if (game) {
            updateSelectedTeams(game.teams);
            setSelectedGame(game);
        }
    };

    const phoneIsValidOrEmpty = (value: string) => {
        return !value || (value && value.length === 15);
    };

    const handlePhoneNumberWarningClose = (proceed?: boolean) => {
        if (proceed) {
            handleCreate();
        }
        setShowPhoneNumberWarning(false);
    };

    const updateFormField = (field: keyof FormData, value: any) => {
        if (field === 'phoneNumber' && value === '+1') {
            value = '';
        }
        setFormData({ ...formData, [field]: value });
        setFormErrors({ ...formErrors, [field]: false });
    };

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), []);

    return (
        <Box
            sx={{
                textAlign: 'center',
                borderRadius: '0',
                background: 'radial-gradient(circle at top left, #1e40af, #1e3a8a, #172554)',
                color: 'white',
                minHeight: '100vh',
                height: '100dvh',
                overflowY: 'auto',
                overflowX: 'hidden',
                position: 'fixed',
                width: '100%',
                top: 0,
                left: 0,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
                    opacity: 0.05,
                    pointerEvents: 'none'
                }
            }}
        >
            <Loader open={isLoading} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    px: { xs: 0, md: 8 },
                    py: { xs: 0, md: 4 },
                    gap: { xs: 0, md: 12 },
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: '100vw',
                    boxSizing: 'border-box'
                }}
            >
                <Box sx={{
                    textAlign: { xs: 'center', md: 'left' },
                    maxWidth: { xs: '100%', md: 500 },
                    width: '100%',
                    px: { xs: 2, md: 0 },
                    boxSizing: 'border-box'
                }}>
                    <TitleContainer>
                        <img src='/Squares_SiteLogo.svg' alt='Squares Logo' />
                    </TitleContainer>
                    <Typography
                        variant="h4"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 400,
                            color: 'white',
                            opacity: 0.9,
                            mt: 2,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2
                        }}
                    >
                        The easiest way to play<br />
                        <Box component="span" sx={{ fontWeight: 800, color: '#60a5fa' }}>Football Squares</Box> with friends.
                    </Typography>
                </Box>

                <FadeContainer $fadeIn={fadeIn}>
                    {showInfo && <LandingInfoDialog onClose={() => setShowInfo(false)} />}

                    {hasMounted && recentSquares.length > 0 ? (
                        <RecentBoardsCard>
                            <Typography
                                variant='overline'
                                sx={{
                                    opacity: 0.8,
                                    display: 'block',
                                    textAlign: 'left',
                                    mb: 1.5,
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    fontFamily: '"Outfit", sans-serif'
                                }}
                            >
                                Your Recent Boards
                            </Typography>
                            <FormControl fullWidth size='small'>
                                <Select
                                    value=''
                                    displayEmpty
                                    renderValue={() => <span style={{ color: 'white' }}>Select a recent board...</span>}
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                        '& .MuiSvgIcon-root': { color: 'white' }
                                    }}
                                >
                                    {recentSquares.map((squaresData, index) => (
                                        <MenuItem
                                            key={`${squaresData.id}-${index}`}
                                            value={squaresData.boardName}
                                            onClick={() => handleLoad(squaresData)}
                                        >
                                            {squaresData.boardName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </RecentBoardsCard>
                    ) : (
                        <Button
                            variant='outlined'
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.3)',
                                borderRadius: '12px',
                                textTransform: 'none',
                                mb: 3,
                                width: '100%',
                                py: 1.2,
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                fontFamily: '"Outfit", sans-serif',
                                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                            }}
                            onClick={() => setShowInfo(true)}
                        >
                            How it works
                        </Button>
                    )}

                    <FormCard>
                        <Typography
                            variant='h5'
                            sx={{
                                color: theme.palette.primary.dark,
                                fontWeight: 800,
                                mb: 3,
                                fontSize: '1.5rem',
                                letterSpacing: '-0.02em',
                                fontFamily: '"Outfit", sans-serif'
                            }}
                        >
                            Create New Board
                        </Typography>

                        {Boolean(games?.length) && (
                            <FormControl fullWidth>
                                <Select
                                    value={selectedGame?.title || ''}
                                    onChange={handleGameChange}
                                    sx={{
                                        color: theme.palette.primary.dark,
                                        background: theme.palette.background.default,
                                        mb: '20px',
                                        fontSize: '14px',
                                        borderRadius: '12px',
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        padding: '4px',
                                    }}
                                    input={
                                        <InputBase
                                            startAdornment={
                                                <InputAdornment position='start' sx={{ ml: 1 }}>
                                                    <TaskAltIcon color="primary" sx={{ fontSize: '20px' }} />
                                                </InputAdornment>
                                            }
                                        />
                                    }
                                >
                                    {games.map((game) => (
                                        <MenuItem key={game.title} value={game.title}>
                                            {game.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormGroup>
                            <TextField
                                label='Board Name'
                                value={formData.boardName}
                                placeholder='e.g. Super Bowl LIX'
                                error={formErrors.boardName}
                                onChange={(e) => updateFormField('boardName', e.target.value)}
                                fullWidth
                                variant='outlined'
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: theme.palette.background.default
                                    }
                                }}
                            />

                            {showPhoneNumberWarning && <PhoneNumberWarning onClose={handlePhoneNumberWarningClose} />}
                            <MuiTelInput
                                placeholder='Phone Number'
                                defaultCountry='US'
                                forceCallingCode
                                disableDropdown
                                value={formData.phoneNumber}
                                error={formErrors.phoneNumber}
                                onChange={(value) => updateFormField('phoneNumber', value)}
                                fullWidth
                                sx={{
                                    margin: '16px 0',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: theme.palette.background.default
                                    }
                                }}
                            />

                            <Typography variant='caption' sx={{ color: theme.palette.text.secondary, mb: 3, display: 'block', px: 1 }}>
                                We&apos;ll text you a link to your board and notify you when the game starts.
                            </Typography>

                            <Button
                                fullWidth
                                variant='contained'
                                onClick={handleCreateClick}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontFamily: '"Outfit", sans-serif',
                                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                                    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                                    '&:hover': {
                                        background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    }
                                }}
                            >
                                Create Board
                            </Button>
                        </FormGroup>
                    </FormCard>
                </FadeContainer>
            </Box>
        </Box>
    );
}
