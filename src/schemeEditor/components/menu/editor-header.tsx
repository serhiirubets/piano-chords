import {createStyles, IconButton, makeStyles, Theme, Toolbar, Typography, withStyles} from "@material-ui/core";
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import {HelpDialog} from "../help-screen-short";
import {PlaybackModule} from "./playback-module";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import {ScrollableTabs} from "../tabpanel/tab-panel";
import {useGlobalStyles} from "../../../App";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    const {settings} = useContext(SettingsContext);
    const localClasses = useStyles();
    const globalStyles = useGlobalStyles();
    return (<div className={globalStyles.header}>
        {/*<AppBar position="sticky">*/}
            <Toolbar style={{width:"inherit"}}>
                <IconButton edge="start" className={localClasses.menuButton} color="inherit"
                            aria-label="menu">
                    <HelpDialog iconColor="#e3e3e4"/>
                </IconButton>
                <WhiteTextTypography variant="h6" className={localClasses.title}>
                    {settings.fileName}
                </WhiteTextTypography>
                <PlaybackModule iconColor="#e3e3e4"/>
            </Toolbar>

        {/*<ScrollableTabsButtonAuto/>*/}
        {/*</AppBar>*/}
    </div>)
}
