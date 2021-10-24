import React, {useEffect, useRef, useState} from "react";
import {BarContextData} from "../model/deprecated/bar-context-data";
import {SkeletonData} from "../model/deprecated/skeleton-data";
import {sheet} from "@emotion/css";
import {SheetData} from "../model/deprecated/sheet-data";
import {SelectionBuffer} from "../model/selection/selection-buffer";
import {deepCopy} from "../utils/js-utils";

const defaultSettings: BarContextData = {
    sheets: new Map<string, SheetData>(),
    isTouched: false,
    activeSheet: "Часть 1",
    activeSubSheet: null,

    bars: [new SkeletonData(8)],
    updateBars: (newValue) => {
    },
    updateSingleBar: (index, data) => {
    },
    selectionBuffer: {current: new SelectionBuffer()},

    updateActiveSheet: (sheetName: string) => {
    },
    updateActiveSubSheet: (sheetName: string|null) => {
    },
    updateSheets: (newSheets: Map<string, SheetData>) => {
    },
    barSize: 8,
    updateBarSize: (newValue) => {
    }
}

export const BarContext = React.createContext(defaultSettings);

export const BarContextProvider = (props: any) => {
    const emptyBars = [new SkeletonData(8)];
    const selectionBuffer = useRef<SelectionBuffer>(new SelectionBuffer());

    const defaultSheet = new SheetData();
    defaultSheet.name = "Часть 1";
    defaultSheet.index = 0;
    defaultSheet.bars = emptyBars;

    const [sheets, setSheets] = useState<Map<string, SheetData>>(new Map<string, SheetData>()
        .set("Часть 1", defaultSheet))
    const [activeSheet, setActiveSheet] = useState<string>("")
    const [activeSubSheet, setActiveSubSheet] = useState<string|null>(null)
    const [quadSize, setQuadSize] = useState(8);
    const [isTouched, setIsTouched] = useState(false);

    const getActiveSheet = () => {
        const allSheetNames = Array.from(sheets.keys());
        return activeSheet === "" ? allSheetNames[0] : activeSheet;
    }

    const getActiveSubSheet = () => {
        const activeSheetName = getActiveSheet()
        const subSheetNamesForActiveSheet = Array.from(sheets.entries())
            .filter(([key, value]) => value.parentName === activeSheetName)
            .map(([key, value]) => key);
        if(activeSubSheet !== null && subSheetNamesForActiveSheet.includes(activeSubSheet)){
            return activeSubSheet
        }
        if (activeSheetName === null && subSheetNamesForActiveSheet.length > 0) {
            return subSheetNamesForActiveSheet[0]
        }

        return null;
    }

    const getActiveEditableSheet = () => {
        const activeSubsheet  = getActiveSubSheet();
       return  activeSubsheet === null ? getActiveSheet() : activeSubsheet;
    }

    useEffect(() => {
        setActiveSheet(getActiveSheet());
    }, [sheets, activeSheet])

    const updateQuads = (newBars: SkeletonData[]) => {
        const sheetToUpdate = sheets.get(getActiveEditableSheet());
        const updatedMap = new Map<string, SheetData>(sheets);
        const updatedSheet = sheetToUpdate ? deepCopy(sheetToUpdate) : defaultSheet
        updatedSheet.bars = newBars;
        updatedMap.set(getActiveEditableSheet(), updatedSheet);

        setSheets(updatedMap)
        setIsTouched(true)
    }

    const updateSingleQuad = (quadIndex: number, quadData: SkeletonData) => {
        const sheetToUpdate = sheets.get(getActiveEditableSheet());
        const updatedMap = new Map<string, SheetData>(sheets);
        const updatedSheet = sheetToUpdate ? deepCopy(sheetToUpdate) : defaultSheet
        const updatedBars = [...updatedSheet.bars]
        updatedBars[quadIndex] = quadData
        updatedSheet.bars = updatedBars;
        updatedMap.set(getActiveEditableSheet(), updatedSheet);

        setSheets(updatedMap)
        setIsTouched(true)
    }
    console.log(sheets)
    console.log('acrive editable sheet', getActiveEditableSheet())
    console.log('bars,',(sheets.get(getActiveEditableSheet()) || defaultSheet).bars)
    return (
        <BarContext.Provider value={
            {
                sheets: sheets,
                bars: (sheets.get(getActiveEditableSheet()) || defaultSheet).bars,
                isTouched: isTouched,
                selectionBuffer: selectionBuffer,
                updateBars: updateQuads,
                updateSingleBar: updateSingleQuad,
                activeSheet: activeSheet,
                activeSubSheet: activeSubSheet,
                updateActiveSheet: setActiveSheet,
                updateActiveSubSheet: setActiveSubSheet,
                updateSheets: setSheets,
                barSize: quadSize,
                updateBarSize: setQuadSize
            }
        }>
            {props.children}
        </BarContext.Provider>
    )
}
