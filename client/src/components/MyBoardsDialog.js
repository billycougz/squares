import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function MyBoardsDialog({ open, onClose, onSelectBoard }) {
    const [recentBoards, setRecentBoards] = useState([]);

    // Load recent boards from localStorage whenever the dialog opens
    useEffect(() => {
        if (open) {
            const boards = JSON.parse(localStorage.getItem('recent-squares') || '[]');
            setRecentBoards(boards);
        }
    }, [open]);


    const handleSelectBoard = (board) => {
        onSelectBoard(board);
        onClose();
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Recently accessed';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                My Boards
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                {recentBoards.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No recent boards found. Create or access a board to see it here.
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {recentBoards.map((board, index) => (
                            <React.Fragment key={board.id}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleSelectBoard(board)}>
                                        <ListItemText
                                            primary={board.boardName}
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(board.lastAccessed)}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < recentBoards.length - 1 && <Box sx={{ borderBottom: '1px solid #e0e0e0' }} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
}
