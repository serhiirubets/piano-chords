import {SkeletonNodeData} from "./skeleton-node-data";
import {v4 as uuid} from 'uuid';

export class SkeletonData {
    public readonly size;

    public id = uuid();
    public triplets=new Array<TripletData>()

    public right;
    public left;

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

