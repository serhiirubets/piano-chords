import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {ResponsivePiano} from "./components/screen/responsive-piano";
import {QuintTreeButtons} from "./components/screen/quint-tree-buttons";
import theme from "./core/theme-provider";
import {Card, CardContent, FormControlLabel, Radio, RadioGroup, ThemeProvider, Typography} from '@material-ui/core';
import {MinorTypeSelector} from "./components/screen/minor-type-selector";
import {TestScreen} from "./components/test-screen";
import {makeStyles} from "@material-ui/core/styles";

function App() {
    const [selectedScale, setSelectedScale] = useState();
    const [minorType, setMinorType] = useState();

    const [mode, setMode] = useState('info')
    const classes = useGlobalStyles();
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <div className={classes.contentArea}>
                    <Card className={classes.thinCard} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textPrimary" gutterBottom>
                                Режим
                            </Typography>
                            <RadioGroup value={mode} onChange={(e) => {
                                setMode(e.target.value)
                            }}>
                                <FormControlLabel value="info" control={<Radio/>} label="Обучение"/>
                                <FormControlLabel value="challenge" control={<Radio/>} label="Тренировка"/>
                            </RadioGroup>
                        </CardContent>

                    </Card>
                    <div className={classes.mainContentArea}>
                        {
                            mode === "challenge" ?
                                <TestScreen></TestScreen> :
                                <div className={classes.centeredContent}>
                                    <div className={classes.cardRow}>
                                        <QuintTreeButtons
                                            onScaleSelect={scale => setSelectedScale(scale)}></QuintTreeButtons>
                                        <MinorTypeSelector onMinorTypeChange={mType => setMinorType(mType)}/>
                                    </div>
                                    <div className={classes.centeredContent}>
                                        <ResponsivePiano selectedScale={selectedScale} minorType={minorType}
                                                         showNotesOnStart={true}
                                                         isTestMode={false}/>
                                    </div>
                                </div>
                        }
                    </div>
                </div>

            </div>
        </ThemeProvider>
    );
}

export const useGlobalStyles = makeStyles({
    thinCard: {
        display: 'flex',
        padding: '10px',
        margin: '10px',
    },
    card: {
        display: 'flex',
        padding: '10px',
        margin: '10px',
        flex: 1
    },
    thickCard: {
        display: 'flex',
        padding: '10px',
        margin: '10px',
        justifyContent:'center',
        alignItems:'center',
        flex: 2
        
    },
    cardRow: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
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
        height: '100%'
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
        padding: '10px',
        justifyContent: 'space-between'
    },
    paddedButton: {
        // display: 'flex',
        // flex: 1,
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
        padding:'10px'
    },
    quintTreeContent: {
        flexDirection:'column',
        display:'flex',
        textAlign: "center",
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
