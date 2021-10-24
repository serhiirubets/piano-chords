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

const SortableTabItem = SortableElement(({sheetName, onTabSelect, handleNameChange, onRemoveTriggered}) => {
    return (<TabElement
        label={sheetName}
        onNameChange={handleNameChange}
        onTabSelect={onTabSelect}
        onRemoveTriggered={onRemoveTriggered}
    />)
})

const SortableTabContainer = SortableContainer(({value, onChange, children}) => {
    return <Tabs
        value={value}
        onChange={onChange}
        indicatorColor="secondary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
    >
        {children}
    </Tabs>
})

export const ScrollableTabs = () => {

    const {sheets, updateSheets, activeSheet, updateActiveSheet} = useContext(BarContext);
    const [value, setValue] = React.useState(0);

    const sheetNames = Array.from(sheets.entries())
        .sort(([k1, v1], [k2, v2]) => {
            return v1.index - v2.index;
        })
        .map(([k, v]) => k);

    const handleDragNDropEnd = ({oldIndex, newIndex}) => {
        if(oldIndex === newIndex){
            return
        }
        const updatedSheets = new Map();
        const shiftDirection = newIndex > oldIndex? -1 : 1
        const isBetweenOldAndNewPosition = (value) => {
          return shiftDirection < 0 ? oldIndex < value.index && value.index <= newIndex : newIndex<= value.index && value.index < oldIndex
        }
        const isOutsideOldAndNewPosition = (value) => {
            return   shiftDirection < 0 ? value.index < oldIndex || value.index > newIndex :value.index < newIndex || value.index > oldIndex
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

    const handleChange = (event: React.ChangeEvent<{}> | null, newValue: number) => {
        setValue(newValue);
        if (newValue < sheetNames.length) {
            updateActiveSheet(sheetNames[newValue])
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

    const handleNameChange = (newName: string) => {

        const sheetData = sheets.get(activeSheet);
        if (sheetData) {
            const updatedSheets = new Map(sheets)
                .set(newName, sheetData);

            updatedSheets.delete(activeSheet);
            updateSheets(updatedSheets);
            updateActiveSheet(newName);
        }
    }

    return (
        <SortableTabContainer
            axis={"x"}
            value={value}
            onChange={handleChange}
            onSortEnd={handleDragNDropEnd}
        >
            {sheetNames
                .map((sheetName, idx) => <SortableTabItem
                    index={idx}
                    sheetName={sheetName}
                    handleNameChange={handleNameChange}
                    onTabSelect={() => {
                        handleChange(null, idx)
                    }}
                    onRemoveTriggered={handleRemovalOfSheet}
                />)}
            <Tab icon={<AddRoundedIcon/>} onClick={handleAdditionOfSheet}/>
        </SortableTabContainer>
    );
}
