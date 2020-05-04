import React from 'react'
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles'

const themeDark = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
    },
    overrides: {
      MuiFormLabel: {
        root: {
          color: '#fff',
          '&$focused, &$error': {
            color: '#fff',
          },
        },
      },
      MuiInputBase: {
        input: {
          color: '#fff',
        },
      },
      MuiOutlinedInput: {
        root: {
          '& $notchedOutline': {
            borderColor: '#fff',
          },
          '&$focused $notchedOutline': {
            borderColor: '#fff',
          },
          '&$error $notchedOutline': {
            borderColor: '#f44336',
          },
        },
      },
      MuiFormHelperText: {
        root: {
          '&$error': {
            color: '#fff',
          },
        },
      },
    },
  }),
)

const ThemeProvider = ({ themeName = 'themeDark', children }) => {
  const theme = themes[themeName]
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

const themes = {
  themeDark: themeDark,
}

export default ThemeProvider
