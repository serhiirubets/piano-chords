import {PlaybackData, SkeletonNodeData} from "../model/deprecated/skeleton-node-data";
import {INote, Note, NoteType} from "../model/note-data";
import {HandType, SkeletonData} from "../model/deprecated/skeleton-data";
import {getMidiNumber} from "./playback-utils";
import {groupBy} from "./js-utils";

export const getEffectiveNodeColor = (data: SkeletonNodeData, isHostingTriplet: boolean) => {
    return isHostingTriplet ? "yellow" :
        data.hand == HandType.LEFT ? "green" :
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

export const getOriginalText = (noteArray: INote[]): string => {
    const chordToString = (notes: INote[]) => {
        return notes.map(note => note.note + note.octave).join(" ")
    }

    const notesGroupedByOffset = groupBy(noteArray, note => note.playbackOffset);
    let isTriplet;
    const result = Array.from(notesGroupedByOffset.entries())
        .sort(([k1, v1], [k2, v2]) => (k1 - k2))
        .map(([key, value]) => {
            if (key % 0.5 !== 0) {
                isTriplet = true;
            }
            return chordToString(value)
        })
        .join(isTriplet ? ":" : "/")

    return result
}


export const getOctaveInRussianNotation = (octave: number) => {
    switch (octave) {
        case 0:
            return "с.к.о"
        case 1:
            return "к.о"
        case 2:
            return "б.о"
        case 3:
            return "м.о"
        case 4:
            return "1.о"
        case 5:
            return "2.о"
        case 6:
            return "3.о"
        case 7:
            return "4.о"
        default:
            return ""
    }
}


export const getSkeletonHandData = (data: SkeletonData, hand: HandType) => {
    return hand === HandType.LEFT ? data.left : data.right;
}

export const setSkeletonHandData = (originalData: SkeletonData, handData: SkeletonNodeData[], hand: HandType) => {
    if (hand === HandType.LEFT) {
        originalData.left = handData
    } else {
        originalData.right = handData
    }
}

export const copySkeleton = (originalData: SkeletonData) => {
    const updatedSkeletonData = new SkeletonData(originalData.size);
    updatedSkeletonData.right = [...originalData.right]
    updatedSkeletonData.left = [...originalData.left]
    updatedSkeletonData.triplets = [...originalData.triplets]
    return updatedSkeletonData
}
