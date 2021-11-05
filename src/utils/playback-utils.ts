import {SkeletonData} from "../model/skeleton-entities-data/skeleton-data";
import {PlaybackData} from "../model/skeleton-entities-data/skeleton-node-data";
import {INote, Note} from "../model/skeleton-entities-data/note-data";
import {MidiNumbers} from 'react-piano';
import {getPlaybackData} from "./skeleton-node-utils";
import {groupBy} from "./js-utils";
import {SheetData} from "../model/skeleton-entities-data/sheet-data";


export const getNotesToPlay = (bars: Array<{ data: SkeletonData, relativePosition: number }>) => {
    const notes = new Array<{ data: PlaybackData[], relativePosition: number }>();
    bars.forEach(({data, relativePosition}) => {
        for (let i = 0; i < data.size; i++) {
            const currentBeatNotes: PlaybackData[] = [...getPlaybackData(data.left[i]),
                ...getPlaybackData(data.right[i])]
                .flat(3);
            notes.push({data: currentBeatNotes, relativePosition: relativePosition});
        }
    })
    return notes;
}

export const playNotes = (beatsToPlay: { data: PlaybackData[], relativePosition: number }[], playFunction, tempo, doDistinguishFeatherGain, quadratSize) => {
    const STANDARD_DURATION = tempo * 1;
    const getGain = (beatPlayback) => doDistinguishFeatherGain ? beatPlayback.gain : 1
    for (let i = 0; i < beatsToPlay.length; i++) {
        const currentBeat: PlaybackData[] = beatsToPlay[i].data;
        if (currentBeat === undefined) {
            continue;
        }
        const index = beatsToPlay[i].relativePosition * quadratSize + i % quadratSize

        currentBeat.forEach((playback) => {
            const offset = STANDARD_DURATION * (index + playback.playbackOffset);
            playFunction(playback.midiNumber, offset, {duration: playback.duration, gain: getGain(playback)});
        })
    }
}

export const getMidiNumber = (noteData: INote) => {
    const isSharp = noteData.note.endsWith('#');
    const isFlat = noteData.note.length === 2 && noteData.note.endsWith('b')
    const midiModifier = isSharp ? 1 : isFlat ? -1 : 0;
    const rootNote = getNoteRoot(noteData.note)
    const midiNumber = MidiNumbers.fromNote(rootNote + noteData.octave)
    return midiNumber + midiModifier
}

export const getNoteRoot = (note: string) => {
    return note.length === 2 ? note.substr(0, 1) : note;
}


export const compareByMidiNumbers = (a: INote, b: INote) => getMidiNumber(a) - getMidiNumber(b);


export const isChord = (notes: Note[]) => {
    const groupNotes = groupBy(notes, note => note.playbackOffset)
    let anyGroup = false;
    groupNotes.forEach(value => {
        if (value.length > 1) {
            anyGroup = true;
        }
    })
    return anyGroup
}

export const collectBarsToPlay = (isMasteringMode: boolean, activeSheetName: string, sheets: Map<string, SheetData>) => {
    if (isMasteringMode) {
        const tracksForSheet = Array.from(sheets.entries()).filter(([key, value]) =>
            value.parentName === activeSheetName && value.isTrack && !value.isMuted
        ).flatMap(([key, value]) => {
            return value.bars.map((bar, idx) => ({data: bar, relativePosition: idx}))
        })
        return tracksForSheet
    }
    return (sheets.get(activeSheetName)||new SheetData(8)).bars.map((bar, idx) => ({data: bar, relativePosition: idx}))
}
