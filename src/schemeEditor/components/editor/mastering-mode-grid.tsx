import React, {useContext, useEffect, useState} from "react"
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import {Button, Typography} from "@mui/material";
import {ScrollSync} from 'react-scroll-sync';
import {BarContext} from "../../../context/bar-context";
import {MasteringModeTrackLine} from "./mastering-mode-track-line";
import {SheetData} from "../../../model/deprecated/sheet-data";
import {closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {handleSheetsDragNDrop} from "../tabpanel/tab-panel";
import {deepCopy, deepCopyMap} from "../../../utils/js-utils";
import {SkeletonData} from "../../../model/deprecated/skeleton-data";
import {SettingsContext} from "../../../context/settings-context";


export const MasteringModeGrid = () => {
    const {activeSheet, activeSubSheet, sheets, updateSheets, updateActiveTrack} = useContext(BarContext);
    const {settings} = useContext(SettingsContext)
    const effectiveSheet = activeSubSheet || activeSheet
    const tracks = Array.from(sheets.entries()).filter(([key, value]) => value.parentName === effectiveSheet && value.isTrack).map(([key, value]) => value).sort((a, b) => a.index - b.index)

    const [trackLength, setTrackLength] = useState(0)
    useEffect(() => {
        const maxLength = Math.max(...tracks.map(track => track.bars.length))
        setTrackLength(maxLength)
    }, [sheets])

    useEffect(() => {
        const effectiveSheetData = sheets.get(effectiveSheet)
        if (tracks.length === 0 && effectiveSheetData) {
            addTrack(effectiveSheetData.bars)
        }
    }, [sheets, activeSheet, activeSubSheet])

    const [activeId, setActiveId] = useState(null);

    const addTrack = (bars?: SkeletonData[]) => {
        const getRandomSkeleton = () => new SkeletonData(settings.quadratSize)
        const barsArray = bars || [...Array(trackLength > 1 ? trackLength : 1)].map(_ => getRandomSkeleton())
        const newTrack = new SheetData(settings.quadratSize)
        newTrack.parentName = effectiveSheet
        newTrack.isTrack = true
        newTrack.isMuted = false
        newTrack.name = effectiveSheet + " # Дорожка " + (tracks.length + 1)
        newTrack.index = tracks.length
        newTrack.bars = barsArray
        const updatedMap = new Map(sheets);
        updatedMap.set(newTrack.name, newTrack)
        updateSheets(updatedMap)
        updateActiveTrack(newTrack.name)
    }

    const addBarToAllTracks = () => {
        const updatedSheets = deepCopyMap(sheets)
        tracks.forEach(original => {
            const updatedTrack = deepCopy(original)
            updatedTrack.bars = [...original.bars, new SkeletonData(settings.quadratSize)]
            updatedSheets.delete(original.name)
            updatedSheets.set(original.name, updatedTrack)
        })
        updateSheets(updatedSheets)
    }

    const sensors = useSensors(
        useSensor(PointerSensor)
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

            handleSheetsDragNDrop({oldIndex: oldIndex, newIndex: newIndex}, tracks, sheets, updateSheets)
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
                width: "100%",
                position: "relative"
            }}>
                <SortableContext items={tracks.map(track => track.name)} strategy={verticalListSortingStrategy}>
                    <ScrollSync>
                        <div>
                            {tracks.map(track =>
                                <MasteringModeTrackLine trackName={track.name}
                                                        isAddMoreDisplayed={track.bars.length < trackLength}
                                                        handle={true}
                                                        key={track.name} id={track.name}
                                ></MasteringModeTrackLine>
                            )}
                        </div>
                    </ScrollSync>
                </SortableContext>
                <div style={{
                    height: "calc(100% - 60px)",
                    position: "absolute",
                    backgroundColor: "white",
                    right: "-2px",
                    zIndex: 20,
                    top: "0",

                }}>
                    <Button variant="outlined" key="addNewBarToTracks"
                            style={{
                                height: "100%",
                                width: "60px",
                                alignItems: "center",
                                alignContent: "center",
                                boxShadow: "-2px -2px 2px #888888"
                            }}
                            onClick={addBarToAllTracks}>
                        <PlaylistAddRoundedIcon color="action"></PlaylistAddRoundedIcon>
                    </Button>
                </div>
                {activeId ? <DragOverlay>
                    <div
                        style={{
                            height: 280,
                            width: "100%",
                            backgroundColor: "silver",
                            opacity: "50%"
                        }}
                    />
                </DragOverlay> : null}
                <div style={{
                    width: "100%",
                    backgroundColor: "#e8e8e8"
                }}>
                    <Button variant="outlined" key="addNewTrackLine"
                            style={{
                                height: 60,
                                width: "100%",
                                alignItems: "center",
                                alignContent: "center",
                                boxShadow: "2px 2px 2px #888888"
                            }}
                            onClick={(e) => addTrack()}>
                        <PlaylistAddRoundedIcon color="action"/>
                        <Typography>Добавить дорожку</Typography>
                    </Button>
                </div>
            </div>
        </DndContext>
    );
};
