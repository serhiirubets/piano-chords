import React, {useContext, useEffect, useState} from "react"
import {Button, ListItemText, Menu, MenuItem, MenuList, TextField, ToggleButton, Typography} from "@mui/material";
import {SettingsContext} from "../../../context/settings-context";
import {QUADRAT_WIDTH} from "../../../model/global-constants";
import {closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, rectSortingStrategy, SortableContext, useSortable} from '@dnd-kit/sortable'
import SortableItem from "./block-scheme-grid-new-item";
import {BarContext} from "../../../context/bar-context";
import {SkeletonData} from "../../../model/deprecated/skeleton-data";
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {AddMoreButton} from "./block-scheme-grid-new";
import {SheetData} from "../../../model/deprecated/sheet-data";
import {ScrollSyncPane} from 'react-scroll-sync';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import {deepCopy, deepCopyMap} from "../../../utils/js-utils";
import {CSS} from "@dnd-kit/utilities";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {PlaybackModule} from "../menu/playback-module";
import {getQuadratNodeDimension} from "../../../utils/rendering-utils";

const MasteringLineHeader = ({trackName, dragListeners, dragAttributes}) => {
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
        const updatedSheets = deepCopyMap(sheets)
        if (removeOld) {
            updatedSheets.delete(oldSheetName);
        }
        if (newSheetData) {
            updatedSheets.set(newSheetData.name, newSheetData);
        }
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

    const copyBarsToSheet = () => {
        const activeMasterSheet = sheets.get(activeSubSheet||activeSheet);
        const activeTrack = sheets.get(trackName)
        if (activeMasterSheet && activeTrack) {
            const updatedMasterSheet = deepCopy(activeMasterSheet);
            updatedMasterSheet.bars = activeTrack.bars
            storeSheetInState(updatedMasterSheet.name, updatedMasterSheet)
        }
    }

    return (<div style={{
        display: "flex",
        padding: "10px",
        width: "150px",
        backgroundColor: "#4f5b66",
        color: "white",
        position: "sticky",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "2px 2px 2px #888888",
    }}
    >
        <div style={{
            padding: "5px",
            position: "absolute",
            top: 0,
            left: 0,
        }}
             {...dragListeners}
             {...dragAttributes}
        >
            <DragIndicatorIcon></DragIndicatorIcon>
        </div>
        <Typography onContextMenu={handleContextMenuClick}
                    style={{opacity: isEditMode ? 0 : 100}}>{trackName}</Typography>

        <TextField
            variant="standard"
            style={{opacity: isEditMode ? 100 : 0, color: "white"}}
            defaultValue={getTrackOwnName()}
            onKeyUp={(event) => handleTextInput(event)}
        />
        <div style={{display:"flex", flexDirection:"column",width:"100%"}}>
            <PlaybackModule bars={sheets.get(trackName)!.bars} iconColor="white"/>
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
            <Button variant="text"
            onClick={() => copyBarsToSheet()}>
                <Typography color="white" fontSize="x-small">Сделать дорожкой по умолчанию</Typography>
            </Button>
        </div>
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

export const MasteringModeTrackLine = (props) => {
    const {trackName, isAddMoreDisplayed} = props;
    const {updateBars, updateActiveTrack, sheets, activeTrack} = useContext(BarContext);
    const {settings} = useContext(SettingsContext)
    const bars = (sheets.get(trackName) || new SheetData(settings.quadratSize)).bars
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
            backgroundColor: activeTrack === trackName ? "white" : "#E6E6E3",
            border: activeTrack === trackName ? "2px solid #42a5f5" : "1px solid black",
            opacity: isDragging ? 30 : 100
        }}
             onFocus={() => {
                 updateActiveTrack(trackName)
             }}
             ref={setNodeRef}
        >

            <MasteringLineHeader
                trackName={trackName}
                dragAttributes={attributes}
                dragListeners={listeners}
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
                        paddingRight: "70px",
                        overflow: "auto",
                    }}>
                        <SortableContext items={bars} strategy={rectSortingStrategy}>
                            {bars.map((data, index) => (
                                <SortableItem key={data.id} id={data.id} handle={true} value={data} idx={index}
                                              sheetName={trackName}/>
                            ))}
                            {isAddMoreDisplayed &&
                            <AddMoreButton onClick={() => {
                                console.log('updating bars', trackName)
                                updateBars([...bars, new SkeletonData(settings.quadratSize)])
                            }}
                                           opacity={settings.isExportingInProgress ? 0 : 100}/>
                            }
                            <DragOverlay>
                                {activeId ? (
                                    <div
                                        style={{
                                            height: 284,
                                            width: getQuadratNodeDimension(settings.isMasteringMode).quadratWidth * settings.quadratSize,
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
