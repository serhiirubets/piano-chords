import {SkeletonData} from "./skeleton-data";

export interface QuadratContextData {
    bars: SkeletonData[];
    updateBars: (newQuads: SkeletonData[]) => any;

    barSize: number;
    updateBarSize: (newSize: number) => any;
}
