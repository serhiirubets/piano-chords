import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
    AppBar,
    Button,
    Checkbox, createStyles,
    FormControlLabel,
    Grid,
    IconButton, makeStyles,
    TextField, Theme,
    Toolbar,
    Typography, withStyles
} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import Accordion from "@material-ui/core/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";
import {QuadratsContext} from "../../context/quadrats-context";
import html2canvas from "html2canvas";
import {ImageCompression, jsPDF} from "jspdf";
import {PRINTABLE_AREA_ID} from "../../model/global-constants";
import {HelpDialog} from "../help-screen-short";
import {PlaybackModule} from "./playback-module";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            top: 0,
            left:30,
            position:"fixed",
            paddingLeft:10,
            paddingRight:10,
            width: 'inherit',
            boxShadow: "0px 10px 18px -5px #888888",
            zIndex:5,
            backgroundColor: "#D65F24",
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);


const WhiteTextTypography = withStyles({
    root: {
        color: "#e3e3e4"
    }
})(Typography);

export const EditorHeader = () => {
    const localClasses = useStyles();

    return (<div className={localClasses.root}>
        {/*<AppBar position="sticky">*/}
            <Toolbar style={{width:"inherit"}}>
                <IconButton edge="start" className={localClasses.menuButton} color="inherit"
                            aria-label="menu">
                    <HelpDialog iconColor="#e3e3e4"/>
                </IconButton>
                <WhiteTextTypography variant="h6" className={localClasses.title}>
                    Редактор блок-схем
                </WhiteTextTypography>
                <PlaybackModule iconColor="#e3e3e4"/>
            </Toolbar>
        {/*</AppBar>*/}
    </div>)
}
