import React, {useContext, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {BarContext} from "../../../context/bar-context";
import {SheetData} from "../../../model/skeleton-entities-data/sheet-data";
import {TabElement} from "./tab-element";
import {deepCopy, deepCopyMap} from "../../../utils/js-utils";
import {Divider} from "@mui/material";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

import {restrictToHorizontalAxis, restrictToWindowEdges,} from '@dnd-kit/modifiers';
import {settings} from "cluster";
import {SettingsContext} from "../../../context/settings-context";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}


const SortableTabItem = ({sheetName, onTabSelect, handleNameChange, onRemoveTriggered, style, onDuplicate}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: sheetName});

    const transitionStyle = {
        transform: CSS.Transform.toString(transform),
        // transition,
        cursor: isDragging ? "grab" : "auto",
        opacity: isDragging ? 0.1 : 1,
        ...style
    };

    return (<TabElement
        externalRef={setNodeRef}
        label={sheetName}
        onNameChange={handleNameChange}
        onTabSelect={onTabSelect}
        onRemoveTriggered={onRemoveTriggered}
        onDuplicate={onDuplicate}
        externalStyle={transitionStyle}
        draggableAttributes={attributes}
        draggableListeners={listeners}
    />)
}

const SortableTabContainer = ({value, items, indicatorColor, onSortEnd, onChange, children, style}) => {
    const [activeId, setActiveId] = useState(null)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
        )
    ;

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        const {active, over} = event;

        if (active.id !== over.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            onSortEnd({oldIndex: oldIndex, newIndex: newIndex})
            onChange(null, newIndex)
        }
    };

    return <DndContext
        modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={rectSortingStrategy}>
            <Tabs
                value={value}
                onChange={onChange}
                indicatorColor={indicatorColor}
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                style={style}
            >
                {children}
            </Tabs>
            <DragOverlay>
                {activeId ? (
                    <div
                        style={{
                            height: style.height || "40px",
                            width: 100,
                            backgroundColor: "silver",
                            opacity: "50%"
                        }}
                    ></div>
                ) : null}
            </DragOverlay>
        </SortableContext>
    </DndContext>
}

export const handleSheetsDragNDrop = ({
                                          oldIndex,
                                          newIndex
                                      }, sheetsToUpdate: Array<SheetData>, allSheets: Map<string, SheetData>, updateSheets) => {
    if (oldIndex === newIndex) {
        return
    }
    const updatedSheets = deepCopyMap(allSheets);
    const shiftDirection = newIndex > oldIndex ? -1 : 1
    const isBetweenOldAndNewPosition = (value) => {
        return shiftDirection < 0 ? oldIndex < value.index && value.index <= newIndex : newIndex <= value.index && value.index < oldIndex
    }
    const isOutsideOldAndNewPosition = (value) => {
        return shiftDirection < 0 ? value.index < oldIndex || value.index > newIndex : value.index < newIndex || value.index > oldIndex
    }

    sheetsToUpdate.forEach((value) => {
        if (isOutsideOldAndNewPosition(value)) {

        } else if (isBetweenOldAndNewPosition(value)) {
            const updatedValue = deepCopy(value)
            updatedValue.index = value.index + shiftDirection
            updatedSheets.delete(value.name)
            updatedSheets.set(value.name, updatedValue)
        } else {
            const updatedValue = deepCopy(value)
            updatedValue.index = newIndex
            updatedSheets.delete(value.name)
            updatedSheets.set(value.name, updatedValue)
        }
    })
    updateSheets(updatedSheets)
}

