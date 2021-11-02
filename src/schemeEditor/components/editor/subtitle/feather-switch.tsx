import { Switch } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import {blue, red} from "@mui/material/colors";

export const FeatherSwitch = withStyles({
    switchBase: {
        color: red[500],
        '&$checked': {
            color: blue[500],
        },
        '&$checked + $track': {
            backgroundColor: blue[300],
        },
    },
    checked: {},
    track: {color: red[500],},
})(Switch);
