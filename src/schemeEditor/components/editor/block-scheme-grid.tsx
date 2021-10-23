import React, {useContext} from "react"
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button, Typography} from "@material-ui/core";
import {SettingsContext} from "../../context/settings-context";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import {BarContext} from "../../context/bar-context";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {getFlexBasisValue, getPaddingValue} from "../../utils/rendering-utils";


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

const SortableItem = SortableElement(({idx}) =>
    <div css={{
        flexBasis: "50%",
        minWidth: "100px",
        justifyContent: "center",
        alignItems: "center",
        padding:"0 50 0 50"
    }}><SkeletonWrapper index={idx}></SkeletonWrapper></div>);


const SortableGrid = SortableContainer(({children}) => {
    const {bars, updateBars, activeSheet} = useContext(BarContext);
    const {settings} = useContext(SettingsContext);

    return <div ref={settings.editorElementRef}>
        <div style={{
            alignSelf:"right",
            marginTop:10,
            display:settings.isExportingInProgress ? "inherit": "none"
        }}>
            <Typography variant="h6" style={{fontFamily: "Times New Roman", fontWeight:"bold"}}> {activeSheet}</Typography>
        </div>
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                width: "100%",
                padding: getPaddingValue(settings.quadratSize, settings.isExportingInProgress)

            }}>

            {children.map((value, index) => {
                return (
                    <div style={{

                        flexBasis: getFlexBasisValue(settings.quadratSize, settings.isExportingInProgress),
                    }}>
                        <SortableItem key={`item-${value.id}`} index={index} idx={index}/>
                    </div>)
            })}

            <AddMoreButton
                onClick={() => {
                    updateBars([...bars, new SkeletonData(settings.quadratSize)])
                }}
                opacity={settings.isExportingInProgress ? 0 : 100}
            ></AddMoreButton>
        </div>
    </div>

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
