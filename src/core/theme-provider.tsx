import {createTheme} from '@mui/material/styles';

const theme = createTheme(({
    palette: {
        primary: {main: "#4f5b66"}
    },
    typography: {
        button: {
            textTransform: 'none',
            // margin:"3px"
        }
    }
}));

export default theme;
