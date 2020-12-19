import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Button, CardContent, Checkbox, FormControlLabel, Grid, Slider, TextField, Typography} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import PlaylistPlayRoundedIcon from "@material-ui/icons/PlaylistPlayRounded";
import {BAIntroSchemeString} from "../../resources/BA-intro-recording";
import {SkeletonData} from "../../model/skeleton-data";
import Accordion from "@material-ui/core/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {audioContext, soundfontHostname} from "../../model/global-constants";
import SpeedRoundedIcon from "@material-ui/icons/SpeedRounded";
import IconButton from "@material-ui/core/IconButton";
import {getNotesToPlay, playNotes} from "../../utils/playback-utils";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import {QuadratsContext} from "../../context/quadrats-context";
import {PlaybackModule} from "./playback-module";

export interface SaveLoadSettingsPanelProps {
}

export const PlaybackPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {quads, updateQuads} = useContext(QuadratsContext);
    const classes = useGlobalStyles();

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }

    const handleNoteDurationChange = (event: any, newValue: number | number[]) => {
        partialUpdateSettings({playbackTempo: (newValue as number) * -1});
        console.log(newValue as number)
    };

    return ( <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
        >
            <Typography className={classes.accoridionHeading}>Воспроизведение</Typography>
        </AccordionSummary>
        <AccordionDetails>

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
                            <PlaybackModule/>
                            <FormControlLabel
                                value="top"
                                control={<Checkbox
                                    checked={settings.alterGainForFeather}
                                    onChange={(e) => partialUpdateSettings({alterGainForFeather: e.target.checked})}
                                />}
                                label="Различать оперение по громкости"></FormControlLabel>
                        </div>
                    </div>
                )}
        </AccordionDetails>
    </Accordion>)
}
