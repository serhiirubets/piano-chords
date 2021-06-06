import {HandType, SkeletonData} from "../model/deprecated/skeleton-data";
import {PlaybackData} from "../model/deprecated/skeleton-node-data";
import {Note} from "../model/note-data";
import {MidiNumbers} from 'react-piano';
import {getPlaybackData} from "./skeleton-node-utils";


export const getNotesToPlay = (bars: Array<SkeletonData>) => {
    const notes = new Array<PlaybackData[]>();
    bars.forEach(quadrat => {
        for (let i = 0; i < quadrat.size; i++) {
            const currentBeatNotes : PlaybackData[] = [...getPlaybackData(quadrat.left[i]),
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

export const getMidiNumber = (noteData: Note) => {
    const isSharp = noteData.note.endsWith('#');
    const isFlat = noteData.note.length === 2 && noteData.note.endsWith('b')
    const midiModifier = isSharp ? 1 : isFlat ? -1 : 0;
    const rootNote = getNoteRoot(noteData.note)
    const midiNumber = MidiNumbers.fromNote(rootNote + noteData.octave)
    return midiNumber + midiModifier
}

const getNoteRoot = (note: string) => {
    return note.length == 2 ? note.substr(0, 1) : note;
}

