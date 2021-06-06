import {PlaybackData, SkeletonNodeData} from "../model/deprecated/skeleton-node-data";
import {NoteType} from "../model/note-data";
import {HandType} from "../model/deprecated/skeleton-data";
import {getMidiNumber} from "./playback-utils";

export const getEffectiveNodeType = (data:SkeletonNodeData) => {
    const isAnyFeatherNote =  data.notes.filter(note => note.noteType === NoteType.FEATHER).length  > 0;
    return isAnyFeatherNote ? NoteType.FEATHER : NoteType.REGULAR;
}

export const getEffectiveNodeColor = (data:SkeletonNodeData) => {
    return data.hand === HandType.LEFT ? "green" :
        data.type === NoteType.FEATHER ? "#2196f3": "red";
}

export const getAllMidiNumbers = (data: SkeletonNodeData) =>  {
    return data.notes.map(note => getMidiNumber(note));
}

export const getPlaybackData = (data: SkeletonNodeData) :PlaybackData[]=> {
    return data.notes
        .map( note => {
            return {
                midiNumber: getMidiNumber(note),
                duration: note.duration,
                playbackOffset: note.playbackOffset,
                gain:note.noteType === NoteType.FEATHER ? 0.3 : 1
            }
        })
}
