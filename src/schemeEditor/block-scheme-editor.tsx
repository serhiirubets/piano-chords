import React, {useContext, useEffect, useState} from "react"
import {
    Button,
    Card,
    CardContent, Checkbox,
    createStyles, FormControlLabel,
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
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import {BAIntroSchemeString} from "./resources/BA-intro-recording";
import {HelpDialog} from "./components/help-screen";
import {EditorSettings} from "./model/settings-data";
import Download from '@axetroy/react-download';

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
    const [showApplicature, setShowApplicature] = useState(true);
    const [quadratSize, setQuadratSize] = useState(8);
    const [quadrats, setQuadrats] = useState([new SkeletonData(quadratSize)]);
    const [saveName, setSaveName] = useState("Новая блок-схема");

    let fileReader;

    const handleNoteDurationChange = (event: any, newValue: number | number[]) => {
        setNoteDuration((newValue as number) * -1);
        console.log(newValue as number)
    };

    const handleSaveFileRead = (e) => {
        const stringifiedData = fileReader.result;
        console.log(stringifiedData)
        const memorizedScheme = stringifiedData ? JSON.parse(stringifiedData) : [];
        let validatedBlockScheme = memorizedScheme.map(maybeQuad => {
            return SkeletonData.createFromDeserialized(maybeQuad);
        });
        setQuadrats(validatedBlockScheme)
    }

    const handleSaveFileSelected = (e) => {
        const file = e.target.files[0]
        fileReader = new FileReader();
        fileReader.onloadend = handleSaveFileRead
        fileReader.readAsText(file)
    }

    return (
        <div style={{flexDirection: "row", display: "flex"}}>
            <Card className={classes.thickCard}>
                <CardContent>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Редактор блок схем
                    </Typography><HelpDialog/>
                    <BlockSchemeGrid quadrats={quadrats} setQuadrats={(data) => setQuadrats(data)}
                                     quadratSize={quadratSize} noteDuration={noteDuration}></BlockSchemeGrid>
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

                                <Download file={`${saveName}.json`}
                                          content={JSON.stringify(quadrats, null, 2)}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<SaveRoundedIcon/>}
                                        style={{width: "100%"}}>
                                        Сохранить
                                    </Button>
                                </Download>
                                <label htmlFor="upload-photo">
                                    <input
                                        style={{display: 'none'}}
                                        id="upload-photo"
                                        name="upload-photo"
                                        type="file"
                                        onChange={(e) => handleSaveFileSelected(e)}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<PublishRoundedIcon/>}
                                        component="span"
                                        style={{width: '100%'}}
                                    >
                                        Загрузить
                                    </Button>
                                </label>
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
                                            <Tooltip title={"Пока что не реализовано"}>
                                                <FormControlLabel
                                                    value="top"
                                                    control={<Checkbox
                                                        checked={showApplicature}
                                                        onChange={(e) => setShowApplicature(e.target.checked)}
                                                    />}
                                                    label="Различать оперение по громкости"></FormControlLabel>
                                            </Tooltip>
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
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={localClasses.heading}>Отображение</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControlLabel
                                value="top"
                                control={<Checkbox
                                    checked={showApplicature}
                                    onChange={(e) => setShowApplicature(e.target.checked)}
                                />}
                                label="Показывать аппликатуру"></FormControlLabel>

                        </AccordionDetails>
                    </Accordion>

                </CardContent>
            </Card>
        </div>
    )
}
