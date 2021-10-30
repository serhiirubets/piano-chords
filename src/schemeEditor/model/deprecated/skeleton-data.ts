import {SkeletonNodeData, IBlockSchemeNodeData} from "./skeleton-node-data";
import {v4 as uuid} from 'uuid';

export class SkeletonData {
    public id = uuid();
    public triplets=new Array<TripletData>()

    public defaultOctaveLeft = 3;
    public defaultOctaveRight = 4;

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
    start:number;
    length:number;
    hand: HandType;
}

