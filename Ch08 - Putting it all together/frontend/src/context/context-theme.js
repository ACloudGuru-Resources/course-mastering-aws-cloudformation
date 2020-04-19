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
      // MuiCssBaseline: {
      //   '@global': {
      //     // html: { overflowX: 'hidden' },
      //     // body: { overflowX: 'hidden' },
      //     '@font-face': [PublicaSansRegular, PublicaSansMedium, KlickBold],
      //   },
      // },
      // MuiTooltip: {
      //   tooltip: {
      //     backgroundColor: '#000',
      //   },
      //   arrow: {
      //     color: '#000',
      //   },
      // },
      // MuiAppBar: {
      //   colorPrimary: {
      //     backgroundColor: '#f6f5f5',
      //   },
      // },
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
