import React, {useContext, useState} from "react";
import {v4 as uuid} from 'uuid';
import {Skeleton} from "./skeleton";
import {SkeletonWrapperControls} from "./skeleton-wrapper-controls";
import {audioContext, DEFAULT_INSTRUMENT, soundfontHostname} from "../../../model/global-constants";
import {SoundfontProvider} from "../../../core/soundfont-provider";
import {getNotesToPlay, playNotes} from "../../../utils/playback-utils";
import {SettingsContext} from "../../../components/context/settings-context";
import {BarContext} from "../../../components/context/bar-context";
import {deepCopy} from "../../../utils/js-utils";
import {getQuadratNodeDimension} from "../../../utils/rendering-utils";

export interface BlockSchemeSkeletonWrapperProps {
    index: number;
    id: string,
    sheetName: string,
    sortableListeners?: any;
    sortableAttributes?: any;
}

let intervalId;

export const SkeletonWrapper = ({
                                    index,
                                    id,
                                    sortableListeners,
                                    sortableAttributes,
                                    sheetName
                                }: BlockSchemeSkeletonWrapperProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const {settings} = useContext(SettingsContext);
    const {bars, updateBars} = useContext(BarContext);


    const handleMouseEnter = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        if (!isPlaying) {
          setIsHovered(false)
        }
    }

    const handleClearButtonClick = () => {
        const editedBars = [...bars];
        editedBars.splice(index, 1);
        updateBars(editedBars);
    }

    const handleCopyButtonClick = () => {
        const barCopy = deepCopy(bars[index]);
        barCopy.id = uuid();
        const editedBars = [...bars];
        editedBars.push(barCopy)
        updateBars(editedBars);
    }

    const handlePlayButtonClick = (playFunction) => {
      setIsPlaying(true);
      const notes = getNotesToPlay([{
        data: bars[index],
        relativePosition: 0
      }]);

      playNotes(notes, playFunction, settings.playbackTempo, settings.alterGainForFeather, settings.barSize);

      intervalId = setInterval(() => {
        playNotes(notes, playFunction, settings.playbackTempo, settings.alterGainForFeather, settings.barSize)
      }, notes.length * 1000 * settings.playbackTempo + 1000);

    }

    return (
        <div style={{
            marginTop: "20px",
            marginLeft: "10px",
            marginRight: "10px",
            justifyContent: "center",
            flexDirection: "column",
            display: "flex",
            maxWidth: getQuadratNodeDimension(settings.isMasteringMode).quadratWidth * settings.barSize + 40
        }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

            <div style={{display: "flex", justifyContent: "flex-end", flexDirection: "row", width: "100%"}}>
                {isHovered ? <SoundfontProvider
                        instrumentName={DEFAULT_INSTRUMENT}
                        audioContext={audioContext}
                        hostname={soundfontHostname}
                        render={({playNote, stopNote, stopAllNotes}) => (
                            <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                                <SkeletonWrapperControls onStartPlaying={() => handlePlayButtonClick(playNote)}
                                                         onStopPlaying={() => {
                                                             setIsPlaying(false);
                                                             clearInterval(intervalId);
                                                             stopNote();
                                                             stopAllNotes();
                                                         }}
                                                         onCopy={handleCopyButtonClick}
                                                         onClear={handleClearButtonClick}
                                                         isDisplayed={true}
                                                         id={id}
                                                         sortableListeners={sortableListeners}
                                                         sortableAttributes={sortableAttributes}
                                />
                            </div>
                        )}/>
                    : (<div style={{height: 44, width: '100%'}}></div>)}
            </div>
            <Skeleton skeletonIndex={index} sheetName={sheetName}></Skeleton>
        </div>)
}

