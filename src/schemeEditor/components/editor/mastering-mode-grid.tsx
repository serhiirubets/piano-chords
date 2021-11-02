import React, {useContext, useState} from "react"
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import {Button} from "@mui/material";
import {ScrollSync} from 'react-scroll-sync';
import {BarContext} from "../../context/bar-context";
import {MasteringModeTrackLine} from "./mastering-mode-track-line";
import {SheetData} from "../../model/deprecated/sheet-data";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {handleSheetsDragNDrop} from "../tabpanel/tab-panel";


export const MasteringModeGrid = () => {
    const {activeSheet, activeSubSheet, sheets, updateSheets, activeTrack, updateActiveTrack} = useContext(BarContext);
    const effectiveSheet = activeSubSheet || activeSheet
    const tracks = Array.from(sheets.entries()).filter(([key, value]) => value.parentName === effectiveSheet && value.isTrack).map(([key, value]) => value).sort((a, b) => a.index - b.index)

    const [activeId, setActiveId] = useState(null);

    const addTrack = () => {
        const newTrack = new SheetData()
        newTrack.parentName = effectiveSheet
        newTrack.isTrack = true
        newTrack.isMuted = false
        newTrack.name = effectiveSheet + " # Дорожка " + (tracks.length + 1)
        newTrack.index = tracks.length
        const updatedMap = new Map(sheets);
        updatedMap.set(newTrack.name, newTrack)
        updateSheets(updatedMap)
        updateActiveTrack(newTrack.name)
    }

    const sensors = useSensors(
        useSensor(PointerSensor,{
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            }
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        const {active, over} = event;
        const trackIds = tracks.map(track => track.name)
        if (active.id !== over.id) {
            const oldIndex = trackIds.indexOf(active.id);
            const newIndex = trackIds.indexOf(over.id);

            handleSheetsDragNDrop({oldIndex:oldIndex, newIndex:newIndex}, tracks,sheets, updateSheets)
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100%"
            }}>
                <SortableContext items={tracks.map(track => track.name)} strategy={verticalListSortingStrategy}>
                    <ScrollSync>
                        <div>
                            {tracks.map(track =>
                                <div
                                    style={{
                                        width: "100%",
                                        backgroundColor: activeTrack === track.name ? "white" : "#E6E6E3",
                                        border: "1px solid black"
                                    }}>
                                    <MasteringModeTrackLine trackName={track.name}></MasteringModeTrackLine>
                                </div>
                            )}
                        </div>
                    </ScrollSync>
                </SortableContext>
                {activeId ? <DragOverlay>
                    <div
                        style={{
                            height: 280,
                            width: "100%",
                            backgroundColor: "silver",
                            opacity: "50%"
                        }}
                    ></div>
                </DragOverlay> : null}
                <div style={{
                    width: "100%",

                }}>
                    <Button variant="outlined" key="addNewTrackLine"
                            style={{
                                height: 60,
                                width: "100%",
                                alignItems: "center",
                                alignContent: "cente"
                            }}
                            onClick={addTrack}>
                        <PlaylistAddRoundedIcon color="action"></PlaylistAddRoundedIcon>
                    </Button>
                </div>
            </div>
        </DndContext>
    );
};
