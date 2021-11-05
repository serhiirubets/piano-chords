import React from 'react';
import './App.css';
import theme from "./core/theme-provider";
import {StyledEngineProvider, Theme, ThemeProvider,} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {BlockSchemeEditor} from "./components/editor/block-scheme-editor";
import {BarContextProvider} from "./components/context/bar-context";
import {SettingsContextProvider} from "./components/context/settings-context";


declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {
    }
}


function App() {

    const classes = useStyles();
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

const useStyles = makeStyles({
    contentArea: {
        backgroundColor: '#2c2c2c',
        display: 'flex',
        padding: '10px',
        minHeight: '70vh',
        position: "relative"
    },
    mainContentArea: {
        display: 'flex',
        padding: '0 10px',
        justifyContent: 'space-between',
        overflowY: "hidden"
    }
});

export default App;
