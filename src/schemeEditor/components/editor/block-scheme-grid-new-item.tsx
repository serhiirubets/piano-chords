import React, {useContext} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
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
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        flex: 1,
        transition,
        margin: "10px",
        opacity: isDragging ? 0.3 : 1,
        flexBasis: getFlexBasisValue(settings.quadratSize, settings.isExportingInProgress, settings.isMenuOpen),
        minWidth: "100px",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 50 0 50",
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div>
                <SkeletonWrapper index={props.idx}
                                 id={props.id}
                                 sortableListeners={listeners}
                                 sheetName={props.sheetName}
                                 sortableAttributes={attributes}/>
            </div>
        </div>
    );
};

export default SortableItem;
