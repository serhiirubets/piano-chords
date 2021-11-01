import React, {useContext, useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import {BarContext} from "../../context/bar-context";
import {SheetData} from "../../model/deprecated/sheet-data";
import {TabElement} from "./tab-element";
import {deepCopy} from "../../utils/js-utils";
import {Divider} from "@material-ui/core";
import {
    closestCenter, closestCorners,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

import {restrictToHorizontalAxis,} from '@dnd-kit/modifiers';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}


const SortableTabItem = ({sheetName, onTabSelect, handleNameChange, onRemoveTriggered, style}) => {
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
        cursor: isDragging? "grab": "auto",
        opacity: isDragging ? 0.1 : 1,
        ...style
    };

    return (<TabElement
        externalRef={setNodeRef}
        label={sheetName}
        onNameChange={handleNameChange}
        onTabSelect={onTabSelect}
        onRemoveTriggered={onRemoveTriggered}
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
            console.log(active.id)
            console.log(over.id)
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            console.log('oldIndex', oldIndex)
            console.log('newIndex', newIndex)
            onSortEnd({oldIndex: oldIndex, newIndex: newIndex})
            onChange(null, newIndex)
        }
    };

    return <DndContext
        modifiers={[restrictToHorizontalAxis]}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
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
                            width: "160px",
                            backgroundColor: "silver",
                            opacity: "50%"
                        }}
                    ></div>
                ) : null}
            </DragOverlay>
        </SortableContext>
    </DndContext>
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
                return value.parentName === activeSheetName
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
        const newSheet = new SheetData();
        newSheet.index = sheetNames.length;
        newSheet.name = "Часть " + (newSheet.index + 1);

        const updatedSheets = new Map(sheets);
        updatedSheets.set(newSheet.name, newSheet);
        updateSheets(updatedSheets)
        updateActiveSheet(newSheet.name)
    }

    const handleAdditionOfSubSheet = () => {
        const newSheet = new SheetData();
        newSheet.index = subSheetNames.length;
        newSheet.name = activeSheet + "-" + (newSheet.index + 1);
        newSheet.parentName = activeSheet

        const updatedSheets = new Map(sheets);
        updatedSheets.set(newSheet.name, newSheet);
        updateSheets(updatedSheets)
        updateActiveSubSheet(newSheet.name)
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
            alert("Невозможно переименовать, такое имя листа уже занято")
        }

        const sheetData = sheets.get(activeSheet);
        if (!sheetData) {
            return
        }

        const updatedSheets = new Map(deepCopy(Array.from(sheets.entries()))) as Map<string, SheetData>
        Array.from(updatedSheets.values()).forEach(sheetData => {
            if (sheetData.parentName === activeSheet) {
                sheetData.parentName = newName
            }
        })
        updatedSheets.set(newName, sheetData);

        updatedSheets.delete(activeSheet);
        updateSheets(updatedSheets);
        updateActiveSheet(newName);

    }

    const handleSubSheetNameChange = (newName: string) => {
        if (!activeSubSheet) {
            return
        }

        const sheetData = sheets.get(activeSubSheet);
        if (sheetData) {
            const updatedSheets = new Map(sheets)
                .set(newName, sheetData);

            updatedSheets.delete(activeSubSheet);
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
        background: "#e7e7e7"
    }
}
