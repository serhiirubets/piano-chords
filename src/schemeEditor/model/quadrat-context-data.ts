import {SkeletonData} from "./skeleton-data";

export interface QuadratContextData {
    quads: SkeletonData[];
    updateQuads: (newQuads: SkeletonData[]) => any;

    quadSize: number;
    updateQuadSize: (newSize: number) => any;
}
