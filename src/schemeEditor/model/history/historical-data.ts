import {SheetData} from "../deprecated/sheet-data";

export interface HistoricalData {
     sheets:Map<string,SheetData>;
     activeSheet:string;
     activeSubSheet:string|null;
}
