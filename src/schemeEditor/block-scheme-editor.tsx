import React, {useContext} from "react"
import {SettingsPanel} from "./components/menu/settings-panel";
import {SettingsContext} from "./context/settings-context";
import {BlockSchemeWhitePage} from "./block-scheme-page";
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';


const drawerWidth = 380

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
    open?: boolean;
}>(({theme, open}) => ({
    flexGrow: 1,
    width: "100%",
    // padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    }),
}));


const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-start',
    height: "66px"
}));

export const BlockSchemeEditor = () => {
    const {settings, partialUpdateSettings} = useContext(SettingsContext)
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        partialUpdateSettings({isMenuOpen: true})
        setOpen(true);
    };

    const handleDrawerClose = () => {
        partialUpdateSettings({isMenuOpen: false})
        setOpen(false);
    };
    return (
        <div style={{flexDirection: "row", display: "flex", width: "95vw", maxWidth: "100%", backgroundColor: "white"}}>
                    <Box style={{width: "100%"}}>
                        <AppBar position="fixed" style={{boxShadow: "0px 10px 18px -5px #888888"}} open={open}>
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="toggle mode"
                                    edge="start"
                                    onClick={() => {partialUpdateSettings({isMasteringMode:!settings.isMasteringMode})}}
                                >
                                    {settings.isMasteringMode? <GridViewRoundedIcon/> : <SortRoundedIcon/>}
                                </IconButton>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                                >
                                    {settings.fileName}
                                </Typography>

                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="end"
                                    onClick={handleDrawerOpen}
                                    sx={{...(open && {display: 'none'})}}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            </Toolbar>
                        </AppBar>


                        <Main open={open}>
                            <DrawerHeader/>
                            <Box
                                style={{width: open ? `calc(100% - ${drawerWidth}px)` : "100%"}}><BlockSchemeWhitePage/>
                            </Box>
                        </Main>
                        <Drawer
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxShadow: "0px 10px 18px -5px #888888"
                                },

                            }}
                            variant="persistent"
                            anchor="right"
                            open={open}
                        >
                            <DrawerHeader>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'rtl' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                                </IconButton>
                            </DrawerHeader>
                            <Divider/>
                            <SettingsPanel/>
                        </Drawer>
                    </Box>

        </div>
    )
}
