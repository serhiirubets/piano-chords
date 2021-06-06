import {SkeletonNodeData, IBlockSchemeNodeData} from "./skeleton-node-data";
import {v4 as uuid} from 'uuid';
import {Note} from "../note-data";

export class SkeletonData {
    public readonly id = uuid();
    public readonly size = 8;

    constructor(size) {
        this.size = size;
    }

    public readonly right = new Array<SkeletonNodeData>(this.size).fill(new SkeletonNodeData());
    public readonly left = new Array<SkeletonNodeData>(this.size).fill(new SkeletonNodeData());
    public readonly triplets=new Array<TripletData>()
}

export enum HandType {
    LEFT = 'left',
    RIGHT = 'right'
}

export interface TripletData {
    startIndex:number;
    length:number;
}

