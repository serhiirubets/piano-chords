import {PlaybackData, SkeletonNodeData} from "../model/skeleton-entities-data/skeleton-node-data";
import {INote, NoteType} from "../model/skeleton-entities-data/note-data";
import {HandType, SkeletonData} from "../model/skeleton-entities-data/skeleton-data";
import {getMidiNumber} from "./playback-utils";
import {groupBy} from "./js-utils";
import {getOctaveNotationFromScientific, OctaveNotation} from "../model/skeleton-entities-data/octave-data";

export const getEffectiveNodeColor = (data: SkeletonNodeData, isHostingTriplet: boolean) => {
    return isHostingTriplet ? "yellow" :
        data.hand === HandType.LEFT ? "green" :
            data.type === NoteType.FEATHER ? "#2196f3" : "red";
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

export const getOriginalText = (noteArray: INote[], octaveNotation: OctaveNotation): string => {
    const chordToString = (notes: INote[]) => {
        return notes.map(note => note.note + getOctaveNotationFromScientific(note.octave, octaveNotation)).join(" ")
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

export const recalculateBarsToNewSize = (bars: SkeletonData[], newBarSize: number) => {
    const rightHandCombined = new Array<SkeletonNodeData>()
    const leftHandCombined = new Array<SkeletonNodeData>()
    const newBars = new Array<SkeletonData>();

    const chunkArray = (array: Array<SkeletonNodeData>, chunkSize: number) => {
        return Array(Math.ceil(array.length / chunkSize)).fill(new SkeletonNodeData()).map((_, i) => array.slice(i * chunkSize, i * chunkSize + chunkSize))
    }

    const mergeIntoArray = (target, values) => {
        for (let i = 0; i < target.length; i++) {
            if (values[i] !== undefined) {
                target[i] = values[i];
            }
        }
    }

    bars.forEach(bar => {
        rightHandCombined.push(...bar.right);
        leftHandCombined.push(...bar.left);
    })

    const rightHandChunks = chunkArray(rightHandCombined, newBarSize);
    const leftHandChunks = chunkArray(leftHandCombined, newBarSize);

    for (let i = 0; i < rightHandChunks.length; i++) {
        const newSkeletonData = new SkeletonData(newBarSize)
        mergeIntoArray(newSkeletonData.right, rightHandChunks[i]);
        mergeIntoArray(newSkeletonData.left, leftHandChunks[i]);
        newBars.push(newSkeletonData)
    }

    return newBars
}
