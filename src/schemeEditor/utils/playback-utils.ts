import {HandType, SkeletonData} from "../model/deprecated/skeleton-data";
import {PlaybackData} from "../model/deprecated/skeleton-node-data";
import {INote, Note} from "../model/note-data";
import {MidiNumbers} from 'react-piano';
import {getPlaybackData} from "./skeleton-node-utils";
import {groupBy} from "./js-utils";


export const getNotesToPlay = (bars: Array<SkeletonData>) => {
    const notes = new Array<PlaybackData[]>();
    bars.forEach(quadrat => {
        for (let i = 0; i < quadrat.size; i++) {
            const currentBeatNotes: PlaybackData[] = [...getPlaybackData(quadrat.left[i]),
                ...getPlaybackData(quadrat.right[i])]
                .flat(3);
            notes.push(currentBeatNotes);
        }
    })
    return notes;
}

export const playNotes = (beatsToPlay, playFunction, tempo, doDistinguishFeatherGain) => {
    const STANDARD_DURATION = tempo * 1;
    const getGain = (beatPlayback) => doDistinguishFeatherGain ? beatPlayback.gain : 1

    for (let i = 0; i <= beatsToPlay.length; i++) {
        const currentBeat: PlaybackData[] = beatsToPlay[i];
        if (currentBeat === undefined) {
            continue;
        }
        currentBeat.forEach(playback => {
            const offset = STANDARD_DURATION * (i + 1 + playback.playbackOffset);
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
        if(value.length > 1){
            anyGroup = true;
        }
    } )

    return anyGroup
}
