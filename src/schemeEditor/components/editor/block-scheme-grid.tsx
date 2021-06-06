import React, {useContext} from "react"
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button} from "@material-ui/core";
import {SettingsContext} from "../../context/settings-context";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import {BarContext} from "../../context/bar-context";
import {Skeleton} from "./skeleton";

const AddMoreButton = ({onClick}) => (<div key="addMoreButton" style={{flexBasis:"50%"}}>
    <Button variant="outlined" key="addNewSkeletonButton" style={{height: 284, width: 336}}
            onClick={onClick}>
        <PlaylistAddRoundedIcon color="action" style={{fontSize: 60}}></PlaylistAddRoundedIcon>
    </Button>
</div>)

const SortableItem = SortableElement(({value, idx}) => {
    return (<div css={{display:'flex'}}><SkeletonWrapper index={idx}></SkeletonWrapper></div>)
    }
);

const SortableGrid = SortableContainer(({children}) => {
    const {bars, updateBars} = useContext(BarContext);
    const {settings} = useContext(SettingsContext);
    return <div style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
    }}>
        {children.map((value, index) => (
            <SortableItem key={`item-${value.id}`} index={index} idx={index} value={value}/>
        ))}
        <AddMoreButton onClick={()=>updateBars([...bars, new SkeletonData(settings.quadratSize)])}></AddMoreButton>
    </div>
});


export const BlockSchemeGrid = () => {
    const {settings} = useContext(SettingsContext)
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
