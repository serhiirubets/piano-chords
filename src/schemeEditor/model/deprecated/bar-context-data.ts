import {SkeletonData} from "./skeleton-data";

export interface BarContextData {
    bars: SkeletonData[];
    updateBars: (newQuads: SkeletonData[]) => any;

    barSize: number;
    updateBarSize: (newSize: number) => any;
}
