import {SkeletonNodeData, IBlockSchemeNodeData} from "./skeleton-node-data";
import {v4 as uuid} from 'uuid';

export class SkeletonData {
    public readonly id = uuid();
    private _size = 8;

    private _right = new Array<SkeletonNodeData>(this._size);
    private _left = new Array<SkeletonNodeData>(this._size);
    private _triplets=new Array<TripletData>()

    constructor(quadratSize: number, id?: string) {
        this._size = quadratSize;
        if (id) {
            this.id = id;
        }
        for (let i = 0; i < this.size; i++) {
            this._left[i] = SkeletonNodeData.createEmpty(NoteHand.LEFT);
            this._right[i] = SkeletonNodeData.createEmpty(NoteHand.RIGHT);
        }
    }

    public static createFromDeserialized(other: SkeletonData) {
        const data = new SkeletonData(other.size, other.id);
        data._size = other["_size"];
        data._triplets=other["_triplets"] || [];
        data._right = [...other["_right"]].map(corruptedNodeData => SkeletonNodeData.createFromDeserialized(corruptedNodeData));
        data._left = [...other["_left"]].map(corruptedNodeData => SkeletonNodeData.createFromDeserialized(corruptedNodeData));;
        return data;
    }

    copyPreservingId() {
        const data = new SkeletonData(this.size, this.id);
        data._triplets= this._triplets;
        data._right = [...this._right];
        data._left = [...this._left];
        return data;
    }

    copyGeneratingId() {
        const cloneDeep = require('lodash.clonedeep');
        const clone = cloneDeep(this)
        clone.id = uuid();
        return clone;
    }

    setNode(hand: NoteHand, index: number, data: IBlockSchemeNodeData) {
        this["_" + hand][index] = data
    }

    getNode(hand: NoteHand, index: number): SkeletonNodeData {
        return this["_" + hand][index];
    }

    get right() {
        return this._right;
    }

    get left() {
        return this._left;
    }

    get size() {
        return this._size;
    }

    set triplets(data) {
         this._triplets = data;
    }

    get triplets() {
        return this._triplets;
    }

}


export enum NoteType {
    REGULAR = 'regular',
    FEATHER = 'feather'
}

export enum NoteHand {
    LEFT = 'left',
    RIGHT = 'right'
}

export interface TripletData {
    startIndex:number;
    length:number;
}