export const ScrollableTabs = () => {

    const {
        sheets,
        updateSheets,
        activeSheet,
        updateActiveSheet,
        activeSubSheet,
        updateActiveSubSheet
    } = useContext(BarContext);
    const {settings}=useContext(SettingsContext)
    const [sheetValue, setSheetValue] = React.useState(0);
    const [subSheetValue, setSubSheetValue] = React.useState(0);

    const sheetNames = Array.from(sheets.entries())
        .filter(([key, value]) => {
            return value.parentName === undefined
        })
        .sort(([k1, v1], [k2, v2]) => {
            return v1.index - v2.index;
        })
        .map(([k, v]) => k);

    const getSubSheetNames = (availableSheets: Map<string, SheetData>, activeSheetName: string) => {
        return Array.from(availableSheets.entries())
            .filter(([key, value]) => {
                return value.parentName === activeSheetName && !value.isTrack
            })
            .sort(([k1, v1], [k2, v2]) => {
                return v1.index - v2.index;
            })
            .map(([k, v]) => k);
    }

    const subSheetNames = getSubSheetNames(sheets, activeSheet);

    const handleDragNDropEnd = ({oldIndex, newIndex}) => {
        if (oldIndex === newIndex) {
            return
        }
        const updatedSheets = new Map();
        const shiftDirection = newIndex > oldIndex ? -1 : 1
        const isBetweenOldAndNewPosition = (value) => {
            return shiftDirection < 0 ? oldIndex < value.index && value.index <= newIndex : newIndex <= value.index && value.index < oldIndex
        }
        const isOutsideOldAndNewPosition = (value) => {
            return shiftDirection < 0 ? value.index < oldIndex || value.index > newIndex : value.index < newIndex || value.index > oldIndex
        }

        sheets.forEach((value, key) => {
            if (isOutsideOldAndNewPosition(value)) {
                updatedSheets.set(key, value)
            } else if (isBetweenOldAndNewPosition(value)) {
                const updatedValue = deepCopy(value)
                updatedValue.index = value.index + shiftDirection
                updatedSheets.set(key, updatedValue)
            } else {
                const updatedValue = deepCopy(value)
                updatedValue.index = newIndex
                updatedSheets.set(key, updatedValue)
            }
        })
        updateSheets(updatedSheets)
    }

    const handleSheetChange = (event: React.ChangeEvent<{}> | null, newValue: number) => {
        setSheetValue(newValue);
        setSubSheetValue(0)
        if (newValue < sheetNames.length) {
            updateActiveSheet(sheetNames[newValue])
            updateActiveSubSheet(getSubSheetNames(sheets, sheetNames[newValue])[0])
        }
    };

    const handleSubSheetChange = (event: React.ChangeEvent<{}> | null, newValue: number) => {
        setSubSheetValue(newValue);
        if (newValue < getSubSheetNames(sheets, activeSheet).length) {
            updateActiveSubSheet(getSubSheetNames(sheets, activeSheet)[newValue])
        }
    };

    const handleAdditionOfSheet = () => {
        const newSheet = new SheetData(settings.quadratSize);
        newSheet.index = sheetNames.length;
        newSheet.name = "Часть " + (newSheet.index + 1);

        const updatedSheets = new Map(sheets);
        updatedSheets.set(newSheet.name, newSheet);
        updateSheets(updatedSheets)
        updateActiveSheet(newSheet.name)
    }

    const handleAdditionOfSubSheet = () => {
        const newSheet = new SheetData(settings.quadratSize);
        newSheet.index = subSheetNames.length;
        newSheet.name = activeSheet + "-" + (newSheet.index + 1);
        newSheet.parentName = activeSheet

        const updatedSheets = new Map(sheets);
        updatedSheets.set(newSheet.name, newSheet);
        updateSheets(updatedSheets)
        updateActiveSubSheet(newSheet.name)
    }

    const handleCopyOfSheet = (sheetNameToCopy: string) => {
        const updatedSheets = new Map(sheets);
        const existingSheetData = sheets.get(sheetNameToCopy);
        if (!existingSheetData) {
            return
        }
        console.log('copying', sheetNameToCopy)
        const newSheet = deepCopy(existingSheetData);
        newSheet.index = sheetNames.length;
        newSheet.name = "Копия " + sheetNameToCopy;

        for (let sheet of Array.from(sheets.values())) {
            if (sheet.parentName === sheetNameToCopy) {
                const copiedSubSheet = deepCopy(sheet);

                if (copiedSubSheet.name.includes(sheetNameToCopy)) {
                    copiedSubSheet.name = copiedSubSheet.name.replaceAll(sheetNameToCopy, newSheet.name)
                } else {
                    copiedSubSheet.name = newSheet.name + " " + copiedSubSheet.name
                }
                copiedSubSheet.parentName = newSheet.name
                console.log(copiedSubSheet)
                console.log(sheet)
                updatedSheets.set(copiedSubSheet.name, copiedSubSheet)
            }
        }


        updatedSheets.set(newSheet.name, newSheet);
        updateSheets(updatedSheets)
        updateActiveSheet(newSheet.name)
    }

    const handleRemovalOfSheet = (sheetName: string) => {
        const updatedSheets = new Map(sheets);
        if (Array.from(updatedSheets.entries()).length === 1) {
            alert("Минимальное количество листов в блок-схеме = 1")
            return;
        }
        updatedSheets.delete(sheetName);
        const subSheets = Array.from(sheets.entries())
            .filter(([key, value]) => value.parentName === sheetName)
            .map(([key, value]) => key);
        subSheets.forEach(sheetName => updatedSheets.delete(sheetName))
        updateSheets(updatedSheets);
        updateActiveSheet(Array.from(updatedSheets.keys())[0])
    }

    const handleRemovalOfSubSheet = (subSheetName: string) => {
        const updatedSheets = new Map(sheets);
        updatedSheets.delete(subSheetName);
        updateSheets(updatedSheets);
        const availableSubSheets = getSubSheetNames(updatedSheets, activeSheet)
        updateActiveSubSheet(availableSubSheets.length > 0 ? availableSubSheets[0] : null)
    }

    const handleSheetNameChange = (newName: string) => {
        const existingNames = Array.from(sheets.keys())
        if (existingNames.includes(newName)) {
            console.log('existing', existingNames)
            console.log('new name', newName)
            alert("Невозможно переименовать, такое имя листа уже занято")
            return;
        }

        const sheetData = sheets.get(activeSheet);
        console.log('saving', sheetData)
        const updatedSheets = deepCopyMap(sheets)
        if (sheetData) {
            const updatedSheetData = deepCopy(sheetData)
            updatedSheetData.name = newName
            Array.from(updatedSheets.values()).forEach(sheet => {
                if (sheet.parentName === activeSheet) {
                    sheet.parentName = newName
                }
            })
            updatedSheets.delete(activeSheet);
            console.log('saving after update', updatedSheets)
            updatedSheets.set(newName, updatedSheetData);
        }

        updateSheets(updatedSheets);
        updateActiveSheet(newName);

    }

    const handleSubSheetNameChange = (newName: string) => {
        if (!activeSubSheet) {
            return
        }

        const sheetData = deepCopy(sheets.get(activeSubSheet));

        if (sheetData) {
            const updatedSheets = deepCopyMap(sheets)
            updatedSheets.delete(activeSubSheet);
            updatedSheets.set(newName, sheetData);

            updateSheets(updatedSheets);
            updateActiveSubSheet(newName);
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "left",
            width: "100%",
            overflow: "scroll"
        }}>
            <SortableTabContainer
                items={sheetNames}
                indicatorColor="secondary"
                value={sheetValue}
                onChange={handleSheetChange}
                onSortEnd={handleDragNDropEnd}
                style={{}}
            >
                {sheetNames
                    .map((sheetName, idx) => <SortableTabItem
                        style={classes.sheetTabItem}
                        sheetName={sheetName}
                        handleNameChange={handleSheetNameChange}
                        onTabSelect={() => {
                            handleSheetChange(null, idx)
                        }}
                        onRemoveTriggered={handleRemovalOfSheet}
                        onDuplicate={handleCopyOfSheet}
                    />)}
                <Tab icon={<AddRoundedIcon/>} onClick={handleAdditionOfSheet}/>
            </SortableTabContainer>
            <Divider/>
            <SortableTabContainer
                items={subSheetNames}
                style={classes.subsheetTabRoot}
                indicatorColor="primary"
                value={subSheetValue}
                onChange={handleSubSheetChange}
                onSortEnd={handleDragNDropEnd}
            >
                {subSheetNames
                    .map((sheetName, idx) => <SortableTabItem
                        sheetName={sheetName}
                        handleNameChange={handleSubSheetNameChange}
                        style={classes.subsheetTabItem}
                        onTabSelect={() => {
                            handleSubSheetChange(null, idx)
                        }}
                        onRemoveTriggered={handleRemovalOfSubSheet}
                        onDuplicate={handleCopyOfSheet}
                    />)}
                <Tab icon={<AddRoundedIcon/>} onClick={handleAdditionOfSubSheet}/>
            </SortableTabContainer>
        </div>
    );
}

const classes = {
    wrapperDiv: {
        width: "100%",
        display: "flex",
        flexDirection: 'column'
    },
    sheetTabItem: {
        fontWeight: "bold",
    },
    subsheetTabItem: {
        minWidth: 150,
        width: 150,
        fontSize: "0.9em",
        alignItems: "center",
        alignContent: "center",
        color: "#2d2c2c"
    },
    subsheetTabRoot: {
        minHeight: 37,
        height: 37,
        width: "100%",
        maxWidth: "100%",
        background: "#e8e8e8"
    }
}
