import {SkeletonData} from "../skeleton-entities-data/skeleton-data";
import {SheetData} from "../skeleton-entities-data/sheet-data";
import {SelectionBuffer} from "../selection/selection-buffer";
import {MutableRefObject} from "react";

export interface BarContextData {
    sheets: Map<string, SheetData>
    isTouched: boolean;
    activeSheet: string;
    activeSubSheet: string | null;
    activeTrack: string | null;

    bars: SkeletonData[];
    updateBars: (newBars: SkeletonData[]) => any;
    updateSingleBar: (barIndex: number, barDara: SkeletonData) => any;
    selectionBuffer: MutableRefObject<SelectionBuffer>;

    updateActiveSheet: (sheetName: string) => any;
    updateActiveSubSheet: (sheetName: string | null) => any;
    updateActiveTrack: (sheetName: string | null) => any;
    updateSheets: (newSheets: Map<string, SheetData>) => any;

    editableSheetName: string
    undo: () => any;
}
