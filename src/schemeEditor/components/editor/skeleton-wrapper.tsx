import {useGlobalStyles} from "../../../App";
import React, {useState} from "react";
import {SkeletonData, NoteHand} from "../../model/skeleton-data";
import {SkeletonNode} from "./skeleton-node";
import {Skeleton} from "./skeleton";
import {SkeletonWrapperControls} from "./skeleton-wrapper-controls";
import {Grid, Popover} from "@material-ui/core";
import OpenWithRoundedIcon from "@material-ui/icons/OpenWithRounded";
import {audioContext, DRAGGABLE_CLASSNAME, soundfontHostname} from "../../model/global-constants";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {getNotesToPlay, playNotes} from "../../utils/playback-utils";

export interface BlockSchemeSkeletonWrapperProps {
    skeletonData: SkeletonData;
    setSkeletonData: any;
    quadrats: Array<SkeletonData>
    setQuadrats: any;
    index: number;
    noteDuration: number;
}

export const SkeletonWrapper = ({skeletonData, setSkeletonData, quadrats, setQuadrats, index, noteDuration}: BlockSchemeSkeletonWrapperProps) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const blockSchemeStyle = {
        margin: "10px",
        // border: "1px solid", borderColor: isHovered ? "black" : "transparent "
    }

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setIsHovered(true)
    }

    const hadleMouseLeave = () => {
        setIsHovered(false)
    }

    const implementLater = () => {
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
        //TODO: MOVE NOTE DURATION TO CONTEXT
        playNotes(getNotesToPlay([skeletonData]), playFunction, noteDuration)
    }

    return (
        <div style={blockSchemeStyle} onMouseEnter={handleMouseEnter} onMouseLeave={hadleMouseLeave}>
            <div style={{display: "flex", justifyContent: "flex-end", flexDirection: "row"}}>

                {isHovered ? <SoundfontProvider
                        instrumentName="bright_acoustic_piano"
                        audioContext={audioContext}
                        hostname={soundfontHostname}
                        render={({isLoading, playNote, stopNote, stopAllNotes}) => (
                            <SkeletonWrapperControls onStartPlaying={() => handlePlayButtonClick(playNote)}
                                                     onStopPlaying={() => {
                                                         stopNote();
                                                         stopAllNotes();
                                                     }}
                                                     onCopy={handleCopyButtonClick}
                                                     onDragNDrop={implementLater}
                                                     onClear={handleClearButtonClick}
                                                     isDisplayed={true}/>
                        )}/>
                    : (<div style={{height: 40, width: '100%'}}></div>)}
            </div>

            <Skeleton blockSchemeData={skeletonData} setBlockSchemeData={setSkeletonData}></Skeleton>
        </div>

    )
}

