import React, {useEffect, useState} from "react"
import {
    Button,
    Card,
    CardContent,
    createStyles,
    Grid,
    Slider,
    TextField,
    Theme,
    Tooltip,
    Typography
} from "@material-ui/core";
import {useGlobalStyles} from "../App";
import {SkeletonData, NoteHand} from "./model/skeleton-data";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import SpeedRoundedIcon from '@material-ui/icons/SpeedRounded';
import SoundfontProvider from "../components/piano-core/SoundfontProvider";
// @ts-ignore
import {MidiNumbers} from 'react-piano';
import {QUADRAT_SIZE, audioContext, soundfontHostname} from "./model/global-constants";
import {BlockSchemeGrid} from "./components/editor/block-scheme-grid";
import {getNotesToPlay, playNotes} from "./utils/playback-utils";
import {makeStyles} from "@material-ui/core/styles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from "@material-ui/core/IconButton";
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import RotateLeftRoundedIcon from '@material-ui/icons/RotateLeftRounded';
import PlaylistPlayRoundedIcon from '@material-ui/icons/PlaylistPlayRounded';
import {serialize} from "typescript-json-serializer";
import {BAIntroScheme, BAIntroSchemeString} from "./resources/BA-intro-recording";
import {HelpDialog} from "./components/help-screen";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }),
);

export interface BlockSchemeEditorProps {
}

export const BlockSchemeEditor = (props: BlockSchemeEditorProps) => {
    const classes = useGlobalStyles();
    const localClasses = useStyles();
    const [noteDuration, setNoteDuration] = useState(0.25);
    const [quadratSize, setQuadratSize] = useState(QUADRAT_SIZE);
    const [quadrats, setQuadrats] = useState([new SkeletonData(quadratSize)]);
    const [saveName, setSaveName] = useState("Temp");


    const handleNoteDurationChange = (event: any, newValue: number | number[]) => {
        setNoteDuration((newValue as number) * -1);
        console.log(newValue as number)
    };

    return (
        <div style={{flexDirection: "row", display: "flex"}}>
            <Card className={classes.thickCard}>
                <CardContent>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Редактор блок схем
                    </Typography><HelpDialog/>
                    <BlockSchemeGrid quadrats={quadrats} setQuadrats={(data) => setQuadrats(data)}
                                     quadratSize={quadratSize} noteDuration={noteDuration}></BlockSchemeGrid>
                    {/*<div style={{flexDirection: "row", display: "flex", width: '100%', flexWrap: "wrap"}}>*/}
                    {/*    {*/}
                    {/*        quadrats.map((element, index) => {*/}
                    {/*            return <SkeletonWrapper blockSchemeData={element} setBlockSchemeData={(data) => {*/}
                    {/*                const items = [...quadrats];*/}
                    {/*                items[index] = data;*/}
                    {/*                setQuadrats(items);*/}
                    {/*            }}/>*/}
                    {/*        })*/}
                    {/*    }*/}

                    {/*    <button style={{width: 240, height: 80, border: "2px solid black", padding: 30}}*/}
                    {/*            onClick={() => setQuadrats([...quadrats, new BlockSchemeSkeletonData(quadratSize)])}>*/}
                    {/*        <PlaylistAddRoundedIcon></PlaylistAddRoundedIcon>*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </CardContent>
            </Card>

            <Card className={classes.controlPanelCard}>
                <CardContent>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Панель управления
                    </Typography>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={localClasses.heading}>Загрузка/Сохранение</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction="column" spacing={1}>
                                <TextField label="Имя сохранения"
                                           style={{margin: 5}}
                                           onChange={(event) => {
                                               setSaveName(event.target.value)
                                           }}></TextField>
                                <Tooltip title="Временно, пока не реализовано по-человечески">
                                    <Button
                                        variant="outlined"
                                        startIcon={<SaveRoundedIcon/>}
                                        onClick={() => {
                                            const data = JSON.stringify(quadrats)
                                            localStorage.setItem(saveName, data)
                                        }}>
                                        Сохранить в кеш
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Временно, пока не реализовано по-человечески">
                                    <Button
                                        variant="outlined"
                                        startIcon={<RotateLeftRoundedIcon/>}
                                        onClick={() => {
                                            const stringifiedData = localStorage.getItem(saveName);
                                            const memorizedScheme = stringifiedData ? JSON.parse(stringifiedData) : [];
                                            let validatedBlockScheme = memorizedScheme.map(maybeQuad => {
                                                return SkeletonData.createFromDeserialized(maybeQuad);
                                            });
                                            setQuadrats(validatedBlockScheme);
                                        }}>
                                        Загрузить из кеша
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Временно, пока не реализовано по-человечески">
                                    <Button
                                        variant="outlined"
                                        startIcon={<PlaylistPlayRoundedIcon/>}
                                        onClick={() => {
                                            const restoredScheme = JSON.parse(BAIntroSchemeString);
                                            let validatedBABlockScheme = restoredScheme.map(maybeQuad => {
                                                return SkeletonData.createFromDeserialized(maybeQuad);
                                            });
                                            setQuadrats(validatedBABlockScheme);
                                        }}>
                                        Загрузить демо
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={localClasses.heading}>Воспроизведение</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SoundfontProvider
                                instrumentName="bright_acoustic_piano"
                                audioContext={audioContext}
                                hostname={soundfontHostname}
                                render={({isLoading, playNote, stopNote, stopAllNotes}) => (

                                    <div className={classes.cardRow}>
                                        <div className={classes.cardColumn}>
                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                <SpeedRoundedIcon></SpeedRoundedIcon>
                                                <Typography id="discrete-slider" gutterBottom>
                                                    Темп
                                                </Typography>
                                            </div>
                                            <Slider
                                                style={{width: '100%'}}
                                                onChange={handleNoteDurationChange}
                                                defaultValue={-0.25}
                                                step={0.05}
                                                marks
                                                min={-1}
                                                max={-0.05}
                                            />
                                            <Grid container alignItems="center" direction="row">
                                                <Grid item>
                                                    <IconButton
                                                        onClick={() => {
                                                            console.log('onPlaying', quadrats.length)
                                                            playNotes(getNotesToPlay(quadrats), playNote, noteDuration)
                                                        }}>
                                                        <PlayArrowRoundedIcon fontSize="large"/>
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton onClick={() => {
                                                        stopNote();
                                                        stopAllNotes();
                                                    }}>
                                                        <StopRoundedIcon fontSize="large"/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>

                                        </div>
                                    </div>
                                )}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={localClasses.heading}>Структура</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField className={classes.textInputPadding}
                                       label="Размер квадрата"
                                       defaultValue={quadratSize}
                                       onChange={(event => setQuadratSize(Number(event.target.value)))}
                                       disabled={true}/>
                        </AccordionDetails>
                    </Accordion>

                </CardContent>
            </Card>
        </div>
    )
}
