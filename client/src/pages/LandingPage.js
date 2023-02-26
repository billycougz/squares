import { useEffect, useState } from 'react';
import {
	Button,
	Checkbox,
	FormControl,
	FormLabel,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	TextField,
} from '@mui/material';
import { useDocumentTitle } from 'usehooks-ts';
import { createBoard, loadBoard } from '../api';
import Loader from '../components/Loader';

export default function LandingPage({ onBoardLoaded, recentSquares }) {
	const [view, setView] = useState('select');
	const [formData, setFormData] = useState({ boardName: '', userCode: '', adminCode: '' });
	const [isLoading, setIsLoading] = useState(false);

	useDocumentTitle('Squares');

	useEffect(() => {
		const handleUrlParams = () => {
			const { searchParams } = new URL(document.location.href);
			if (searchParams.get('boardName') && searchParams.get('userCode')) {
				handleLoad({
					boardName: searchParams.get('boardName'),
					userCode: searchParams.get('userCode'),
					anchor: searchParams.get('anchor'),
				});
				window.history.replaceState({}, document.title, '/');
			}
		};
		handleUrlParams();
	}, []);

	const handleCreate = async () => {
		setIsLoading(true);
		delete formData.isAdmin;
		const boardData = await createBoard(formData);
		if (!boardData.error) {
			onBoardLoaded({ ...boardData, isAdmin: true });
		} else {
			alert(boardData.error);
		}
		setIsLoading(false);
	};

	const handleLoad = async (requestData) => {
		setIsLoading(true);
		const boardData = await loadBoard(requestData);
		if (boardData.error) {
			alert(boardData.error);
		} else {
			onBoardLoaded({ ...boardData, isAdmin: requestData.isAdmin, anchor: requestData.anchor });
		}
		setIsLoading(false);
	};

	const isSubmitDisabled =
		!formData.boardName ||
		(view === 'Create' && (!formData.adminCode || !formData.userCode)) ||
		(view === 'Load' && !formData.adminCode && !formData.userCode);

	return (
		<Paper sx={{ padding: '1em', width: 'fit-content', textAlign: 'center', margin: { xs: 'auto 5px', sm: 'auto' } }}>
			<Loader open={isLoading} />
			<Typography variant='h1'>Super Bowl LVII</Typography>
			{recentSquares.length ? (
				<FormControl fullWidth sx={{ margin: '1em 0' }} size='small'>
					<InputLabel>Recent Squares</InputLabel>
					<Select value='' label='Recent Squares'>
						{recentSquares.map((squaresData, index) => (
							<MenuItem
								key={`${squaresData.boardName}-${index}`}
								value={squaresData.boardName}
								onClick={() => handleLoad(squaresData)}
							>
								{squaresData.boardName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			) : (
				''
			)}
			<br />
			<ToggleButtonGroup color='primary' value={view} exclusive onChange={(e) => setView(e.target.value)}>
				<ToggleButton value='Create'>Create New Squares</ToggleButton>
				<ToggleButton value='Load'>Load Existing Squares</ToggleButton>
			</ToggleButtonGroup>
			<br />

			<br />
			{view !== 'select' && (
				<div>
					<TextField
						label='Squares Name'
						value={formData.boardName}
						helperText={view === 'Create' ? 'Create a name for your Squares board' : 'The name of your Squares board'}
						onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
						fullWidth
					/>
					<br />
					<br />
					{view === 'Load' && (
						<>
							<FormControl sx={{ flexDirection: 'row', alignItems: 'center', marginTop: '-1em' }}>
								<FormLabel>I am the admin</FormLabel>
								<Checkbox
									value={!!formData.isAdmin}
									onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
								/>
							</FormControl>
							<br />
						</>
					)}
					{(view === 'Create' || !formData.isAdmin) && (
						<>
							<TextField
								label='User Code'
								value={formData.userCode}
								helperText={
									view === 'Create'
										? 'Create a code to share with your participants'
										: 'The code required to access your Squares'
								}
								onChange={(e) =>
									setFormData({
										...formData,
										userCode: e.target.value,
										adminCode: view === 'Load' ? '' : formData.adminCode,
									})
								}
								fullWidth
							/>
							<br />
							<br />
						</>
					)}
					{(view === 'Create' || formData.isAdmin) && (
						<>
							<TextField
								label='Admin Code'
								value={formData.adminCode}
								helperText={
									view === 'Create'
										? 'Create a code that you will use as the admin'
										: 'The code required to administer your Squares'
								}
								onChange={(e) =>
									setFormData({
										...formData,
										adminCode: e.target.value,
										userCode: view === 'Load' ? '' : formData.userCode,
									})
								}
								fullWidth
							/>
							<br />
							<br />
						</>
					)}
					<Button
						fullWidth
						disabled={isSubmitDisabled}
						variant='contained'
						onClick={() => (view === 'Create' ? handleCreate() : handleLoad(formData))}
					>
						{view}
					</Button>
				</div>
			)}
		</Paper>
	);
}
