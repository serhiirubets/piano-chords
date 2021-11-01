import React, {useState} from "react";
import {Tooltip} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';

import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import OpenWithRoundedIcon from '@material-ui/icons/OpenWithRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import {DRAGGABLE_CLASSNAME} from "../../model/global-constants";

export interface BlockSchemeSkeletonWrapperProps {
    id: string,
    onStartPlaying: any;
    onStopPlaying: any;
    onCopy: any;
    onClear: any;
    isDisplayed: boolean;
    sortableListeners: any;
    sortableAttributes: any;
}

export const SkeletonWrapperControls = ({
                                            id,
                                            onStartPlaying,
                                            onStopPlaying,
                                            onCopy,
                                            isDisplayed,
                                            onClear,
                                            sortableListeners,
                                            sortableAttributes
                                        }: BlockSchemeSkeletonWrapperProps) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const GridDragNDropHandle = () =>{

    const [isBeingDragged, setIsBeingDragged] = useState(false);


        const handleDragStart = () => {
            setIsBeingDragged(true)
        }
        const handleDragStop = () => {
            setIsBeingDragged(false)
        }

        return <OpenWithRoundedIcon
            {...sortableListeners}
            {...sortableAttributes}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
            color={isBeingDragged ? "primary" : "action"}
            className={DRAGGABLE_CLASSNAME}/>
    }


    return (
        <div style={blockSchemeStyle}>
            {isDisplayed &&
            <div style={{justifyContent: "space-between", display: "flex", flexDirection: "row", width: "100%"}}>
                <div style={{display: "flex", alignItems: "flex-start"}}>
                </div>
                <div style={{
                    display: "flex", alignItems: "flex-end"
                }}>
                    {isPlaying ?
                        <Tooltip title="Остановить квадрат">
                            <IconButton size="small" onClick={() => {
                                setIsPlaying(false);
                                onStopPlaying();
                            }}>
                                <StopRoundedIcon/>
                            </IconButton>
                        </Tooltip> :
                        <Tooltip title="Воспроизвести квадрат" placement="top">
                            <IconButton size="small" onClick={() => {
                                setIsPlaying(true);
                                onStartPlaying()
                            }}>
                                <PlayArrowRoundedIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                    <Tooltip title="Cкопировать квадрат" placement="top">
                        <IconButton size="small" onClick={onCopy}>
                            <FileCopyRoundedIcon/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Нажать и удерживать чтоб переместить" placement="top">
                        <GridDragNDropHandle/>
                    </Tooltip>

                    <Tooltip title="Удалить квадрат" placement="top">
                        <IconButton size="small" onClick={onClear}>
                            <ClearRoundedIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            }
        </div>

    )
}
const blockSchemeStyle =
    {
        display: "flex",
        width: "100%",
        padding: "5px"
    }
