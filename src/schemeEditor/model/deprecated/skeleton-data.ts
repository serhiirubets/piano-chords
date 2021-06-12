import {SkeletonNodeData, IBlockSchemeNodeData} from "./skeleton-node-data";
import {v4 as uuid} from 'uuid';

export class SkeletonData {
    public readonly id = uuid();
    public triplets=new Array<TripletData>()

    public right;
    public left;

    public readonly size;
    constructor(size) {
        this.size = size;
        this.right = new Array<SkeletonNodeData>(this.size).fill(new SkeletonNodeData());
        this.left = new Array<SkeletonNodeData>(this.size).fill(new SkeletonNodeData());
    }
}

export enum HandType {
    LEFT = 'left',
    RIGHT = 'right'
}

export interface TripletData {
    startIndex:number;
    length:number;
}

