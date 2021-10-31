import React, {useContext, useState} from "react"
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {Box, Button, Typography} from "@material-ui/core";
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
import {getPaddingValue} from "../../utils/rendering-utils";


const AddMoreButton = ({onClick, opacity}) => {
    const {settings} = useContext(SettingsContext);
    return (<div key="addMoreButton" style={{
        marginTop: "20px",
        marginLeft: "10px",
        marginRight: "10px",
        justifyContent: "center",
        opacity: opacity,
        // display: "none"
    }}>
        <Button variant="outlined" key="addNewSkeletonButton"
                style={{
                    height: 284,
                    width: QUADRAT_WIDTH * settings.quadratSize,
                    opacity: opacity
                }}
                onClick={onClick}>
            <PlaylistAddRoundedIcon color="action" style={{fontSize: 60}}></PlaylistAddRoundedIcon>
        </Button>
    </div>)
}


export const BlockSchemeGridNew = () => {
    const {bars, activeSheet, updateBars} = useContext(BarContext);
    const {settings} = useContext(SettingsContext)
    const barIds = bars.map(data => data.id);

    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
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
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
                padding: getPaddingValue(settings.quadratSize, settings.isExportingInProgress)
            }}>
                <div style={{
                    alignSelf: "right",
                    marginTop: 10,
                    display: settings.isExportingInProgress ? "inherit" : "none"
                }}>
                    <Typography variant="h6"
                                style={{fontFamily: "Times New Roman", fontWeight: "bold"}}> {activeSheet}</Typography>
                </div>

                <SortableContext items={bars} strategy={rectSortingStrategy}>

                    {bars.map((data, index) => (
                        <SortableItem key={data.id} id={data.id} handle={true} value={data} idx={index}/>
                    ))}

                    <AddMoreButton onClick={() => {
                        updateBars([...bars, new SkeletonData(settings.quadratSize)])
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
    );
};
