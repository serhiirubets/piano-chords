import {HandType} from "./skeleton-data";
import {Note, NoteType} from "./note-data";

export interface IBlockSchemeNodeData {
    isPresent: boolean;
    type?: NoteType,
    notes: Note[];
    hand: HandType;
    originalText: string;
}

export interface PlaybackData {
    midiNumber: number;
    duration: number;
    playbackOffset: number;
    gain: number;
}

export class SkeletonNodeData implements IBlockSchemeNodeData {
    public originalText = ''
    public hand = HandType.RIGHT;
    public notes = new Array<Note>();
    public isPresent = false;
    public type = NoteType.REGULAR;

    constructor(initData?: Partial<IBlockSchemeNodeData>) {
        if (initData) {
            this.isPresent = initData.isPresent || false;
            this.notes = initData.notes || [];
            this.type = initData.type || NoteType.REGULAR;
            this.hand = initData.hand || HandType.RIGHT;
            this.originalText = initData.originalText || '';
        }
    }


}
