import { createTheme, adaptV4Theme } from '@mui/material/styles';

const theme = createTheme(adaptV4Theme({
    typography: {
        button: {
            textTransform: 'none',
            // margin:"3px"
        }
    }
}));

export default theme;
