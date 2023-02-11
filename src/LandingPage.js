import { Button, FormControl, FormLabel, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function LandingPage({ onBoardLoaded }) {
	const [view, setView] = useState('Create');
	const [formData, setFormData] = useState({});

	const handleViewChange = () => {
		setView(view === 'Create' ? 'Load' : 'Create');
	};

	const handleLoad = () => {
		const initializeGrid = () => {
			const emptyValues = Array.from({ length: 11 });
			return emptyValues.map(() => [...emptyValues]);
		};
		onBoardLoaded({ gridData: initializeGrid() });
	};

	return (
		<div>
			<ToggleButtonGroup color='primary' value={view} exclusive onChange={handleViewChange} aria-label='Platform'>
				<ToggleButton value='Create'>Create New Squares</ToggleButton>
				<ToggleButton value='Load'>Load Existing Squares</ToggleButton>
			</ToggleButtonGroup>
			<br />
			<br />
			<div>
				<TextField
					label='Board Name'
					value={formData.name}
					helperText='The name participants use to access the Squares board'
				/>
				<br />
				<TextField
					label='User Code'
					value={formData.userCode}
					helperText='User code is what Squares participants use to access the Squares board'
				/>
				<br />
				<TextField
					label='Admin Code'
					value={formData.adminCode}
					helperText='Admin code is what the Squares admin uses to administer the Squares board'
				/>
				<br />
				<Button variant='contained' onClick={handleLoad}>
					{view}
				</Button>
			</div>
		</div>
	);
}
