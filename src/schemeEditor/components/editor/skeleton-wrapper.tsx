import {useGlobalStyles} from "../../../App";
import React, {useContext, useState} from "react";
import {v4 as uuid} from 'uuid';
import {Skeleton} from "./skeleton";
import {SkeletonWrapperControls} from "./skeleton-wrapper-controls";
import {audioContext, soundfontHostname} from "../../model/global-constants";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {getNotesToPlay, playNotes} from "../../utils/playback-utils";
import {SettingsContext} from "../../context/settings-context";
import {BarContext} from "../../context/bar-context";

export interface BlockSchemeSkeletonWrapperProps {
    index: number;
}

export const SkeletonWrapper = ({index}: BlockSchemeSkeletonWrapperProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const {settings} = useContext(SettingsContext);
    const {bars, updateBars} = useContext(BarContext);

    const blockSchemeStyle = {
        marginTop: "30px",
        marginLeft: "40px",
        marginRight: "10px",
        justifyContent: "center",
        maxWidth: 360
    }

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setIsHovered(true)
    }

    const hadleMouseLeave = () => {
        setIsHovered(false)
    }

    const handleClearButtonClick = () => {
        const editedBars = [...bars];
        editedBars.splice(index, 1);
        updateBars(editedBars);
    }

    const handleCopyButtonClick = () => {
        const barCopy = JSON.parse(JSON.stringify(bars[index]));
        barCopy.id = uuid();
        const editedBars = [...bars];
        editedBars.push(barCopy)
        updateBars(editedBars);
    }

    const handlePlayButtonClick = (playFunction) => {
        playNotes(getNotesToPlay([bars[index]]), playFunction, settings.playbackTempo, settings.alterGainForFeather)
    }

    return (
        <div style={blockSchemeStyle} onMouseEnter={handleMouseEnter} onMouseLeave={hadleMouseLeave}>
            <div style={{display: "flex", justifyContent: "flex-end", flexDirection: "row"}}>
                {isHovered ? <SoundfontProvider
                        instrumentName="bright_acoustic_piano"
                        audioContext={audioContext}
                        hostname={soundfontHostname}
                        render={({playNote, stopNote, stopAllNotes}) => (
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <SkeletonWrapperControls onStartPlaying={() => handlePlayButtonClick(playNote)}
                                                         onStopPlaying={() => {
                                                             stopNote();
                                                             stopAllNotes();
                                                         }}
                                                         onCopy={handleCopyButtonClick}
                                                         onClear={handleClearButtonClick}
                                                         isDisplayed={true}
                                                         onDescriptionChange={() => {
                                                         }}/>
                            </div>
                        )}/>
                    : (<div style={{height: 40, width: '100%'}}></div>)}
            </div>
            <Skeleton skeletonIndex={index}></Skeleton>
        </div>

    )
}

