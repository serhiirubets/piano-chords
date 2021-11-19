import React, {useEffect, useRef, useState} from "react";
import {BarContextData} from "../../model/context-data-models/bar-context-data";
import {SkeletonData} from "../../model/skeleton-entities-data/skeleton-data";
import {SheetData} from "../../model/skeleton-entities-data/sheet-data";
import {SelectionBuffer} from "../../model/selection/selection-buffer";
import {deepCopy} from "../../utils/js-utils";
import {HistoricalData} from "../../model/history/historical-data";

const defaultSettings: BarContextData = {
    sheets: new Map<string, SheetData>(),
    isTouched: false,
    activeSheet: "Часть 1",
    activeSubSheet: null,
    activeTrack: null,
    editableSheetName: "Часть 1",
    currentPlaying: [0, 0],

    bars: [new SkeletonData(8)],
    updateBars: (newValue) => {
    },
    updateSingleBar: (index, data) => {
    },
    selectionBuffer: {current: new SelectionBuffer()},

    updateActiveSheet: (sheetName: string) => {
    },
    updateActiveSubSheet: (sheetName: string | null) => {
    },
    updateActiveTrack: (sheetName: string | null) => {
    },

    updateSheets: (newSheets: Map<string, SheetData>) => {
    },
    barSize: 8,
    updateBarSize: (newValue) => {
    },
    undo: () => {
    },
    setCurrentPlaying() {},
}

export const BarContext = React.createContext(defaultSettings);

export const BarContextProvider = (props: any) => {
    const emptyBars = [new SkeletonData(8)];
    const selectionBuffer = useRef<SelectionBuffer>(new SelectionBuffer());

    const [quadSize, setQuadSize] = useState(8);

    const defaultSheet = new SheetData(quadSize);
    defaultSheet.name = "Часть 1";
    defaultSheet.index = 0;
    defaultSheet.bars = emptyBars;

    const [activeSheet, setActiveSheet] = useState<string>("")
    const [activeSubSheet, setActiveSubSheet] = useState<string | null>(null)
    const [activeTrack, setActiveTrack] = useState<string | null>(null)
    const [sheets, setSheets] = useState<Map<string, SheetData>>(new Map<string, SheetData>()
        .set("Часть 1", defaultSheet))
    const [isTouched, setIsTouched] = useState(false);
    const [historyRecords, setHistoryRecords] = useState<HistoricalData[]>(new Array<HistoricalData>())
    const [currentPlaying, setCurrentPlaying] = useState<[number, number]>([0, 0]);

    const getActiveSheet = () => {
        const allSheetNames = Array.from(sheets.keys());
        return activeSheet === "" ? allSheetNames[0] : activeSheet;
    }

    const getActiveSubSheet = () => {
        const activeSheetName = getActiveSheet()
        const subSheetNamesForActiveSheet = Array.from(sheets.entries())
            .filter(([key, value]) => value.parentName === activeSheetName)
            .map(([key, value]) => key);
        if (activeSubSheet && subSheetNamesForActiveSheet.includes(activeSubSheet)) {
            return activeSubSheet
        }
        if (activeSheetName === null && subSheetNamesForActiveSheet.length > 0) {
            return subSheetNamesForActiveSheet[0]
        }

        return null;
    }

    const getActiveTrack = () => {

        const activeSheetName = getActiveSubSheet() || getActiveSheet()
        const trackNamesForActiveSheet = Array.from(sheets.entries())
            .filter(([key, value]) => value.parentName === activeSheetName && value.isTrack)
            .map(([key, value]) => key);
        if (activeTrack && trackNamesForActiveSheet.includes(activeTrack)) {
            return activeTrack
        }
        if (trackNamesForActiveSheet.length > 0) {
            return trackNamesForActiveSheet[0]
        }
        return null;
    }

    const getActiveEditableSheet = () => {
        const activeTrackValue = getActiveTrack();
        const activeSubsheetValue = getActiveSubSheet();
        return activeTrackValue !== null ? activeTrackValue : activeSubsheetValue !== null ? activeSubsheetValue : getActiveSheet();
    }

    useEffect(() => {
        setActiveSheet(getActiveSheet());
    }, [sheets])

    const updateQuads = (newBars: SkeletonData[]) => {
        const sheetToUpdate = sheets.get(getActiveEditableSheet());
        const updatedMap = new Map<string, SheetData>(sheets);
        const updatedSheet = sheetToUpdate ? deepCopy(sheetToUpdate) : defaultSheet
        updatedSheet.bars = newBars;
        updatedMap.set(getActiveEditableSheet(), updatedSheet);

        setSheets(updatedMap)
        setIsTouched(true)
        logHistoryRecord()
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
        logHistoryRecord()
    }

    const logHistoryRecord = () => {
        const record = {
            sheets: sheets,
            activeSheet: activeSheet,
            activeSubSheet: activeSubSheet,
            activeTrack: activeTrack
        }
        setHistoryRecords([...historyRecords, record])
    }

    const rollbackHistory = () => {
        const rolledBackHistory = [...historyRecords]
        const previousHistoryItem = rolledBackHistory.pop()
        if (previousHistoryItem) {

            setSheets(previousHistoryItem.sheets)
            setActiveSheet(previousHistoryItem.activeSheet)
            setActiveSubSheet(previousHistoryItem.activeSubSheet)
            setActiveTrack(previousHistoryItem.activeTrack)
        }
        setHistoryRecords(rolledBackHistory)

    }


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
                activeTrack: activeTrack,
                updateActiveSheet: setActiveSheet,
                updateActiveSubSheet: setActiveSubSheet,
                updateActiveTrack: setActiveTrack,
                updateSheets: setSheets,
                editableSheetName: getActiveEditableSheet(),
                barSize: quadSize,
                updateBarSize: setQuadSize,
                undo: rollbackHistory,
                currentPlaying,
                setCurrentPlaying
            }
        }>
            {props.children}
        </BarContext.Provider>
    )
}
