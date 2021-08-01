import {SkeletonData} from "./skeleton-data";
import {SheetData} from "./sheet-data";

export interface BarContextData {
    sheets : Map<string, SheetData>
    isTouched:boolean;
    activeSheet:string;

    bars: SkeletonData[];
    updateBars: (newQuads: SkeletonData[]) => any;

    updateActiveSheet : (sheetName:string) => any;
    updateSheets:( newSheets:Map<string, SheetData>) => any;

    barSize: number;
    updateBarSize: (newSize: number) => any;
}
