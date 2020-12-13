import React, {createRef, useEffect, useRef, useState} from "react";
import {SkeletonData, NoteHand, TripletData} from "../../model/skeleton-data";
import {SkeletonNode} from "./skeleton-node";
import {SkeletonNodeData} from "../../model/skeleton-node-data";
import {ClickAwayListener, Popover, IconButton, Button} from "@material-ui/core";
import Looks3RoundedIcon from '@material-ui/icons/Looks3Rounded';

export interface TripletHandlerProps {
    isHostingTriplet: boolean;
    tripletLength: number
    tripletStartRef: any
    handleTripletRemoval: any
    isDisabled: boolean;
}

export interface BlockSchemeSkeletonProps {
    blockSchemeData: SkeletonData;
    setBlockSchemeData: any
}

export const Skeleton = ({blockSchemeData, setBlockSchemeData}: BlockSchemeSkeletonProps) => {
    const [selected, setSelected] = useState<Array<number>>([]);
    const [popoverAnchor, setPopoverAnchor] = React.useState<Element | null>(null);
    const [triplets, setTriplets] = React.useState<Array<TripletData>>([]);

    const elementRefs = useRef(Array.from({length: blockSchemeData.right.length}, () => React.createRef<HTMLDivElement>()));

    const handleSetData = (data: SkeletonNodeData, noteHand: NoteHand, index: number) => {
        const updatedData = blockSchemeData.copyPreservingId();
        updatedData.setNode(noteHand, index, data);
        setBlockSchemeData(updatedData)
    }

    const handleNoteSelection = (index: number) => {
        if (selected.length === 0) {
            setSelected([index]);
        } else if (selected.length === 1 && index !== selected[0]) {
            const start = Math.min(index, selected[0]);
            const end = Math.max(index, selected[0]);

            const nodesInRange = Array(end - start + 1).fill(0).map((_, i) => start + i);
            setSelected(nodesInRange)

            const approximatelyMiddle = Math.floor((end - start) / 2) + start
            const anchor = elementRefs.current[approximatelyMiddle].current
            setPopoverAnchor(anchor);
            ;
        } else {
            setSelected([])
        }
    }

    const handleTripletCreation = () => {
        handlePopoverClose();
        const firstSelectedNode = selected[0];
        const length = selected.length;
        const tripletHostHtmlElement = elementRefs.current[firstSelectedNode].current
        if (tripletHostHtmlElement) {
            console.log('Focusing first div')
            tripletHostHtmlElement.focus();
        }
        setTriplets([...triplets, {startIndex: firstSelectedNode, length: length}]);

    }

    const handleTripletRemoval = (index: number) => {
        const tripletContainingIndex = triplets.filter(triplet => triplet.startIndex <= index && index <= triplet.startIndex + triplet.length);
        if (tripletContainingIndex.length > 0) {
            const tripletIndex = triplets.indexOf(tripletContainingIndex[0]);
            const updatedValue = [...triplets];
            updatedValue.splice(tripletIndex, 1)
            setTriplets(updatedValue);
        }
    }

    const isHostingTriplet = (index: number) => {
        return triplets.filter(triplet => triplet.startIndex === index).length > 0
    }

    const getTripletByIndex = (index: number) => {
        const maybeTriplet = triplets
            .filter(triplet => triplet.startIndex === index);
        return maybeTriplet.length > 0 ?
            maybeTriplet[0] :
            null;
    }

    const getTripletStartRef = (index: number) => {
        const maybeTriplet = getTripletByIndex(index);
        if (maybeTriplet) {
            return elementRefs.current[maybeTriplet.startIndex];
        }
    }

    const getTripletDurationByIndex = (index: number) => {
        const maybeTriplet = getTripletByIndex(index);
        if (maybeTriplet) {
            return maybeTriplet.length;
        }
    }

    const isPartOfTriplet = (index: number) => {
        return triplets.filter(triplet => index > triplet.startIndex && index <= triplet.startIndex + triplet.length - 1).length > 0
    }

    const handleClearSelection = () => {
        setSelected([])
    }

    const handlePopoverClose = () => {
        setPopoverAnchor(null);
    }

    const getTripletHandlingProps = (index: number) => {
        return {
            isHostingTriplet: isHostingTriplet(index),
            tripletLength: getTripletDurationByIndex(index) || 0,
            tripletStartRef: isPartOfTriplet(index) && getTripletStartRef(index),
            handleTripletRemoval: (i) => handleTripletRemoval(i),
            isDisabled: isPartOfTriplet(index),
            // isFocused:  isHostingTriplet(index)
        }
    }

    const open = Boolean(popoverAnchor);

    const rightHandNodes = blockSchemeData?.right.map((item, index) => {
        return <div ref={elementRefs.current[index]}
                    key={item.id}>
            <SkeletonNode
                data={blockSchemeData.getNode(NoteHand.RIGHT, index)}
                setData={(data) => {
                    handleSetData(data, NoteHand.RIGHT, index)
                }} handType={NoteHand.RIGHT}
                onSelect={() => handleNoteSelection(index)}
                onDeselect={handleClearSelection}
                isSelected={selected?.includes(index)}
                nodeIndex={index}
                tripletHandlingProps={getTripletHandlingProps(index)}
            />
        </div>
    });
    const leftHandNotes = blockSchemeData?.left.map((item, index) => {
        return <SkeletonNode data={blockSchemeData.getNode(NoteHand.LEFT, index)}
                             setData={(data) => {
                                 handleSetData(data, NoteHand.LEFT, index)
                             }} handType={NoteHand.LEFT}
                             isSelected={false}
                             nodeIndex={index}/>
    });

    return (
        <div>
            <Popover
                open={open}
                anchorEl={popoverAnchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleTripletCreation}
                    startIcon={<Looks3RoundedIcon/>}
                >Триоль</Button>
            </Popover>
            <ClickAwayListener onClickAway={() => {
                handleClearSelection();
                handlePopoverClose();
            }}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    {rightHandNodes}
                </div>
            </ClickAwayListener>

            <div style={{display: "flex", flexDirection: "row"}}>
                {leftHandNotes}
            </div>
        </div>
    )
}
