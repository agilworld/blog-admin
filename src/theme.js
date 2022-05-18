
import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#18A0FB',

    },
    secondary: {
      main: '#FFCC56',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  overrides:{
    MuiButton:{
      containedPrimary:{
        color:"#fff"
      },
      containedSizeLarge:{
        padding:'14px 22px'
      }
    },
    MuiAppBar:{
      colorPrimary:{
        color:"#fff"
      }
    }
  }
});

export default theme;