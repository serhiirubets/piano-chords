import {SkeletonNodeData, IBlockSchemeNodeData} from "./skeleton-node-data";
import {QUADRAT_SIZE} from "./global-constants";
import {v4 as uuid} from 'uuid';
import {Serializable} from "typescript-json-serializer";

export class SkeletonData {
    public id = uuid();
    private _size = 8;

    private _right = new Array<SkeletonNodeData>(this._size);
    private _left = new Array<SkeletonNodeData>(this._size);

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
        data._right = [...other["_right"]].map(corruptedNodeData => SkeletonNodeData.createFromDeserialized(corruptedNodeData));
        data._left = [...other["_left"]].map(corruptedNodeData => SkeletonNodeData.createFromDeserialized(corruptedNodeData));;
        return data;
    }

    copyPreservingId() {
        const data = new SkeletonData(this.size, this.id);
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

}


export enum NoteType {
    REGULAR = 'regular',
    FEATHER = 'feather'
}

export enum NoteHand {
    LEFT = 'left',
    RIGHT = 'right'
}

/*
{
    0:{
        left:{}
        right:{}
    }


    left:[
     {note: "b",
      applicature: "1",
      octave: 1
     }
     ]
}
 */
