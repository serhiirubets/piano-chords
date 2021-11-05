import {Slider, styled} from "@mui/material";
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import {SoundfontProvider} from "../../../core/soundfont-provider";
import {audioContext, DEFAULT_INSTRUMENT, soundfontHostname} from "../../../model/global-constants";
import IconButton from "@mui/material/IconButton";
import {collectBarsToPlay, getNotesToPlay, playNotes} from "../../../utils/playback-utils";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import {BarContext} from "../../context/bar-context";
import {SkeletonData} from "../../../model/skeleton-entities-data/skeleton-data";

export interface PlaybackModuleProps {
    iconColor?: string;
    bars?: SkeletonData[]
}

export const StyledSlider = styled(Slider)(({theme}) => ({
    '& .MuiSlider-thumb': {
        height: 10,
        width: 10,
    }
}));


export const PlaybackModule = ({iconColor, bars}: PlaybackModuleProps) => {
    const {settings} = useContext(SettingsContext);
    const {activeSheet, activeSubSheet, sheets} = useContext(BarContext);

    const barsDataToPlay = bars ?
        bars.map(bar => ({data: bar, relativePosition: 0})) :
        collectBarsToPlay(settings.isMasteringMode, activeSubSheet || activeSheet, sheets)

    return (
        <SoundfontProvider
            instrumentName={DEFAULT_INSTRUMENT}
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({playNote, stopNote, stopAllNotes}) => (
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>

                        <IconButton
                            onClick={() => {
                                playNotes(getNotesToPlay(barsDataToPlay), playNote, settings.playbackTempo, settings.alterGainForFeather, settings.barSize)
                            }}
                            size="large">
                            <PlayArrowRoundedIcon fontSize="large" style={{fill: iconColor ? iconColor : "#176503"}}/>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                stopNote();
                                stopAllNotes();
                            }}
                            size="large">
                            <StopRoundedIcon fontSize="large" style={{fill: iconColor ? iconColor : "#ac0707"}}/>
                        </IconButton>


                    </div>
                </div>

            )}
        />
    );
}
