import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { deepOrange, orange } from '@material-ui/core/colors'

export const darkTheme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: orange[500],
		},
		secondary: {
			main: deepOrange[900],
		},
	},
	overrides: {
		MuiFormGroup: {
			row: {
				margin: '10px',
			},
		},
		MuiFormControlLabel: {
			label: {
				fontSize: '0.875rem',
			},
		},
		MuiButton: {
			root: {
				minWidth: '100px',
				border: '1px solid #ff9800',
				margin: '0px',
				color: orange[500],
			},
		},
	},
})
