import React, {useContext} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import {BarContext} from "../../context/bar-context";
import {SheetData} from "../../model/deprecated/sheet-data";
import {TabElement} from "./tab-element";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import {deepCopy} from "../../utils/js-utils";
import {HorizontalSplit} from "@material-ui/icons";
import {Divider} from "@material-ui/core";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%'
    },
}));

const SortableTabItem = SortableElement(({sheetName, onTabSelect, handleNameChange, onRemoveTriggered, style}) => {
    return (<TabElement
        label={sheetName}
        onNameChange={handleNameChange}
        onTabSelect={onTabSelect}
        onRemoveTriggered={onRemoveTriggered}
        externalStyle={style}
    />)
})

const SortableTabContainer = SortableContainer(({value, indicatorColor, onChange, children, style}) => {
    return <Tabs
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
})

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
        <div style={classes.wrapperDiv}>
            <SortableTabContainer
                axis={"x"}
                indicatorColor="secondary"
                value={sheetValue}
                onChange={handleSheetChange}
                onSortEnd={handleDragNDropEnd}
                style={{}}
            >
                {sheetNames
                    .map((sheetName, idx) => <SortableTabItem
                        index={idx}
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
                axis={"x"}
                style={classes.subsheetTabRoot}
                indicatorColor="primary"
                value={subSheetValue}
                onChange={handleSubSheetChange}
                onSortEnd={handleDragNDropEnd}
            >
                {subSheetNames
                    .map((sheetName, idx) => <SortableTabItem
                        index={idx}
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
        width:"100%"
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
        background:"#e7e7e7"
    }
}
