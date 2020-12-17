import React, {useState} from "react";
import {Button, TextField, Tooltip, Typography} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import {
    SortableHandle,
} from 'react-sortable-hoc';

import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import OpenWithRoundedIcon from '@material-ui/icons/OpenWithRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import {DRAGGABLE_CLASSNAME} from "../../model/global-constants";

export interface BlockSchemeSkeletonWrapperProps {
    onStartPlaying: any;
    onStopPlaying: any;
    onCopy: any;
    onClear: any;
    onDescriptionChange: any;
    isDisplayed: boolean;
}

export const SkeletonWrapperControls = ({onStartPlaying, onStopPlaying, onCopy, isDisplayed, onClear, onDescriptionChange}: BlockSchemeSkeletonWrapperProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBeingDragged, setIsBeingDragged] = useState(false);

    const GridDragNDropHandle =
        SortableHandle(() => <OpenWithRoundedIcon
            onMouseDown={handleDragStart}
            onMouseUp={handleDragStop}
            color={isBeingDragged ? "primary" : "action"}
            className={DRAGGABLE_CLASSNAME}/>)

    const handleDragStart = () => {
        setIsBeingDragged(true)
    }
    const handleDragStop = () => {
        setIsBeingDragged(false)
    }

    return (
        <div style={blockSchemeStyle}>
            {isDisplayed &&
            <div style={{alignItems: "center", display: "flex", flexDirection: "row"}}>
                {/*<TextField*/}
                {/*    onChange={onDescriptionChange}>*/}
                {/*</TextField>*/}
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
            }
        </div>

    )
}
const blockSchemeStyle = {padding: "5px"}
