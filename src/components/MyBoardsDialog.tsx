'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StyledDialog from './StyledDialog';

interface Board {
    id: string;
    boardName: string;
    adminCode?: string;
    lastAccessed?: string | number | Date;
}

interface MyBoardsDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectBoard: (board: Board) => void;
}

function formatDate(timestamp?: string | number | Date): string {
    if (!timestamp) return 'Recently accessed';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

export default function MyBoardsDialog({ open, onClose, onSelectBoard }: MyBoardsDialogProps) {
    const [recentBoards, setRecentBoards] = useState<Board[]>([]);

    useEffect(() => {
        if (open) {
            const boards = JSON.parse(localStorage.getItem('recent-squares') || '[]');
            setRecentBoards(boards);
        }
    }, [open]);

    const handleSelectBoard = (board: Board) => {
        onSelectBoard(board);
        onClose();
    };

    if (!open) return null;

    return (
        <StyledDialog
            title="My Boards"
            titleIcon={<DashboardIcon sx={{ fontSize: 20 }} />}
            dismissible
            closeConfig={{ display: false, action: onClose }}
            maxWidth="sm"
            fullWidth
        >
            {recentBoards.length === 0 ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No recent boards found. Create or access a board to see it here.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {recentBoards.map((board) => (
                        <Box
                            key={board.id}
                            onClick={() => handleSelectBoard(board)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 1.5,
                                borderRadius: '14px',
                                cursor: 'pointer',
                                background: 'rgba(59, 130, 246, 0.04)',
                                border: '1px solid rgba(59, 130, 246, 0.08)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'rgba(59, 130, 246, 0.08)',
                                    border: '1px solid rgba(59, 130, 246, 0.15)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                },
                                '&:active': { transform: 'translateY(0)' },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: '10px',
                                    background: board.adminCode
                                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                        : 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                {board.adminCode ? (
                                    <AdminPanelSettingsIcon sx={{ fontSize: 18, color: 'white' }} />
                                ) : (
                                    <SportsFootballIcon sx={{ fontSize: 16, color: 'white' }} />
                                )}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontFamily: '"Outfit", sans-serif',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        color: 'text.primary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
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
                                                fontSize: '0.7rem',
                                                color: '#d97706',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Admin
                                        </Typography>
                                    )}
                                    {board.adminCode && board.lastAccessed && (
                                        <Typography component="span" sx={{ fontSize: '0.7rem', color: 'text.disabled', mx: 0.25 }}>
                                            •
                                        </Typography>
                                    )}
                                    {board.lastAccessed && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                            <AccessTimeIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontFamily: '"Outfit", sans-serif',
                                                    fontSize: '0.7rem',
                                                    color: 'text.secondary',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                {formatDate(board.lastAccessed)}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                        </Box>
                    ))}
                </Box>
            )}
        </StyledDialog>
    );
}
