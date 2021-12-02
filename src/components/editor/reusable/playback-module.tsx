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
import {LoopPlay} from './loop-play';
import set = Reflect.set;

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

let intervalId;

export const PlaybackModule = ({iconColor, bars}: PlaybackModuleProps) => {
    const {settings, partialUpdateSettings} = useContext(SettingsContext);
    const {activeSheet, activeSubSheet, sheets} = useContext(BarContext);

    const barsDataToPlay = bars ?
        bars.map(bar => ({data: bar, relativePosition: 0})) :
        collectBarsToPlay(settings.isMasteringMode, activeSubSheet || activeSheet, sheets)

  const notes = getNotesToPlay(barsDataToPlay);

    function stopPlay() {
      clearInterval(intervalId);
      partialUpdateSettings({ currentActiveNodeId: -1 })
    }
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
                              let counter = 0;
                              let currentSkeletonIndex = ++settings.currentActiveNodeId;

                              intervalId = setInterval(() => {
                                if (settings.currentActiveNodeId > settings.barSize || counter > (barsDataToPlay.length * settings.barSize) ) {
                                  stopPlay();
                                  return;
                                }

                                if (counter % settings.barSize === 0 && counter !== 0) {
                                  currentSkeletonIndex += settings.currentActiveNodeId + 1;
                                  partialUpdateSettings({ currentActiveNodeId: currentSkeletonIndex })
                                }
                                counter++

                              }, 60 / settings.bmpValue * 1000);
                              setTimeout(() => {
                                playNotes(notes, playNote, settings.playbackTempo, settings.alterGainForFeather, settings.barSize);
                              }, 750)

                            }}
                            size="large">
                            <PlayArrowRoundedIcon fontSize="large" style={{fill: iconColor ? iconColor : "#176503"}}/>
                        </IconButton>
                        <LoopPlay notes={notes} playNote={playNote} settings={settings} stop={() => {
                          stopNote();
                          stopAllNotes();
                          stopPlay();
                        }} />
                        <IconButton
                            onClick={() => {
                                stopNote();
                                stopAllNotes();
                                stopPlay();
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
