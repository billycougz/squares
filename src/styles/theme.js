import { createTheme } from '@mui/material/styles';

const branding = {
	primary: '#1e40af', // Deep Blue
	secondary: '#0f172a', // Slate 900
	accent: '#3b82f6', // Bright Blue
	background: '#f8fafc', // Slate 50
	paper: '#ffffff',
	text: {
		primary: '#1e293b', // Slate 800
		secondary: '#64748b', // Slate 500
	},
	success: '#10b981',
	warning: '#f59e0b',
	error: '#ef4444',
};

export default createTheme({
	palette: {
		primary: {
			main: branding.primary,
			light: branding.accent,
			dark: '#1e3a8a',
			contrastText: '#ffffff',
		},
		secondary: {
			main: branding.secondary,
			contrastText: '#ffffff',
		},
		background: {
			default: branding.background,
			paper: branding.paper,
		},
		text: {
			primary: branding.text.primary,
			secondary: branding.text.secondary,
		},
		success: {
			main: branding.success,
		},
		warning: {
			main: branding.warning,
		},
		error: {
			main: branding.error,
		},
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: '2.5rem',
			fontWeight: 700,
			color: branding.text.primary,
		},
		h2: {
			fontSize: '2rem',
			fontWeight: 600,
			color: branding.text.primary,
		},
		h3: {
			fontSize: '1.75rem',
			fontWeight: 600,
		},
		h4: {
			fontSize: '1.5rem',
			fontWeight: 600,
		},
		h5: {
			fontSize: '1.25rem',
			fontWeight: 500,
		},
		h6: {
			fontSize: '1rem',
			fontWeight: 600,
			textTransform: 'uppercase',
			letterSpacing: '0.05em',
		},
		body1: {
			fontSize: '1rem',
			lineHeight: 1.5,
		},
		button: {
			textTransform: 'none',
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					scrollbarColor: "#6b6b6b #2b2b2b",
					"&::-webkit-scrollbar, & *::-webkit-scrollbar": {
						backgroundColor: "transparent",
						width: '8px',
						height: '8px',
					},
					"&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
						borderRadius: 8,
						backgroundColor: "#6b6b6b",
						minHeight: 24,
						border: "2px solid #2b2b2b",
					},
					"&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
						backgroundColor: "#959595",
					},
					"&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
						backgroundColor: "#959595",
					},
					"&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
						backgroundColor: "#959595",
					},
					"&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
						backgroundColor: "#2b2b2b",
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					padding: '8px 16px',
					boxShadow: 'none',
					'&:hover': {
						boxShadow: 'none',
					},
				},
				contained: {
					'&:hover': {
						boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
				},
				elevation1: {
					boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: 20,
				},
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: {
					fontFamily: '"Outfit", sans-serif',
					fontSize: '1.25rem',
					fontWeight: 700,
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					fontWeight: 600,
					backgroundColor: branding.background,
				},
			},
		},
	},
});
