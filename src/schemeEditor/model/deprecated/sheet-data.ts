import {SkeletonData} from "./skeleton-data";

export class SheetData {
    constructor(private barsize) {}

    public name;
    public index;
    public isTrack;
    public isMuted;
    public parentName;
    public bars = [new SkeletonData(this.barsize)];

}
