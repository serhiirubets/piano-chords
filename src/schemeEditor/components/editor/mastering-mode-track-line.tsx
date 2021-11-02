import React, {useContext, useEffect, useState} from "react"
import {ListItemText, Menu, MenuItem, MenuList, TextField, ToggleButton, Typography} from "@mui/material";
import {SettingsContext} from "../../context/settings-context";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, rectSortingStrategy, SortableContext, useSortable} from '@dnd-kit/sortable'
import SortableItem from "./block-scheme-grid-new-item";
import {BarContext} from "../../context/bar-context";
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {AddMoreButton} from "./block-scheme-grid-new";
import {SheetData} from "../../model/deprecated/sheet-data";
import {ScrollSyncPane} from 'react-scroll-sync';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import {deepCopy} from "../../utils/js-utils";
import {CSS} from "@dnd-kit/utilities";

const MasteringLineHeader = ({trackName}) => {
    const {updateActiveTrack, sheets, activeSheet, activeSubSheet, updateSheets} = useContext(BarContext);

    const [isEditMode, setEditMode] = useState(false)
    const [updatedName, setUpdatedName] = useState('')
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
    const [isMuted, setMuted] = useState(false)

    const getTrackOwnName = () => {
        return trackName.split('#')[1].trim()
    }

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    }
    const handleContextMenuClick = (e) => {
        e.preventDefault()
        setMenuAnchorEl(e.currentTarget)
        updateActiveTrack(trackName)
    }

    const storeSheetInState = (oldSheetName: string, newSheetData?: SheetData, removeOld = true,) => {
        const updatedSheets = (new Map(deepCopy(Array.from(sheets.entries()))) as Map<string, SheetData>)
        if (removeOld) {
            updatedSheets.delete(oldSheetName);
        }
        if (newSheetData) {
            updatedSheets.set(newSheetData.name, newSheetData);
        }
        console.log('storing', newSheetData)
        updateSheets(updatedSheets)
    }

    const handleMute = (newValue: boolean) => {
        const activeTrackSheet = sheets.get(trackName);
        if (activeTrackSheet) {
            const updatedSheet = deepCopy(activeTrackSheet);
            updatedSheet.isMuted = newValue;
            storeSheetInState(trackName, updatedSheet)
        }
    }

    const handleRename = () => {
        const activeTrackSheet = sheets.get(trackName);
        if (activeTrackSheet) {
            console.log('updatedName')
            const updatedFullName = (activeSubSheet || activeSheet) + " # " + updatedName;
            const updatedSheet = deepCopy(activeTrackSheet);
            updatedSheet.name = updatedFullName;
            console.log('updated sheet', updatedFullName)
            storeSheetInState(trackName, updatedSheet)
            updateActiveTrack(updatedFullName)
        }
    }

    const handleDuplicate = () => {
        const activeTrackSheet = sheets.get(trackName);
        if (activeTrackSheet) {
            const updatedFullName = (activeSubSheet || activeSheet) + " # Копия" + updatedName;
            const updatedSheet = deepCopy(activeTrackSheet);
            updatedSheet.name = updatedFullName;
            storeSheetInState(trackName, updatedSheet, false)
            updateActiveTrack(updatedFullName)
        }
    }

    const handleDelete = () => {
        const activeTrackSheet = sheets.get(trackName);
        if (activeTrackSheet) {
            storeSheetInState(trackName, undefined)
            updateActiveTrack(null)
        }
    }

    const handleTextInput = (event) => {
        if (!event.target.value) {
            return;
        }

        if (event.key === 'Enter') {
            handleRename()
            setEditMode(false)
        }

        if (event.key === 'Escape') {
            setEditMode(false)
        }
        setUpdatedName(event.target.value)
    }

    return (<div style={{
        display: "flex",
        padding: "10px",
        width: "150px",
        backgroundColor: "#4f5b66",
        color: "white",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "2px 2px 2px #888888"
    }}

    >
        <Typography onContextMenu={handleContextMenuClick}
                    style={{opacity: isEditMode ? 0 : 100}}>{trackName}</Typography>
        <TextField
            variant="standard"
            style={{opacity: isEditMode ? 100 : 0, color: "white"}}
            defaultValue={getTrackOwnName()}
            onKeyUp={(event) => handleTextInput(event)}
        />
        <ToggleButton
            value="check"
            selected={isMuted}
            onChange={() => {
                setMuted(!isMuted)
                handleMute(!isMuted)
            }}
            style={{color: "white", borderColor: "white"}}
        >
            {isMuted ? <VolumeMuteRoundedIcon/> : <VolumeUpRoundedIcon/>}
        </ToggleButton>
        <Menu
            id="edit-tab-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
        >
            <MenuList dense>
                <MenuItem onClick={() => {
                    setEditMode(true);
                    handleMenuClose();
                }}>
                    <ListItemText primary="Переименовать"/>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleDuplicate()
                    handleMenuClose();
                }}>
                    <ListItemText primary="Дублировaть"/>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleDelete()
                    handleMenuClose();
                }}>
                    <ListItemText primary="Удалить"/>
                </MenuItem>
            </MenuList>
        </Menu>
    </div>)

}

export const MasteringModeTrackLine = ({trackName}) => {
    const {updateBars, updateActiveTrack, sheets} = useContext(BarContext);
    const {settings} = useContext(SettingsContext)
    const bars = (sheets.get(trackName) || new SheetData()).bars
    const barIds = bars.map(data => data.id);

    const [activeId, setActiveId] = useState(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: trackName});


    const sensors = useSensors(
        useSensor(PointerSensor),
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        const {active, over} = event;

        if (active.id !== over.id) {
            const oldIndex = barIds.indexOf(active.id);
            const newIndex = barIds.indexOf(over.id);

            const updatedBars = arrayMove(bars, oldIndex, newIndex);

            updateBars(updatedBars);
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 30 : 100
        }}
             onFocus={() => {
                 updateActiveTrack(trackName)
             }}
             ref={setNodeRef}
             {...attributes}
             {...listeners}>

            <MasteringLineHeader trackName={trackName}
            />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToHorizontalAxis]}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}>
                <ScrollSyncPane>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        width: "100%",
                        overflow: "auto",
                    }}>

                        <SortableContext items={bars} strategy={rectSortingStrategy}>
                            {bars.map((data, index) => (
                                <SortableItem key={data.id} id={data.id} handle={true} value={data} idx={index}
                                              sheetName={trackName}/>
                            ))}
                            <AddMoreButton onClick={() => {
                                console.log('updating bars', trackName)
                                updateBars
                                ([
                                    ...bars, new SkeletonData
                                    (
                                        settings.quadratSize)])
                            }}
                                           opacity={settings.isExportingInProgress ? 0 : 100}/>
                            <DragOverlay>
                                {activeId ? (
                                    <div
                                        style={{
                                            height: 284,
                                            width: QUADRAT_WIDTH * settings.quadratSize,
                                            backgroundColor: "silver",
                                            opacity: "50%"
                                        }}
                                    ></div>
                                ) : null}
                            </DragOverlay>
                        </SortableContext>
                    </div>
                </ScrollSyncPane>
            </DndContext>
        </div>
    );
};
