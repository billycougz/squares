import { TableContainer } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function CustomTable({ headers, rows, initials, highlightProperty }) {
	const getColor = (row) => (highlightProperty ? (row[highlightProperty] === initials ? '#1876d1' : '') : '');
	// The parent component can prevent a conditional attribute from rendering by passing a falsy header value
	const headerValues = headers.filter((header) => header);
	return (
		<TableContainer>
			<Table size='small'>
				<TableHead>
					<TableRow>
						{headerValues.map((header) => (
							<TableCell>{header}</TableCell>
						))}
					</TableRow>
				</TableHead>

				<TableBody>
					{rows.map((row, index) => (
						<TableRow key={`${row[headers[0]]}-${index}`}>
							{headerValues.map((header) => (
								<TableCell key={`${header}-${row[header]}`} sx={{ color: getColor(row) }}>
									{row[header]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
