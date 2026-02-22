import { Box, Paper, Tab, Tabs, useTheme, Typography } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaidIcon from '@mui/icons-material/Paid';
import TuneIcon from '@mui/icons-material/Tune';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useState } from 'react';
import AdminPanel from './AdminPanel';
import SummaryPanel from './SummaryPanel';
import NumbersPanel from './NumbersPanel';
import ResultsPanel from './ResultsPanel';

import SquaresGrid from './SquaresGrid';
import PaymentLink from './PaymentLink';

interface NonMobileViewProps {
    id: string;
    initials: string;
    setInitials: (initials: string) => void;
    boardName: string;
    setSnackbarMessage: (msg: string) => void;
    getLatestBoardData: () => Promise<void>;
    venmoUsername?: string;
    hasPaid: boolean;
    isAdmin: boolean;
    setView: (view: string) => void;
    boardData: any;
    squareMap: Record<string, number>;
    anchor?: string;
    boardUser: any;
    setShowPaymentDialog: (show: boolean) => void;
    clickMode: 'select' | 'remove' | 'result' | 'numbers' | 'finances' | 'update';
    setClickMode: (mode: 'select' | 'remove' | 'result' | 'numbers' | 'finances' | 'update') => void;
    setBoardData: (data: any) => void;
    highlightColor: string;
}

type PanelTab = 'summary' | 'numbers' | 'results' | 'admin';

export default function NonMobileView({
    id,
    initials,
    setInitials,
    boardName,
    setSnackbarMessage,
    getLatestBoardData,
    venmoUsername,
    hasPaid,
    isAdmin,
    setView,
    boardData,
    squareMap,
    anchor,
    boardUser,
    setShowPaymentDialog,
    clickMode,
    setClickMode,
    setBoardData,
    highlightColor
}: NonMobileViewProps) {
    const theme = useTheme();
    // Default to 'results' if anchored, otherwise 'summary'
    const [activeTab, setActiveTab] = useState<PanelTab>(anchor === 'results' ? 'results' : 'summary');

    return (
        <Box
            sx={{
                display: 'flex',
                height: 'calc(100vh - 67px)', // Assuming standard header height
                width: '100%',
                overflow: 'hidden',
                bgcolor: 'background.default',
            }}
        >
            {/* Left Segment: Detail Control Panel */}
            <Paper
                elevation={4}
                sx={{
                    width: 480,
                    flexShrink: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    zIndex: 2,
                    boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
                }}
            >
                {/* Pinned Header: Payment */}
                {venmoUsername && !isAdmin && !hasPaid && (
                    <Box sx={{ p: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.grey[50] }}>
                        <PaymentLink
                            venmoUsername={venmoUsername}
                            boardUser={boardUser}
                            hasPaid={hasPaid}
                            setShowPaymentDialog={setShowPaymentDialog}
                        />
                    </Box>
                )}

                {/* Sub-navigation Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 0, pt: 1 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, v) => setActiveTab(v as PanelTab)}
                        variant="fullWidth"
                        sx={{
                            minHeight: 72,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                minWidth: 'auto',
                                px: 1,
                                py: 1.5,
                            }
                        }}
                    >
                        <Tab label="Summary" value="summary" icon={<AssessmentIcon />} iconPosition="top" />
                        <Tab label="Numbers" value="numbers" icon={<FormatListNumberedIcon />} iconPosition="top" />
                        <Tab label="Results" value="results" icon={<PaidIcon />} iconPosition="top" />
                        {isAdmin && <Tab label="Admin" value="admin" icon={<TuneIcon />} iconPosition="top" />}
                    </Tabs>
                </Box>

                {/* Scrollable Content Area */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        p: 3,
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: theme.palette.divider,
                            borderRadius: '3px',
                        }
                    }}
                >
                    {/* Render active panel */}
                    {activeTab === 'summary' && (
                        <SummaryPanel
                            boardData={boardData}
                            initials={initials}
                            squareMap={squareMap}
                            onRefresh={getLatestBoardData}
                        />
                    )}

                    {activeTab === 'numbers' && (
                        <NumbersPanel
                            boardData={boardData}
                            initials={initials}
                            squareMap={squareMap}
                            onRefresh={getLatestBoardData}
                        />
                    )}

                    {activeTab === 'results' && (
                        <ResultsPanel
                            boardData={boardData}
                            initials={initials}
                            anchor={anchor}
                            onRefresh={getLatestBoardData}
                        />
                    )}

                    {activeTab === 'admin' && isAdmin && (
                        <AdminPanel setView={setView} setSnackbarMessage={setSnackbarMessage} />
                    )}
                </Box>
            </Paper>

            {/* Right Segment: The Hero Grid Canvas */}
            <Box
                sx={{
                    flexGrow: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    overflow: 'hidden', // Contain the grid entirely
                }}
            >
                {/* Admin Click Action Toggle (Directly Above Board) */}
                {isAdmin && (
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ mb: 1, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                            Admin Click Action
                        </Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                borderRadius: '16px',
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(12px)',
                                border: `1px solid rgba(0,0,0,0.08)`,
                                p: 0.5,
                            }}
                        >
                            <Tabs
                                value={clickMode}
                                onChange={(e, v) => setClickMode(v)}
                                sx={{
                                    minHeight: 40,
                                    '& .MuiTab-root': {
                                        minHeight: 40,
                                        borderRadius: '12px',
                                        py: 0,
                                        px: 3,
                                        fontWeight: 700,
                                        transition: 'all 0.2s ease',
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        display: 'none' // Hide default underline since we color the active pill
                                    }
                                }}
                            >
                                <Tab icon={<TouchAppIcon fontSize="small" />} iconPosition="start" label='Select Square' value='select' disableRipple />
                                <Tab icon={<DeleteOutlineIcon fontSize="small" />} iconPosition="start" label='Remove Square' value='remove' disableRipple />
                            </Tabs>
                        </Paper>
                    </Box>
                )}

                <SquaresGrid
                    initials={initials}
                    onUpdate={setBoardData}
                    setSnackbarMessage={setSnackbarMessage}
                    highlightColor={highlightColor}
                    clickMode={clickMode}
                />
            </Box>
        </Box>
    );
}
