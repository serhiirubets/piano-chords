import {HandType, SkeletonData} from "../model/deprecated/skeleton-data";
import {PlaybackData} from "../model/deprecated/skeleton-node-data";
import {INote, Note} from "../model/note-data";
import {MidiNumbers} from 'react-piano';
import {getPlaybackData} from "./skeleton-node-utils";
import {groupBy} from "./js-utils";
import {SheetData} from "../model/deprecated/sheet-data";


export const getNotesToPlay = (bars: Array<{ data: SkeletonData, relativePosition: number }>) => {
    const notes = new Array<{ data: PlaybackData[], relativePosition: number }>();
    console.log('bars')
    bars.forEach(({data, relativePosition}) => {
        for (let i = 0; i < data.size; i++) {
            const currentBeatNotes: PlaybackData[] = [...getPlaybackData(data.left[i]),
                ...getPlaybackData(data.right[i])]
                .flat(3);
            notes.push({data: currentBeatNotes, relativePosition: relativePosition});
        }
    })
    console.log(notes)
    return notes;
}

export const playNotes = (beatsToPlay: { data: PlaybackData[], relativePosition: number }[], playFunction, tempo, doDistinguishFeatherGain) => {
    const STANDARD_DURATION = tempo * 1;
    const getGain = (beatPlayback) => doDistinguishFeatherGain ? beatPlayback.gain : 1
    console.log('beats to play',beatsToPlay)
    for (let i = 0; i < beatsToPlay.length; i++) {
        console.log(beatsToPlay[i])
        const currentBeat: PlaybackData[] = beatsToPlay[i].data;
        if (currentBeat === undefined) {
            continue;
        }
        const notesInBeat = 8
        const index = beatsToPlay[i].relativePosition * notesInBeat + i % notesInBeat
        console.log('=', i)
        console.log('==', i % notesInBeat)
        console.log('===', notesInBeat)
        console.log('playback index', index)

        currentBeat.forEach((playback) => {
            const offset = STANDARD_DURATION * (index + playback.playbackOffset);
            console.log('note', playback, 'offset', offset)
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
    return note.length == 2 ? note.substr(0, 1) : note;
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
            value.parentName === activeSheetName && value.isTrack
        ).flatMap(([key, value]) => {
            return value.bars.map((bar, idx) => ({data: bar, relativePosition: idx}))
        })
        return tracksForSheet
    }
    return (sheets.get(activeSheetName)||new SheetData()).bars.map((bar, idx) => ({data: bar, relativePosition: idx}))
}
