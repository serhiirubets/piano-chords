// @ts-ignore
import {MidiNumbers} from 'react-piano';
import {JsonProperty, Serializable} from 'typescript-json-serializer';
import {IBlockSchemeNodeData} from "./skeleton-node-data";


export interface INote {
    note: string;
    applicature?: string;
    octave: number;
    getMidiNumber: () => number
}

export class Note implements INote {
    private _note: string;
    private _applicature?: string;
    private _octave: number;

    public static compareByMidiNumbers = (a: INote, b: INote) => a.getMidiNumber() - b.getMidiNumber();

    constructor(initData: { note: string, octave: number, applicature?: string }) {
        this._note = initData.note;
        this._applicature = initData.applicature;
        this._octave = initData.octave;
    }

    public static createFromDeserialized(other: INote) {
        return new Note({
            note: other["_note"],
            applicature: other["_applicature"],
            octave: other["_octave"],
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

