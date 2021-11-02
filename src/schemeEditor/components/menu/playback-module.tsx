import {Slider, styled} from "@mui/material";
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {audioContext, soundfontHostname} from "../../model/global-constants";
import IconButton from "@mui/material/IconButton";
import {collectBarsToPlay, getNotesToPlay, playNotes} from "../../utils/playback-utils";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import {BarContext} from "../../context/bar-context";

export interface PlaybackModuleProps {
    iconColor?: string;
}

export const StyledSlider = styled(Slider)(({theme}) => ({
    '& .MuiSlider-thumb': {
        height: 10,
        width: 10,
    }
}));


export const PlaybackModule = ({iconColor}: PlaybackModuleProps) => {
    const {settings} = useContext(SettingsContext);
    const {bars, activeSheet, activeSubSheet, sheets} = useContext(BarContext);


    return (
        <SoundfontProvider
            instrumentName="bright_acoustic_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({playNote, stopNote, stopAllNotes}) => (
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>

                        <IconButton
                            onClick={() => {
                                playNotes(getNotesToPlay(collectBarsToPlay(settings.isMasteringMode, activeSubSheet || activeSheet, sheets)), playNote, settings.playbackTempo, settings.alterGainForFeather, settings.quadratSize)
                            }}
                            size="large">
                            <PlayArrowRoundedIcon fontSize="large" style={{fill: "#176503"}}/>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                stopNote();
                                stopAllNotes();
                            }}
                            size="large">
                            <StopRoundedIcon fontSize="large" style={{fill: "#ac0707"}}/>
                        </IconButton>


                    </div>
                </div>

            )}
        />
    );
}
