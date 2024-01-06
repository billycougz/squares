import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';

export default function ResultsDialog({ onClose, onSave, gridData, teams, results }) {
	const [scores, setScores] = useState({ horizontal: 0, vertical: 0 });
	const firstEmptyQuarter = results.findIndex((result) => !result.scores);
	const [quarterIndex, setQuarterIndex] = useState(firstEmptyQuarter >= 0 ? firstEmptyQuarter : 3);

	useEffect(() => {
		setScores({
			horizontal: results[quarterIndex].scores?.horizontal || 0,
			vertical: results[quarterIndex].scores?.vertical || 0,
		});
	}, [quarterIndex]);

	const handleChange = (e, side) => {
		const { value } = e.target;
		setScores({ ...scores, [side]: value });
	};

	const getLastDigit = (number) => {
		return Math.abs(number) % 10;
	};

	function getResultCell() {
		const rowValue = getLastDigit(scores.vertical);
		const rowIndex = gridData[0].indexOf(rowValue);
		const colValue = getLastDigit(scores.horizontal);
		const colIndex = gridData.findIndex((row) => row[0] === colValue);
		return [rowIndex, colIndex];
	}

	const handleSave = () => {
		const cell = getResultCell();
		onSave({ quarterIndex, scores, cell });
	};

	return (
		<Dialog open={true} onClose={onClose} fullWidth>
			<DialogTitle>Enter Results</DialogTitle>
			<DialogContent>
				<RadioGroup row value={quarterIndex} onChange={(e) => setQuarterIndex(e.target.value)}>
					{['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => (
						<FormControlLabel key={quarter} value={index} control={<Radio />} label={quarter} />
					))}
				</RadioGroup>
				<br />
				<TextField
					value={scores.horizontal || ''}
					onChange={(e) => handleChange(e, 'horizontal')}
					size='small'
					label={teams.horizontal.name}
					type='number'
					InputProps={{
						inputProps: {
							min: '0',
							inputMode: 'numeric',
						},
					}}
				/>

				<br />
				<br />
				<TextField
					value={scores.vertical || ''}
					onChange={(e) => handleChange(e, 'vertical')}
					size='small'
					label={teams.vertical.name}
					type='number'
					InputProps={{
						inputProps: {
							min: '0',
							inputMode: 'numeric',
						},
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} disabled={!scores}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
