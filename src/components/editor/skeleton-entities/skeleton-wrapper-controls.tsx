import React, {useState} from "react";
import {Tooltip} from "@mui/material";
import IconButton from '@mui/material/IconButton';

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import OpenWithRoundedIcon from '@mui/icons-material/OpenWithRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import LoopIcon from '@mui/icons-material/Loop';
import {DRAGGABLE_CLASSNAME} from "../../../model/global-constants";
import CopyAllIcon from '@mui/icons-material/CopyAll';

export interface BlockSchemeSkeletonWrapperProps {
  id: string,
  onStartPlaying: any;
  onStopPlaying: any;
  onDuplicate: any;
  onCopy: any;
  onClear: any;
  isDisplayed: boolean;
  sortableListeners: any;
  sortableAttributes: any;
  loopComponent: any;
}

export const SkeletonWrapperControls = ({
  id,
  onStartPlaying,
  onStopPlaying,
  onDuplicate,
  onCopy,
  isDisplayed,
  onClear,
  sortableListeners,
  sortableAttributes,
  loopComponent
  }: BlockSchemeSkeletonWrapperProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const GridDragNDropHandle = () => {

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
            <Tooltip title="???????????????????? ??????????????">
              <IconButton size="small" onClick={() => {
                setIsPlaying(false);
                onStopPlaying();
              }}>
                <StopRoundedIcon/>
              </IconButton>
            </Tooltip> :
            <Tooltip title="?????????????????????????? ??????????????" placement="top">
              <IconButton size="small" onClick={() => {
                setIsPlaying(true);
                onStartPlaying()
              }}>
                <PlayArrowRoundedIcon/>
              </IconButton>
            </Tooltip>
          }
          { loopComponent }
          <Tooltip title="?????????????????????? ??????????????" placement="top">
            <IconButton size="small" onClick={onDuplicate}>
              <FileCopyRoundedIcon/>
            </IconButton>
          </Tooltip>

          <Tooltip title="C???????????????????? ?????????????? ?? ?????????? ????????????" placement="top">
            <IconButton size="small" onClick={onCopy}>
              <CopyAllIcon/>
            </IconButton>
          </Tooltip>

          <Tooltip title="???????????? ?? ???????????????????? ???????? ??????????????????????" placement="top">
            <GridDragNDropHandle/>
          </Tooltip>

          <Tooltip title="?????????????? ??????????????" placement="top">
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
