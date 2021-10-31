import React, {useContext} from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {getFlexBasisValue} from "../../utils/rendering-utils";
import {SettingsContext} from "../../context/settings-context";
import {SkeletonWrapper} from "./skeleton-wrapper";
const SortableItem = (props) => {
    const {settings} = useContext(SettingsContext)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        flex:1,
        transition,
        border: "2px solid red",
        backgroundColor: "#cccccc",
        margin: "10px",
        // zIndex: isDragging && 100 ,
        opacity: isDragging ? 0.3 : 1,
        flexBasis: getFlexBasisValue(settings.quadratSize, settings.isExportingInProgress),
        minWidth: "100px",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 50 0 50"
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div>
                {/*<button {...listeners} {...attributes}>*/}
                {/*    Drag handle*/}
                {/*</button>*/}
                <SkeletonWrapper index={props.idx} id={props.id}/>
            </div>
        </div>
    );
};

export default SortableItem;
