import {NoteHand, NoteType} from "./skeleton-data";
import {Note} from "./note-data";
import {v4 as uuid} from 'uuid';

export interface IBlockSchemeNodeData {
    id:string;
    isPresent: boolean;
    color: string;
    type?: NoteType,
    notes: Note[];
}

export interface PlaybackData {
    midiNumber: number;
    duration: number;
    playbackOffset: number;
    gain:number;
}

export class SkeletonNodeData implements IBlockSchemeNodeData {
    public readonly id = uuid();
    private _color: string;
    private _notes: Note[];
    private _isPresent: boolean;
    private _type: NoteType;

    constructor(initData: IBlockSchemeNodeData) {
        this.id = initData.id || uuid();
        this._isPresent = initData.isPresent || false;
        this._notes = initData.notes;
        this._type = initData.type || NoteType.REGULAR;
        this._color = initData.color || 'red';
    }

    public static createEmpty(handType: NoteHand) {
        return new SkeletonNodeData({
            id:uuid(),
            isPresent: false,
            color: handType == NoteHand.LEFT ? "green" : "red",
            notes: new Array<Note>()
        })
    }

    public static createFromDeserialized(other: IBlockSchemeNodeData) {
        return new SkeletonNodeData({
            id: other["id"],
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
        const isAnyFeatherNote =  this._notes.filter(note => note.noteType === NoteType.FEATHER).length  > 0;
        return isAnyFeatherNote ? NoteType.FEATHER : NoteType.REGULAR;
    }

    public calculateColor( handType:NoteHand) {
        return handType === NoteHand.LEFT ? "green" :
            this.type === NoteType.FEATHER ? "#2196f3": "red";
    }

    public getAllMidiNumbers() {
        return this.notes.map(note => note.getMidiNumber());
    }

    public getPlaybackData() {
        return this.notes
            .map( note => {
                return {
                    midiNumber: note.getMidiNumber(),
                    duration: note.duration,
                    playbackOffset: note.playbackOffset,
                    gain:note.noteType === NoteType.FEATHER ? 0.3 : 1
                }
            })
    }
}
