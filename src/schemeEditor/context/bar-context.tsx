import React, {useEffect, useState} from "react";
import {BarContextData} from "../model/deprecated/bar-context-data";
import {SkeletonData} from "../model/deprecated/skeleton-data";
import {sheet} from "@emotion/css";
import {SheetData} from "../model/deprecated/sheet-data";

const defaultSettings: BarContextData = {
    sheets: new Map<string, SheetData>(),
    isTouched:false,
    activeSheet: "Часть 1",

    bars: [new SkeletonData(8)],
    updateBars: (newValue) => {},
    updateSingleBar: (index, data) =>{},

    updateActiveSheet: (sheetName: string) => {},
    updateSheets: (newSheets: Map<string, SheetData>) => {},
    barSize: 8,
    updateBarSize: (newValue) => {}
}

export const BarContext = React.createContext(defaultSettings);

export const BarContextProvider = (props: any) => {
    const emptyBars = [new SkeletonData(8)];
    const defaultSheet = new SheetData();
    defaultSheet.name = "Часть 1";
    defaultSheet.index = 0;
    defaultSheet.bars = emptyBars;

    const [sheets, setSheets] = useState<Map<string, SheetData>>(new Map<string, SheetData>()
        .set("Часть 1", defaultSheet))
    const [activeSheet, setActiveSheet] = useState<string>("")
    const [quadSize, setQuadSize] = useState(8);
    const [isTouched, setIsTouched] = useState(false);

    const getActiveSheet = () => {
        const allSheetNames = Array.from(sheets.keys());
        return  activeSheet === "" ? allSheetNames[0] : activeSheet;
    }

    useEffect(() => {
        setActiveSheet(getActiveSheet());
    }, [sheets, activeSheet])

    const updateQuads = (newBars: SkeletonData[]) => {
        const sheetToUpdate = sheets.get(getActiveSheet());
        const updatedMap = new Map<string, SheetData>(sheets);
        const updatedSheet = sheetToUpdate ? JSON.parse(JSON.stringify(sheetToUpdate)) : defaultSheet
        updatedSheet.bars = newBars;
        updatedMap.set(getActiveSheet(), updatedSheet);

        setSheets(updatedMap)
        setIsTouched(true)
    }

    const updateSingleQuad = (quadIndex:number, quadData: SkeletonData) => {
        const sheetToUpdate = sheets.get(getActiveSheet());
        const updatedMap = new Map<string, SheetData>(sheets);
        const updatedSheet = sheetToUpdate ? JSON.parse(JSON.stringify(sheetToUpdate)) : defaultSheet
        const updatedBars = [updatedSheet.bars]
        updatedBars[quadIndex] = quadData
        updatedSheet.bars = updatedBars;
        updatedMap.set(getActiveSheet(), updatedSheet);

        setSheets(updatedMap)
        setIsTouched(true)
    }

    return (
        <BarContext.Provider value={
            {
                sheets: sheets,
                bars: (sheets.get(activeSheet) || defaultSheet).bars,
                isTouched:isTouched,
                updateBars: updateQuads,
                updateSingleBar:updateSingleQuad,
                activeSheet: activeSheet,
                updateActiveSheet: setActiveSheet,
                updateSheets: setSheets,
                barSize: quadSize,
                updateBarSize: setQuadSize
            }
        }>
            {props.children}
        </BarContext.Provider>
    )
}
