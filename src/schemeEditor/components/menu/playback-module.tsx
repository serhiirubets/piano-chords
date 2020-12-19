import {Grid} from "@material-ui/core";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {audioContext, soundfontHostname} from "../../model/global-constants";
import IconButton from "@material-ui/core/IconButton";
import {getNotesToPlay, playNotes} from "../../utils/playback-utils";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import {QuadratsContext} from "../../context/quadrats-context";

export interface PlaybackModuleProps {
    iconColor?:string;
}

export const PlaybackModule = ({iconColor}:PlaybackModuleProps) => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {quads, updateQuads} = useContext(QuadratsContext);
    const classes = useGlobalStyles();

    return (
        <SoundfontProvider
            instrumentName="bright_acoustic_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({playNote, stopNote, stopAllNotes}) => (

                <div className={classes.cardRow}>
                    <Grid container alignItems="center" direction="row">
                        <Grid item>
                            <IconButton
                                onClick={() => {
                                    console.log('onPlaying', quads.length)
                                    playNotes(getNotesToPlay(quads), playNote, settings.playbackTempo, settings.alterGainForFeather)
                                }}>
                                <PlayArrowRoundedIcon fontSize="large" style={{fill:iconColor}}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => {
                                stopNote();
                                stopAllNotes();
                            }}>
                                <StopRoundedIcon fontSize="large" style={{fill:iconColor}}/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </div>
            )}
        />)
}
