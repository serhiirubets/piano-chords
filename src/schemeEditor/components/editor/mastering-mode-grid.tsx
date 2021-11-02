import React, {useContext, useState} from "react"
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import {Button, Typography} from "@mui/material";
import {SettingsContext} from "../../context/settings-context";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates} from '@dnd-kit/sortable'
import SortableItem from "./block-scheme-grid-new-item";
import {BarContext} from "../../context/bar-context";
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import {getExportViewportWidth, getFlexBasisValue, getPaddingValue} from "../../utils/rendering-utils";
import {MasteringModeTrackLine} from "./mastering-mode-track-line";
import {SheetData} from "../../model/deprecated/sheet-data";


export const MasteringModeGrid = () => {
    const {activeSheet, activeSubSheet, sheets, updateSheets, activeTrack, updateActiveTrack} = useContext(BarContext);
    const {settings} = useContext(SettingsContext)
    const effectiveSheet = activeSubSheet || activeSheet
    const tracks = Array.from(sheets.entries()).filter(([key, value]) => value.parentName === effectiveSheet && value.isTrack).map(([key, value])=> value)

    const addTrack = () => {
        const newTrack = new SheetData()
        newTrack.parentName = effectiveSheet
        newTrack.isTrack = true
        newTrack.name = effectiveSheet+ "- Дорожка " + (tracks.length +1)
        const updatedMap = new Map(sheets);
        updatedMap.set(newTrack.name, newTrack)
        updateSheets(updatedMap)
        updateActiveTrack(newTrack.name)
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <div>
                {tracks.map(track => <div
                    style={{width: "100%", backgroundColor: activeTrack === track.name? "white":"gray", border: "1px solid black"}}>
                    <MasteringModeTrackLine trackName={track.name}></MasteringModeTrackLine>
                </div>)}
            </div>
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
    );
};
