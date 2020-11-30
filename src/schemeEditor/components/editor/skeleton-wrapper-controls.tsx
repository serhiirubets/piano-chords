import React, {useState} from "react";
import {Button, Tooltip} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';

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
    onDragNDrop: any;
    onClear: any;
    isDisplayed: boolean;
}

export const SkeletonWrapperControls = ({onStartPlaying, onStopPlaying, onCopy, onDragNDrop, isDisplayed, onClear}: BlockSchemeSkeletonWrapperProps) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div style={blockSchemeStyle}>
            {isDisplayed &&
            <div style={{alignItems: "center", display: "flex", flexDirection: "row"}}>
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
                    <OpenWithRoundedIcon color="action" className={DRAGGABLE_CLASSNAME}/>
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
