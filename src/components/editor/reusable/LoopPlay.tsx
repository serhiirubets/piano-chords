import {playNotes} from '../../../utils/playback-utils';
import React, {useRef, useState} from 'react';
import {Tooltip} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import LoopIcon from '@mui/icons-material/Loop';

export const LoopPlay = ({notes, settings, playNote, stop = () => {}}) => {
  const [isLoopPlaying, setIsLoopPlaying] = useState<boolean>(false);
  const intervalId = useRef<any>(null)

  const onLoopPlay = () => {
    setIsLoopPlaying(true);

    playNotes(notes, playNote, settings.playbackTempo, settings.alterGainForFeather, settings.barSize);

    intervalId.current = setInterval(() => {
      playNotes(notes, playNote, settings.playbackTempo, settings.alterGainForFeather, settings.barSize)
    }, notes.length * 1000 * settings.playbackTempo + 1000);
  }

  const onLoopStop = () => {
    clearInterval(intervalId.current);
    setIsLoopPlaying(false);
    stop();
  }

  return isLoopPlaying ?
    <Tooltip title="Остановить квадрат">
      <IconButton size="small" onClick={() => {
        onLoopStop();
      }}>
        <StopRoundedIcon/>
      </IconButton>
    </Tooltip> :
    <Tooltip title="Зациклить квадрат" placement="top">
      <IconButton size="small" onClick={onLoopPlay}>
        <LoopIcon/>
      </IconButton>
    </Tooltip>
}
