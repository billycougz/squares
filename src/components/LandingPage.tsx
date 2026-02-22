'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    Button,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Snackbar,
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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { nflTeams, NFLTeam } from '@/lib/constants';

const VISIBLE_BOARD_COUNT = 3;

type TabValue = 'boards' | 'create';

interface RecentBoard {
    id: string;
    boardName: string;
    adminCode?: string;
    lastAccessed?: number;
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

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), []);

    // Smart default: returning users see their boards, new users see the create form
    const hasRecentBoards = hasMounted && recentSquares.length > 0;
    const [activeTab, setActiveTab] = useState<TabValue>(hasRecentBoards ? 'boards' : 'create');
    const [showAllBoards, setShowAllBoards] = useState(false);

    // Update activeTab when hasMounted changes and we discover recent boards
    useEffect(() => {
        if (hasMounted && recentSquares.length > 0) {
            setActiveTab('boards');
        }
    }, [hasMounted, recentSquares.length]);

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
            lastAccessed: Date.now(),
        };
        const additionalRecentBoards = recentSquares.filter(({ id }) => id !== loadedBoard.id);
        setRecentSquares([mostRecentBoard, ...additionalRecentBoards]);
    }

    // --- Undo removal state ---
    const removedBoardRef = useRef<{ board: RecentBoard; index: number } | null>(null);
    const [undoSnackbarOpen, setUndoSnackbarOpen] = useState(false);

    function removeRecentBoard(e: React.MouseEvent, boardId: string) {
        e.stopPropagation();
        const index = recentSquares.findIndex(({ id }) => id === boardId);
        const board = recentSquares[index];
        if (index === -1 || !board) return;

        removedBoardRef.current = { board, index };
        const updated = recentSquares.filter(({ id }) => id !== boardId);
        setRecentSquares(updated);
        setUndoSnackbarOpen(true);
    }

    const handleUndoRemove = useCallback(() => {
        const removed = removedBoardRef.current;
        if (!removed) return;

        const restored = [...recentSquares];
        restored.splice(removed.index, 0, removed.board);
        setRecentSquares(restored);
        removedBoardRef.current = null;
        setUndoSnackbarOpen(false);
    }, [recentSquares, setRecentSquares]);

    const handleUndoSnackbarClose = () => {
        setUndoSnackbarOpen(false);
        removedBoardRef.current = null;
    };

    function formatLastAccessed(timestamp?: number): string {
        if (!timestamp) return '';
        const now = Date.now();
        const diffMs = now - timestamp;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(timestamp).toLocaleDateString();
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

    // --- Segmented Toggle ---
    const SegmentedToggle = () => (
        <Box
            sx={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '4px',
                mb: 3,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
            }}
        >
            {hasRecentBoards && (
                <Box
                    onClick={() => setActiveTab('boards')}
                    sx={{
                        flex: 1,
                        py: 1.2,
                        textAlign: 'center',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        letterSpacing: '0.02em',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: activeTab === 'boards'
                            ? 'rgba(255, 255, 255, 0.95)'
                            : 'transparent',
                        color: activeTab === 'boards'
                            ? theme.palette.primary.dark
                            : 'rgba(255, 255, 255, 0.7)',
                        boxShadow: activeTab === 'boards'
                            ? '0 4px 12px rgba(0,0,0,0.15)'
                            : 'none',
                        '&:hover': {
                            background: activeTab === 'boards'
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'rgba(255, 255, 255, 0.08)',
                        },
                    }}
                >
                    My Boards
                </Box>
            )}
            <Box
                onClick={() => setActiveTab('create')}
                sx={{
                    flex: 1,
                    py: 1.2,
                    textAlign: 'center',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.02em',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: activeTab === 'create'
                        ? 'rgba(255, 255, 255, 0.95)'
                        : 'transparent',
                    color: activeTab === 'create'
                        ? theme.palette.primary.dark
                        : 'rgba(255, 255, 255, 0.7)',
                    boxShadow: activeTab === 'create'
                        ? '0 4px 12px rgba(0,0,0,0.15)'
                        : 'none',
                    '&:hover': {
                        background: activeTab === 'create'
                            ? 'rgba(255, 255, 255, 0.95)'
                            : 'rgba(255, 255, 255, 0.08)',
                    },
                }}
            >
                New Board
            </Box>
        </Box>
    );

    // --- Board Cards List ---
    const visibleBoards = showAllBoards ? recentSquares : recentSquares.slice(0, VISIBLE_BOARD_COUNT);
    const hasMoreBoards = recentSquares.length > VISIBLE_BOARD_COUNT;

    const BoardsList = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {visibleBoards.map((board, index) => (
                <Box
                    key={`${board.id}-${index}`}
                    onClick={() => handleLoad(board)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        padding: '14px 16px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.14)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            background: board.adminCode
                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {board.adminCode ? (
                            <AdminPanelSettingsIcon sx={{ fontSize: 20, color: 'white' }} />
                        ) : (
                            <SportsFootballIcon sx={{ fontSize: 18, color: 'white' }} />
                        )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                color: 'white',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'left',
                            }}
                        >
                            {board.boardName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            {board.adminCode && (
                                <Typography
                                    component="span"
                                    sx={{
                                        fontFamily: '"Outfit", sans-serif',
                                        fontSize: '0.72rem',
                                        color: '#fbbf24',
                                        fontWeight: 500,
                                    }}
                                >
                                    Admin
                                </Typography>
                            )}
                            {board.adminCode && board.lastAccessed && (
                                <Typography
                                    component="span"
                                    sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', mx: 0.25 }}
                                >
                                    •
                                </Typography>
                            )}
                            {board.lastAccessed && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                    <AccessTimeIcon sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontFamily: '"Outfit", sans-serif',
                                            fontSize: '0.72rem',
                                            color: 'rgba(255,255,255,0.5)',
                                            fontWeight: 400,
                                        }}
                                    >
                                        {formatLastAccessed(board.lastAccessed)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box
                        onClick={(e) => removeRecentBoard(e, board.id)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: '8px',
                            flexShrink: 0,
                            opacity: { xs: 0.4, md: 0 },
                            transition: 'all 0.15s ease',
                            '&:hover': {
                                opacity: '1 !important',
                                background: 'rgba(255,255,255,0.1)',
                            },
                            // Show on parent hover (desktop)
                            '.MuiBox-root:hover > &': {
                                opacity: 0.4,
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                    </Box>
                    <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }} />
                </Box>
            ))}

            {/* View all / Collapse toggle */}
            {hasMoreBoards && (
                <Box
                    onClick={() => setShowAllBoards(!showAllBoards)}
                    sx={{
                        textAlign: 'center',
                        py: 1,
                        cursor: 'pointer',
                        opacity: 0.6,
                        transition: 'opacity 0.2s ease',
                        '&:hover': { opacity: 1 },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#60a5fa',
                        }}
                    >
                        {showAllBoards
                            ? 'Show less'
                            : `View all (${recentSquares.length})`}
                    </Typography>
                </Box>
            )}
        </Box>
    );

    // --- Create Board Form ---
    const CreateBoardForm = () => (
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
    );

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
            {showInfo && <LandingInfoDialog onClose={() => setShowInfo(false)} />}
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
                    {/* Segmented Toggle - only show when there are recent boards */}
                    {hasRecentBoards && <SegmentedToggle />}

                    {/* Tab Content */}
                    <Box
                        sx={{
                            transition: 'opacity 0.2s ease',
                            opacity: 1,
                        }}
                    >
                        {activeTab === 'boards' && hasRecentBoards ? (
                            <BoardsList />
                        ) : (
                            <CreateBoardForm />
                        )}
                    </Box>

                    {/* "How it works" — always accessible at the bottom */}
                    <Box
                        onClick={() => setShowInfo(true)}
                        sx={{
                            mt: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            opacity: 0.6,
                            transition: 'opacity 0.2s ease',
                            '&:hover': { opacity: 1 },
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: 'white',
                                textDecoration: 'underline',
                                textDecorationColor: 'rgba(255,255,255,0.3)',
                                textUnderlineOffset: '3px',
                            }}
                        >
                            How it works
                        </Typography>
                    </Box>
                </FadeContainer>
            </Box>

            {/* Undo removal snackbar */}
            <Snackbar
                open={undoSnackbarOpen}
                autoHideDuration={5000}
                onClose={handleUndoSnackbarClose}
                message="Board removed"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                action={
                    <Button
                        size="small"
                        onClick={handleUndoRemove}
                        sx={{
                            color: '#60a5fa',
                            fontWeight: 700,
                            fontFamily: '"Outfit", sans-serif',
                            textTransform: 'none',
                        }}
                    >
                        Undo
                    </Button>
                }
                sx={{
                    '& .MuiSnackbarContent-root': {
                        borderRadius: '12px',
                        fontFamily: '"Outfit", sans-serif',
                    },
                }}
            />
        </Box>
    );
}
