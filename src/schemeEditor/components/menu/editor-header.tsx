import {IconButton, Theme, Toolbar, Typography} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import {HelpDialog} from "../help-screen-short";
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
    return (
        <div className={globalStyles.header}>
            {/*<AppBar position="sticky">*/}
                <Toolbar style={{width:"inherit"}}>
                    <IconButton
                        edge="start"
                        className={localClasses.menuButton}
                        color="inherit"
                        aria-label="menu"
                        size="large">
                        <HelpDialog iconColor="#e3e3e4"/>
                    </IconButton>
                    <WhiteTextTypography variant="h6" className={localClasses.title}>
                        {settings.fileName}
                    </WhiteTextTypography>
                </Toolbar>

            {/*<ScrollableTabsButtonAuto/>*/}
            {/*</AppBar>*/}
        </div>
    );
}
