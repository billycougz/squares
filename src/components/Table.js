import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function CustomTable({ headers, rows, initials, highlightProperty }) {
	const getColor = (row) => (row[highlightProperty] === initials ? '#1876d1' : '');
	return (
		<Table size='small'>
			<TableHead>
				<TableRow>
					{headers.map((header) => (
						<TableCell>{header}</TableCell>
					))}
				</TableRow>
			</TableHead>

			<TableBody>
				{rows.map((row) => (
					<TableRow key={JSON.stringify(row)}>
						{headers.map((header) => (
							<TableCell key={`${JSON.stringify(row)}-${row[header]}`} sx={{ color: getColor(row) }}>
								{row[header]}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
