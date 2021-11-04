import React, {useState} from 'react';
import './App.css';
import theme from "./core/theme-provider";
import {StyledEngineProvider, Theme, ThemeProvider,} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {BlockSchemeEditor} from "./schemeEditor/block-scheme-editor";
import {BarContextProvider} from "./context/bar-context";
import {SettingsContextProvider} from "./context/settings-context";


declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {
    }
}


function App() {

    const classes = useGlobalStyles();
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SettingsContextProvider>
                    <BarContextProvider>
                        <div className="App">
                            <div className={classes.contentArea}>
                                <div className={classes.mainContentArea}>
                                    <BlockSchemeEditor/>
                                </div>
                            </div>
                        </div>
                    </BarContextProvider>
                </SettingsContextProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export const useGlobalStyles = makeStyles({
    thinCard: {
        display: 'flex',
        padding: '10px',
        margin: '10px',
        width: '12vw'
    },
    controlPanelCard: {
        display: 'flex',
        // padding: '10px',
        // margin: '10px',
        width: '23vw',
        height: "100%",
        // position: 'fixed',
        // right: 0,
        // top: 0
    },
    card: {
        display: 'flex',
        padding: '10px',
        margin: '10px',
        flex: 1
    },
    thickCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        width: '70vw',
        flexDirection: "column",
        overflowY: "scroll",
        height: "100%",
        // marginRight: "20px"
    },
    fullScreenCard: {
        display: 'flex',
        padding: '10px',
        margin: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        flex: 2,
        minWidth: "200px"

    },
    cardRow: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10
    },
    cardColumn: {
        display: 'flex',
        flexDirection: "column",
    },
    title: {
        fontSize: 26,
    },
    subtitle: {
        fontSize: 18,
    },
    taskTitle: {
        fontSize: 18,
        color: "white"
    },
    taskSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "white"
    },
    pos: {
        marginBottom: 12,
    },
    centeredContent: {
        textAlign: "center",
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentArea: {
        backgroundColor: '#2c2c2c',
        display: 'flex',
        padding: '10px',
        minHeight: '70vh',
        position: "relative"
    },
    testContentArea: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '10px',
        height: '100%',
        width: '100%',
    },
    mainContentArea: {
        display: 'flex',
        padding: '0 10px',
        justifyContent: 'space-between',
        overflowY: "hidden"
    },
    paddedButton: {
        margin: '10px'
    },
    taskCard: {
        backgroundColor: "#2c2c2c",
        color: "white",
        margin: '10px'
    },
    scaleButtonGroup: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center'
    },
    textInputPadding: {
        padding: '10px'
    },
    quintTreeContent: {
        flexDirection: 'column',
        display: 'flex',
        textAlign: "center",
        alignItems: 'center',
        justifyContent: 'center',
    },
    blockSchemeNode: {
        width: '30px',
        height: '30px',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: '1px',
        alignContent: 'center',
        alignItems: "center",
        flexDirection: 'column',
        flex: 1
    },
    accordionHeading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    header: {
        flexGrow: 1,
        position: "fixed",
        top: 0,
        left: 0,
        width: 'inherit',
        zIndex: 5,
        alignSelf: "flex-start"
    }
});

export default App;
