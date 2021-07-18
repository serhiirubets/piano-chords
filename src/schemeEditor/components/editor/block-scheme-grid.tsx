import React, {useContext, useRef, useState} from "react"
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button} from "@material-ui/core";
import {SettingsContext} from "../../context/settings-context";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import {BarContext} from "../../context/bar-context";
import {Skeleton} from "./skeleton";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import Pdf from "react-to-pdf";
import {TabPanel} from "@material-ui/lab";
import {ScrollableTabs} from "../tabpanel/tab-panel";

const AddMoreButton = ({onClick, opacity}) => {
    const {settings} = useContext(SettingsContext);
    return (<div key="addMoreButton" style={{
        marginTop: "30px",
        marginLeft: "40px",
        marginRight: "10px",
        justifyContent: "center",
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

const SortableItem = SortableElement(({value, idx}) => {
        return (<div css={{
            flexBasis: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            display: "flex",
            flex: 1
        }}><SkeletonWrapper index={idx}></SkeletonWrapper></div>)
    }
);


const SortableGrid = SortableContainer(({children}) => {
    const {bars, updateBars} = useContext(BarContext);
    const {settings} = useContext(SettingsContext);

    return (<div
        ref={settings.editorElementRef}
        style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            width: "100%"
        }}>

        {children.map((value, index) => {
                return (<SortableItem key={`item-${value.id}`} index={index} idx={index} value={value}/>)
            }
        )}

        <AddMoreButton
            onClick={() => {
                updateBars([...bars, new SkeletonData(settings.quadratSize)])
            }}
            opacity={settings.isExportingInProgress ? 0 : 100}
        ></AddMoreButton>
    </div>)

});


export const BlockSchemeGrid = () => {
    const {bars, updateBars} = useContext(BarContext)

    const onSortEnd = ({oldIndex, newIndex}) => {
        updateBars(arrayMove(bars, oldIndex, newIndex));
    };

    return (
            <SortableGrid
                useDragHandle
                children={bars}
                onSortEnd={onSortEnd}
                axis={"xy"}
            ></SortableGrid>
    )
}
