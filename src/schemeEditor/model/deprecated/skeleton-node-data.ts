import {HandType} from "./skeleton-data";
import {Note, NoteType} from "../note-data";
import {v4 as uuid} from 'uuid';

export interface IBlockSchemeNodeData {
    // id:string;
    isPresent: boolean;
    // color: string;
    type?: NoteType,
    notes: Note[];
    hand: HandType;
}

export interface PlaybackData {
    midiNumber: number;
    duration: number;
    playbackOffset: number;
    gain:number;
}

export class SkeletonNodeData implements IBlockSchemeNodeData {
    // public readonly id = uuid();
    // public color = 'red';
    public hand = HandType.RIGHT;
    public notes = new Array<Note>();
    public isPresent = false;
    public type = NoteType.REGULAR;

    constructor(initData?: Partial<IBlockSchemeNodeData>) {
        if(initData) {
            // this.id = initData.id || uuid();
            this.isPresent = initData.isPresent || false;
            this.notes = initData.notes  || [];
            this.type = initData.type || NoteType.REGULAR;
            this.hand = initData.hand || HandType.RIGHT;
            // this.color = initData.color || 'red';
        }
    }



}
