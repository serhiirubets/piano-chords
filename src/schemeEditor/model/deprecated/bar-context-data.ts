import {SkeletonData} from "./skeleton-data";
import {SheetData} from "./sheet-data";
import {SelectionBuffer} from "../selection/selection-buffer";
import {MutableRefObject} from "react";

export interface BarContextData {
    sheets : Map<string, SheetData>
    isTouched:boolean;
    activeSheet:string;

    bars: SkeletonData[];
    updateBars: (newQuads: SkeletonData[]) => any;
    updateSingleBar: (barIndex: number, barDara:SkeletonData) => any;
    selectionBuffer:MutableRefObject<SelectionBuffer>;

    updateActiveSheet : (sheetName:string) => any;
    updateSheets:( newSheets:Map<string, SheetData>) => any;

    barSize: number;
    updateBarSize: (newSize: number) => any;
}
