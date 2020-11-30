import {compareNotes} from "../../data/scale-notes";
import {NoteHand, NoteType} from "./skeleton-data";
import {INote, Note} from "./note-data";
import {Serializable} from "typescript-json-serializer";


export interface IBlockSchemeNodeData {
    isPresent: boolean;
    color: string;
    type?: NoteType,
    notes: Note[];
}

export class SkeletonNodeData implements IBlockSchemeNodeData {

    private _color: string;
    private _notes: Note[];
    private _isPresent: boolean;
    private _type: NoteType;

    constructor(initData: IBlockSchemeNodeData) {
        this._isPresent = initData.isPresent || false;
        this._notes = initData.notes;
        this._color = initData.color || 'red';
        this._type = initData.type || NoteType.REGULAR;
    }

    public static createEmpty(handType: NoteHand) {
        return new SkeletonNodeData({
            isPresent: false,
            color: handType == NoteHand.LEFT ? "green" : "red",
            notes: new Array<Note>()
        })
    }

    public static createFromDeserialized(other: IBlockSchemeNodeData) {
        return  new SkeletonNodeData({
            isPresent: other["_isPresent"],
            color: other["_color"],
            type: other["_type"],
            notes: other["_notes"].map(note => Note.createFromDeserialized(note))
        })
    }


    get color() {
        return this._color
    }

    get notes() {
        return this._notes
    }

    get isPresent() {
        return this._isPresent
    }

    get type() {
        return this._type
    }

    public getAllMidiNumbers() {
        return this.notes.map(note => note.getMidiNumber());
    }
}
