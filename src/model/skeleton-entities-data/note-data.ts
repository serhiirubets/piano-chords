// @ts-ignore
import {MidiNumbers} from 'react-piano';
import {v4 as uuid} from 'uuid';

export enum PlaybackDuration {
    FULL = 1,
    HALF = 0.5
}

export enum PlaybackOffset {
    NONE = 0,
    HALF = 0.5,
}

export enum NoteType {
    REGULAR = 'regular',
    FEATHER = 'feather'
}

export interface INote {
    note: string;
    applicature?: string;
    displayOctave?:boolean
    octave: number;
    duration: PlaybackDuration;
    playbackOffset: PlaybackOffset;
    noteType:NoteType;
}

export class Note implements INote {
    public readonly id = uuid()
    public note: string;
    public applicature?: string;
    public displayOctave?: boolean;
    public octave: number;
    public duration: number;
    public playbackOffset: number;
    public noteType: NoteType;


    constructor(initData: { note: string, octave: number, displayOctave?:boolean, applicature?: string, duration?: number, playbackOffset?: PlaybackOffset, noteType?: NoteType, id?:string }) {
        this.noteType = initData.noteType || NoteType.REGULAR;
        this.note = initData.note;
        this.applicature = initData.applicature;
        this.displayOctave = initData.displayOctave;
        this.octave = initData.octave;
        this.duration = initData.duration || PlaybackDuration.FULL;
        this.playbackOffset = initData.playbackOffset || PlaybackOffset.NONE;
    }

    public static createFromDeserialized(other: INote) {
        return new Note({
            note: other["_note"],
            applicature: other["_applicature"],
            octave: other["_octave"],
            duration: other["_duration"],
            playbackOffset: other["_playbackOffset"],
            noteType: other["_noteType"]
        })
    }


    // public getMidiNumber = () => {
    //     const isSharp = this.note.endsWith('#');
    //     const isFlat = this.note.length === 2 && this.note.endsWith('b')
    //     const midiModifier = isSharp ? 1 : isFlat ? -1 : 0;
    //     const rootNote = this.getNoteRoot(this.note)
    //     const midiNumber = MidiNumbers.fromNote(rootNote + this.octave)
    //     return midiNumber + midiModifier
    // }
    //
    // private getNoteRoot = (note: string) => {
    //     return note.length == 2 ? note.substr(0, 1) : note;
    // }

}

