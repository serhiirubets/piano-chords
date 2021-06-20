import {PlaybackData, SkeletonNodeData} from "../model/deprecated/skeleton-node-data";
import {Note, NoteType, PlaybackOffset} from "../model/note-data";
import {HandType} from "../model/deprecated/skeleton-data";
import {getMidiNumber} from "./playback-utils";
import {groupBy} from "./js-utils";

export const getEffectiveNodeColor = (data: SkeletonNodeData, isHostingTriplet: boolean) => {
    return data.hand == HandType.LEFT ? "green" :
        isHostingTriplet ? "yellow" :
            data.type == NoteType.FEATHER ? "#2196f3" : "red";
}

export const getAllMidiNumbers = (data: SkeletonNodeData) => {
    return data.notes.map(note => getMidiNumber(note));
}

export const getPlaybackData = (data: SkeletonNodeData): PlaybackData[] => {
    return data.notes
        .map(note => {
            return {
                midiNumber: getMidiNumber(note),
                duration: note.duration,
                playbackOffset: note.playbackOffset,
                gain: note.noteType === NoteType.FEATHER ? 0.3 : 1
            }
        })
}

export const getOriginalText = (noteArray: Note[]): string => {
    console.log('note array in text', noteArray)
    const chordToString = (notes: Note[]) => {
        return notes.map(note => note.note + note.octave).join(" ")
    }

    const notesGroupedByOffset = groupBy(noteArray, note => note.playbackOffset);
    let isTriplet;
    const result = Array.from(notesGroupedByOffset.entries())
        .sort(([k1, v1], [k2, v2]) => (k1 - k2))
        .map(([key, value]) => {
            console.log('key', key)
            if (key % 0.5 !== 0) {
                isTriplet = true;
            }
            return chordToString(value)
        })
        .join(isTriplet ? ":" : "/")

    console.log('returning text', result)
    return result

}
