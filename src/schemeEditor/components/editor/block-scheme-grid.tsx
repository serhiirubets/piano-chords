import React, {useContext} from "react"
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button} from "@material-ui/core";
import {SettingsContext} from "../../context/settings-context";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import {BarContext} from "../../context/bar-context";
import {QUADRAT_WIDTH} from "../../model/global-constants";


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

const SortableItem = SortableElement(({idx}) =>
    <div css={{
        flexBasis: "50%",
        minWidth: "100px",
        justifyContent: "center",
        alignItems: "center",
    }}><SkeletonWrapper index={idx}></SkeletonWrapper></div>);

const getFlexBasisValue = (barSize:number, isExporting:boolean) =>{
    if (isExporting){
        return "40%"
    }
    return barSize<8 ? "": "40%"
}

const getPaddingValue = (barSize:number, isExporting:boolean) =>{
    if (isExporting){
        return " 0 5em 0 5em"
    }
    return barSize<8 ? "0":" 0 2em 0 2em"
}

const SortableGrid = SortableContainer(({children}) => {
    const {bars, updateBars} = useContext(BarContext);
    const {settings} = useContext(SettingsContext);

    return <div
        ref={settings.editorElementRef}
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
