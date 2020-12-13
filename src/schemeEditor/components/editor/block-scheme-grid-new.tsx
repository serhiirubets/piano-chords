import React, {useContext} from "react"
import {SkeletonData} from "../../model/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button} from "@material-ui/core";
import {PRINTABLE_AREA_ID, QUADRAT_WIDTH} from "../../model/global-constants";
import {SettingsContext} from "../../context/settings-context";
import {arrayMove, SortableContainer, SortableElement} from "react-sortable-hoc";
import {QuadratsContext} from "../../context/quadrats-context";


export interface BlockSchemeGridProps {
}

const AddMoreButton = ({onClick}) => (<div key="addMoreButton" style={{}}>
    <Button variant="outlined" key="addNewSkeletonButton" style={{height: 284, width: 336}}
            onClick={onClick}>
        <PlaylistAddRoundedIcon color="action" style={{fontSize: 60}}></PlaylistAddRoundedIcon>
    </Button>
</div>)

const SortableSkeleton = SortableElement(
    ({item, index, idx, quadrats, setQuadrats}) => {
        const {quads, updateQuads} = useContext(QuadratsContext);

        return <div style={{justifyContent: "center", alignItems: "center"}}>
            <SkeletonWrapper skeletonData={item}
                             setSkeletonData={(data) => {
                                 console.log(quads)
                                 const items = [...quads];
                                 items[idx] = data;
                                 console.log(items)
                                 updateQuads(items);
                             }}
                             quadrats={quads}
                             setQuadrats={updateQuads}
                             index={idx}/>
        </div>
    }
);

const SortableGrid = SortableContainer(({items, handleItemsChange, quadratSize}) => {
        return (<div style={{
            display: "flex",
            width: "100%",
            minWidth: "60vw",
            flexWrap: "wrap",
            flexDirection: "row",
            position: "relative"
        }}>
            {items.map((element, index) =>
                <SortableSkeleton idx={index} key={element.id} item={element}/>
            )}
            <AddMoreButton onClick={() => {
                const newQuadrats = [...items, new SkeletonData(quadratSize)]
                handleItemsChange(newQuadrats)
            }}/>
        </div>)
    }
)

export const BlockSchemeGrid = () => {

    const {settings} = useContext(SettingsContext)
    const {quads, updateQuads} = useContext(QuadratsContext)

    const onSortEnd = ({oldIndex, newIndex}) => {
        updateQuads(arrayMove(quads, oldIndex, newIndex));
    };
    return (
        <SortableGrid distance={QUADRAT_WIDTH}
                      items={quads}
                      onSortEnd={onSortEnd}
                      axis={"xy"}
                      handleItemsChange={(newItems) => {
                          updateQuads(newItems)
                      }}
                      quadratSize={settings.quadratSize}
        ></SortableGrid>
    )
}
