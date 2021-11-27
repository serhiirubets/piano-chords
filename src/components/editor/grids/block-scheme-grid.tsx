import React, {useContext, useEffect, useState} from "react"
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import {Button, ListItemText, Menu, MenuItem, MenuList, Snackbar, SnackbarOrigin, Typography} from "@mui/material";
import {SettingsContext} from "../../context/settings-context";
import {QUADRAT_WIDTH} from "../../../model/global-constants";
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
import BlockSchemeGridItem from "./block-scheme-grid-item";
import {BarContext} from "../../context/bar-context";
import {SkeletonData} from "../../../model/skeleton-entities-data/skeleton-data";
import {getExportViewportWidth, getFlexBasisValue, getPaddingValue} from "../../../utils/rendering-utils";


export const AddMoreButton = ({onClick, onPasteFromBuffer, opacity}) => {

    const {settings} = useContext(SettingsContext);
    const {selectionBuffer} = useContext(BarContext)
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuClose = () => {

        setMenuAnchorEl(null)
    }


    return (<div key="addMoreButton" style={{
        marginTop: "20px",
        marginLeft: "20px",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        opacity: opacity,
        flexBasis: getFlexBasisValue(settings.barSize, settings.isExportingInProgress, settings.isMenuOpen),
    }}>
        <Button variant="outlined" key="addNewSkeletonButton"
                style={{
                    height: 284,
                    width: QUADRAT_WIDTH * settings.barSize,
                    opacity: opacity
                }}
                onClick={onClick}
                onContextMenu={(e) => {
                    e.preventDefault()
                    setMenuAnchorEl(e.currentTarget)
                }}>
            <PlaylistAddRoundedIcon color="action" style={{fontSize: 60}}></PlaylistAddRoundedIcon>
        </Button>
        <Menu
            id="insert-bar-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
        >
            <MenuList dense>
                <MenuItem onClick={() => {
                    onPasteFromBuffer();
                    handleMenuClose();
                }}
                          disabled={selectionBuffer.current.getBar() === null}>
                    <ListItemText primary="Вставить из буффера"/>
                </MenuItem>
            </MenuList>
        </Menu>
    </div>)
}

export interface SnackbarState extends SnackbarOrigin {
    open: boolean;
}

export const BlockSchemeGrid = () => {
    const {bars, activeSheet, activeTrack, updateBars, editableSheetName, selectionBuffer} = useContext(BarContext);
    const {settings} = useContext(SettingsContext)
    const barIds = bars.map(data => data.id);

    const [activeId, setActiveId] = useState(null);
    const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);

    useEffect(() => {
        setSnackbarOpen(Boolean(activeTrack))
    }, [activeTrack, settings.isMasteringMode])

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
        <div style={{height: "100%", position: "relative"}}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                open={isSnackbarOpen}
                onClose={() =>
                    setSnackbarOpen(false)
                }
                message={"Ceйчас открыто: " + activeTrack?.replace("#", ">")}
                key="changeModeNotification"
            />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
            >
                <div ref={settings.editorElementRef}>
                    <div style={{
                        alignSelf: "right",
                        marginTop: 10,
                        display: settings.isExportingInProgress ? "inherit" : "none"
                    }}>
                        <Typography variant="h6"
                                    style={{
                                        fontFamily: "Times New Roman",
                                        fontWeight: "bold"
                                    }}> {activeSheet}</Typography>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: getExportViewportWidth(settings.barSize, settings.isExportingInProgress),
                        padding: getPaddingValue(settings.barSize, settings.isExportingInProgress),
                    }}>

                        <SortableContext items={bars} strategy={rectSortingStrategy}>

                            {bars.map((data, index) => (
                                <BlockSchemeGridItem key={data.id} id={data.id} handle={true} value={data} idx={index}
                                                     sheetName={editableSheetName}/>
                            ))}
                            <AddMoreButton
                                onPasteFromBuffer={() => {
                                    const barToPaste = selectionBuffer.current.getBar()
                                    if (barToPaste) {
                                        updateBars([...bars, barToPaste])
                                    }
                                }}
                                onClick={() => {
                                    updateBars([...bars, new SkeletonData(settings.barSize)])
                                }}
                                opacity={settings.isExportingInProgress ? 0 : 100}/>
                            <DragOverlay>
                                {activeId ? (
                                    <div
                                        style={{
                                            height: 284,
                                            width: QUADRAT_WIDTH * settings.barSize,
                                            backgroundColor: "silver",
                                            opacity: "50%"
                                        }}
                                    />
                                ) : null}
                            </DragOverlay>
                        </SortableContext>
                    </div>
                </div>
            </DndContext>
        </div>
    );
};
