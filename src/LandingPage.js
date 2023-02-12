import {
	Button,
	Checkbox,
	FormControl,
	FormLabel,
	Paper,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { createBoard, loadBoard } from './api';

export default function LandingPage({ onBoardLoaded }) {
	const [view, setView] = useState('select');
	const [formData, setFormData] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);

	const handleViewChange = (e) => {
		const { value } = e.target;
		setView(value);
	};

	const handleCreate = async () => {
		const initializeGrid = () => {
			const emptyValues = Array.from({ length: 11 });
			return emptyValues.map(() => [...emptyValues]);
		};
		const boardData = await createBoard({ gridData: initializeGrid(), ...formData });
		if (!boardData.error) {
			onBoardLoaded({ boardData, isAdmin });
		} else {
			alert(boardData.error);
		}
	};

	const handleLoad = async () => {
		const boardData = await loadBoard(formData);
		onBoardLoaded({ boardData, isAdmin });
	};

	return (
		<Paper sx={{ padding: '1em', width: 'fit-content', textAlign: 'center', margin: 'auto' }}>
			<Typography variant='h1'>Super Bowl LVII</Typography>
			<br />
			<ToggleButtonGroup color='primary' value={view} exclusive onChange={handleViewChange} aria-label='Platform'>
				<ToggleButton value='Create'>Create New Squares</ToggleButton>
				<ToggleButton value='Load'>Load Existing Squares</ToggleButton>
			</ToggleButtonGroup>
			<br />
			<br />
			{view !== 'select' && (
				<div>
					<TextField
						label='Name'
						value={formData.boardName}
						helperText='The name participants use to access the Squares board'
						onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
						sx={{ width: '408px' }}
					/>
					<br />
					<br />
					{view === 'Load' && (
						<>
							<FormControl sx={{ flexDirection: 'row', alignItems: 'center', marginTop: '-1em' }}>
								<FormLabel>I am the admin</FormLabel>
								<Checkbox onChange={(e) => setIsAdmin(!isAdmin)} />
							</FormControl>
							<br />
						</>
					)}
					{(view === 'Create' || !isAdmin) && (
						<>
							<TextField
								label='User Code'
								value={formData.userCode}
								helperText='The code participants use to access the Squares board'
								onChange={(e) => setFormData({ ...formData, userCode: e.target.value })}
								sx={{ width: '408px' }}
							/>
							<br />
							<br />
						</>
					)}
					{(view === 'Create' || isAdmin) && (
						<>
							<TextField
								label='Admin Code'
								value={formData.adminCode}
								helperText='The code you use to administer the Squares board'
								onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
								sx={{ width: '408px' }}
							/>
							<br />
							<br />
						</>
					)}
					<Button
						disabled={
							!formData.boardName ||
							(view === 'Create' && (!formData.adminCode || !formData.userCode)) ||
							(view === 'Load' && !formData.adminCode && !formData.userCode)
						}
						variant='contained'
						onClick={() => (view === 'Create' ? handleCreate() : handleLoad())}
					>
						{view}
					</Button>
				</div>
			)}
		</Paper>
	);
}
