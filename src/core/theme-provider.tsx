import {createTheme} from '@mui/material/styles';

const theme = createTheme(({
    palette: {
        primary: {main: "#4f5b66"}
    },
    typography: {
        button: {
            textTransform: 'none',
        },
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    }
}));

export default theme;
