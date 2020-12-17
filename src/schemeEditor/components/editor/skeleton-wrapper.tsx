import {useGlobalStyles} from "../../../App";
import React, {useContext, useState} from "react";
import {SkeletonData, NoteHand} from "../../model/skeleton-data";
import {SkeletonNode} from "./skeleton-node";
import {Skeleton} from "./skeleton";
import {SkeletonWrapperControls} from "./skeleton-wrapper-controls";
import {Grid, Popover, Typography} from "@material-ui/core";
import OpenWithRoundedIcon from "@material-ui/icons/OpenWithRounded";
import {audioContext, DRAGGABLE_CLASSNAME, soundfontHostname} from "../../model/global-constants";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {getNotesToPlay, playNotes} from "../../utils/playback-utils";
import {SettingsContext} from "../../context/settings-context";

export interface BlockSchemeSkeletonWrapperProps {
    skeletonData: SkeletonData;
    setSkeletonData: any;
    quadrats: Array<SkeletonData>
    setQuadrats: any;
    index: number;
}

export const SkeletonWrapper = ({skeletonData, setSkeletonData, quadrats, setQuadrats, index}: BlockSchemeSkeletonWrapperProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isNameEdited, setIsNameEdited] = useState<boolean>(false);

    const {settings} = useContext(SettingsContext);
    const blockSchemeStyle = {
        marginTop: "30px",
        marginLeft: "10px",
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
        const updatedArray = [...quadrats];
        updatedArray.splice(index, 1);
        setQuadrats(updatedArray);
    }

    const handleCopyButtonClick = () => {
        const copiedSkeleton = skeletonData.copyGeneratingId();
        const updatedArray = [...quadrats];
        updatedArray.splice(index + 1, 0, copiedSkeleton);
        setQuadrats(updatedArray);
    }

    const handlePlayButtonClick = (playFunction) => {
        playNotes(getNotesToPlay([skeletonData]), playFunction, settings.playbackTempo, settings.alterGainForFeather)
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
                                {!isNameEdited &&
                                 <Typography>{skeletonData.id.substr(0, 8)}</Typography>
                                }
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

            <Skeleton blockSchemeData={skeletonData} setBlockSchemeData={setSkeletonData}></Skeleton>
        </div>

    )
}

