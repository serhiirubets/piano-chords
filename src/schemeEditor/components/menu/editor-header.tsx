import {AppBar, IconButton, Theme, Toolbar, Typography} from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import {HelpDialog} from "../help-screen-short";
import {useGlobalStyles} from "../../../App";
import MenuIcon from '@mui/icons-material/Menu';
import {useTheme} from "@mui/styles";

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
    const theme = useTheme();
    const [isRightHandPanelOpen, setRightHandPanelOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setRightHandPanelOpen(true);
    };

    const handleDrawerClose = () => {
        setRightHandPanelOpen(false);
    };

    return (
        <div className={globalStyles.header}>

            {/*<AppBar position="sticky">*/}
            {/*    <Toolbar style={{width:"inherit"}}>*/}
            {/*        <IconButton*/}
            {/*            edge="start"*/}
            {/*            className={localClasses.menuButton}*/}
            {/*            color="inherit"*/}
            {/*            aria-label="menu"*/}
            {/*            size="large">*/}
            {/*            <HelpDialog iconColor="#e3e3e4"/>*/}
            {/*        </IconButton>*/}
            {/*        <WhiteTextTypography variant="h6" className={localClasses.title}>*/}
            {/*            {settings.fileName}*/}
            {/*        </WhiteTextTypography>*/}
            {/*    </Toolbar>*/}

            {/*<ScrollableTabsButtonAuto/>*/}
            {/*</AppBar>*/}
            <AppBar position="sticky" style={{marginLeft:"20px",boxShadow: "0px 10px 18px -5px #888888"}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        {settings.fileName}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}
