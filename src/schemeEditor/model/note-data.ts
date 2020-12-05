// @ts-ignore
import {MidiNumbers} from 'react-piano';
import {v4 as uuid} from 'uuid';
import {NoteType} from "./skeleton-data";

export enum PlaybackDuration {
    FULL = 1,
    HALF = 0.5
}

export enum PlaybackOffset {
    NONE = 0,
    HALF = 0.5
}


export interface INote {
    // id: string;
    note: string;
    applicature?: string;
    octave: number;
    getMidiNumber: () => number
    duration: PlaybackDuration;
    playbackOffset: PlaybackOffset;
    noteType:NoteType;
}

export class Note implements INote {
    public readonly id = uuid()
    private _note: string;
    private _applicature?: string;
    private _octave: number;
    private _duration: number;
    private _playbackOffset: number;
    private _noteType: NoteType;

    public static compareByMidiNumbers = (a: INote, b: INote) => a.getMidiNumber() - b.getMidiNumber();

    constructor(initData: { note: string, octave: number, applicature?: string, duration?: number, playbackOffset?: PlaybackOffset, noteType?: NoteType, id?:string }) {
        this._noteType = initData.noteType || NoteType.REGULAR;
        this._note = initData.note;
        this._applicature = initData.applicature;
        this._octave = initData.octave;
        this._duration = initData.duration || PlaybackDuration.FULL;
        this._playbackOffset = initData.playbackOffset || PlaybackOffset.NONE;
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

    get note() {
        return this._note;
    }

    get octave() {
        return this._octave;
    }

    get applicature() {
        return this._applicature;
    }

    get duration() {
        return this._duration;
    }

    get playbackOffset() {
        return this._playbackOffset;
    }

    get noteType() {
        return this._noteType;
    }

    set noteType(type) {
        this._noteType = type;
    }


    public getMidiNumber = () => {
        const isSharp = this._note.endsWith('#');
        const isFlat = this._note.length === 2 && this._note.endsWith('b')
        const midiModifier = isSharp ? 1 : isFlat ? -1 : 0;
        const rootNote = this.getNoteRoot(this._note)
        const midiNumber = MidiNumbers.fromNote(rootNote + this._octave)
        return midiNumber + midiModifier
    }

    private getNoteRoot = (note: string) => {
        return note.length == 2 ? note.substr(0, 1) : note;
    }

}

