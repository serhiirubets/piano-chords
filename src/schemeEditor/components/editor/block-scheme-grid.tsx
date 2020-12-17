import React, {useContext} from "react"
import {SkeletonData} from "../../model/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button} from "@material-ui/core";
import {SettingsContext} from "../../context/settings-context";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import {QuadratsContext} from "../../context/quadrats-context";

const AddMoreButton = ({onClick}) => (<div key="addMoreButton" style={{flexBasis:"50%"}}>
    <Button variant="outlined" key="addNewSkeletonButton" style={{height: 284, width: 336}}
            onClick={onClick}>
        <PlaylistAddRoundedIcon color="action" style={{fontSize: 60}}></PlaylistAddRoundedIcon>
    </Button>
</div>)

const SortableItem = SortableElement(({value, idx}) => {
        const {quads, updateQuads} = useContext(QuadratsContext);

        return (<div style={{flexBasis:"50%"}}>
            <SkeletonWrapper skeletonData={value} setSkeletonData={(data) => {
                const quadsCopy = [...quads]
                quadsCopy[idx] = data;
                updateQuads(quadsCopy)
            }}
                             quadrats={quads}
                             setQuadrats={updateQuads}
                             index={idx}/>
            </div>
        )
    }
);

const SortableGrid = SortableContainer(({children}) => {
    const {quads, updateQuads} = useContext(QuadratsContext);
    const {settings} = useContext(SettingsContext);
    return <div style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
    }}>
        {children.map((value, index) => (
            <SortableItem key={`item-${value.id}`} index={index} idx={index} value={value}/>
        ))}
        <AddMoreButton onClick={()=>updateQuads([...quads, new SkeletonData(settings.quadratSize)])}></AddMoreButton>
    </div>
});


export const BlockSchemeGrid = () => {

    const {settings} = useContext(SettingsContext)
    const {quads, updateQuads} = useContext(QuadratsContext)

    const onSortEnd = ({oldIndex, newIndex}) => {
        updateQuads(arrayMove(quads, oldIndex, newIndex));
    };

    return (
        <SortableGrid
            useDragHandle
            children={quads}
            onSortEnd={onSortEnd}
            axis={"xy"}
            quadratSize={settings.quadratSize}
        ></SortableGrid>
    )
}
