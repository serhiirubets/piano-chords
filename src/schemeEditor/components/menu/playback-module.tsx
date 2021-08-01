import {Divider, Grid} from "@material-ui/core";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {audioContext, soundfontHostname} from "../../model/global-constants";
import IconButton from "@material-ui/core/IconButton";
import {getNotesToPlay, playNotes} from "../../utils/playback-utils";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import {BarContext} from "../../context/bar-context";
import {PrintRounded} from "@material-ui/icons";

export interface PlaybackModuleProps {
    iconColor?: string;
}

export const PlaybackModule = ({iconColor}: PlaybackModuleProps) => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {bars, updateBars} = useContext(BarContext);
    const classes = useGlobalStyles();

    return (
        <SoundfontProvider
            instrumentName="bright_acoustic_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({playNote, stopNote, stopAllNotes}) => (

                <div style={{display:"flex", flexDirection: "row"}}>

                    <IconButton
                        onClick={() => {
                            playNotes(getNotesToPlay(bars), playNote, settings.playbackTempo, settings.alterGainForFeather)
                        }}>
                        <PlayArrowRoundedIcon fontSize="large" style={{fill: "#176503"}}/>
                    </IconButton>
                    <IconButton onClick={() => {
                        stopNote();
                        stopAllNotes();
                    }}>
                        <StopRoundedIcon fontSize="large" style={{fill: "#ac0707"}}/>
                    </IconButton>


                </div>
            )}
        />)
}
