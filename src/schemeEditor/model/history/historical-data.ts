import {SheetData} from "../deprecated/sheet-data";

export interface HistoricalData {
     sheets:Map<string,SheetData>;
     activeSheet:string;
     activeTrack:string|null;
     activeSubSheet:string|null;
}
