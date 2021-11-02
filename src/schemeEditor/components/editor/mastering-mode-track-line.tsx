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
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {AddMoreButton} from "./block-scheme-grid-new";
import {SheetData} from "../../model/deprecated/sheet-data";


export const MasteringModeTrackLine = ({trackName}) => {
    const {updateBars, updateActiveTrack, sheets, activeTrack} = useContext(BarContext);
    const {settings} = useContext(SettingsContext)
    console.log('---------')
    console.log(activeTrack)
    console.log(trackName)
    console.log('---------')
    const bars = (sheets.get(trackName)|| new SheetData()).bars
    console.log('bars for '+trackName,bars)
    const barIds = bars.map(data => data.id);

    const [activeId, setActiveId] = useState(null);

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
            flexDirection: "row"
        }}
             onFocus={() => {
                 updateActiveTrack(trackName)
             }
             }>
            <div>
                <Typography>{trackName}</Typography>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToHorizontalAxis]}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    overflowX: "scroll",
                }}>

                    <SortableContext items={bars} strategy={rectSortingStrategy}>
                        {bars.map((data, index) => (
                            <SortableItem key={data.id} id={data.id} handle={true} value={data} idx={index} sheetName={trackName}/>
                        ))}
                        <AddMoreButton onClick={() => {
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
            </DndContext>
        </div>
    );
};
