import {SkeletonData} from "./skeleton-data";
import {SheetData} from "./sheet-data";
import {SelectionBuffer} from "../selection/selection-buffer";
import {MutableRefObject} from "react";

export interface BarContextData {
    sheets : Map<string, SheetData>
    isTouched:boolean;
    activeSheet:string;
    activeSubSheet:string|null;

    bars: SkeletonData[];
    updateBars: (newQuads: SkeletonData[]) => any;
    updateSingleBar: (barIndex: number, barDara:SkeletonData) => any;
    selectionBuffer:MutableRefObject<SelectionBuffer>;

    updateActiveSheet : (sheetName:string) => any;
    updateActiveSubSheet : (sheetName:string|null) => any;
    updateSheets:( newSheets:Map<string, SheetData>) => any;

    barSize: number;
    updateBarSize: (newSize: number) => any;
}
