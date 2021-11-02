import {SkeletonData, TripletData} from "./skeleton-data";

export class SheetData {
    public name;
    public index;
    public isTrack;
    public isMuted;
    public parentName;
    public bars = [new SkeletonData(8)];

}
