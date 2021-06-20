/** @jsx jsx */
import React, {useCallback, useContext, useState} from "react";
import {css, jsx} from "@emotion/react/macro";
import {SkeletonNode} from "./skeleton-node";
import {BarContext} from "../../context/bar-context";
import {HandType, TripletData} from "../../model/deprecated/skeleton-data";
import {Note, NoteType} from "../../model/note-data";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {NodeSubtitle} from "./node-subtitle";
import {getMidiNumber} from "../../utils/playback-utils";
import {ClickAwayListener, ListItemText, Menu, MenuItem} from "@material-ui/core";
import {distinct} from "../../utils/js-utils";

export enum NodeSelectionMode {
    NONE = "0000",
    LEFT = "1110",
    RIGHT = "0111",
    MIDDLE = "0110",
    STANDALONE = "1111"
}

export interface HandMidiSummary {
    lowestMidi: number;
    higestMidi: number;
    hand: HandType;
}

export interface TripletHandlingProps {
    isHostingTriplet: boolean,
    tripletDuration: number,
    handleClearTriplet: (index: number) => void
}


const isHostingTriplet = (triplets: TripletData[], idx: number) => {
    return triplets.filter(triplet => triplet.start === idx).length > 0
}

const isPartOfTriplet = (triplets: TripletData[], index: number) => {
    return getTripletByIndex(triplets, index) !== null
}

const getTripletByIndex = (triplets: TripletData[], idx: number): TripletData | null => {

    const maybeTriplet = triplets
        .filter(triplet => triplet.start <= idx && idx < triplet.start + triplet.length);
    return maybeTriplet.length > 0 ?
        maybeTriplet[0] :
        null;
}

const getTripletDurationByIndex = (triplets: TripletData[], index: number) => {
    const maybeTriplet = getTripletByIndex(triplets, index);

    if (maybeTriplet) {
        return maybeTriplet.length;
    }
}

export const Skeleton = ({skeletonIndex}) => {
    const {bars, updateBars} = useContext(BarContext);

    const skeletonData = bars[skeletonIndex]
    const [selectedNodes, setSelectedNodes] = useState<number[]>(new Array<number>());
    const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const getSelectionMode = (idx: number) => {
        if (!selectedNodes.includes(idx)) {
            return NodeSelectionMode.NONE
        }
        if (selectedNodes.includes(idx - 1) && selectedNodes.includes(idx + 1)) {
            return NodeSelectionMode.MIDDLE;
        }
        if (selectedNodes.includes(idx - 1)) {
            return NodeSelectionMode.RIGHT;
        }
        if (selectedNodes.includes(idx + 1)) {
            return NodeSelectionMode.LEFT;
        }
        return NodeSelectionMode.STANDALONE;
    }

    const handleNodeSelected = useCallback((event, idx: number) => {
        const handleShiftSelection = () => {
            if (activeNodeIndex === null) {
                setActiveNodeIndex(idx);
            } else {
                const start = Math.min(activeNodeIndex, idx);
                const end = Math.max(activeNodeIndex, idx);
                const nodesInRange = Array(end - start + 1).fill(0).map((_, i) => start + i);
                setSelectedNodes(nodesInRange)
            }
        }

        const handleCtrlSelection = () => {
            let newSelectedNodes;

            if (selectedNodes.includes(idx)) {
                const index = selectedNodes.indexOf(idx);
                newSelectedNodes = [...selectedNodes];
                newSelectedNodes.splice(index, 1);
                newSelectedNodes.sort()
            } else {
                newSelectedNodes = [...selectedNodes, idx];
            }

            setSelectedNodes(newSelectedNodes);
            setActiveNodeIndex(idx);
        }

        if (event.shiftKey) {
            handleShiftSelection()
        } else if (event.ctrlKey || event.metaKey) {
            handleCtrlSelection()
        } else {
            setSelectedNodes([]);
            setActiveNodeIndex(idx);
        }

    }, [selectedNodes, activeNodeIndex])

    const setNote = useCallback((hand: HandType, index: number) => {
        return (notes: Note[], originalText: string) => {

            const isAnyFeather = notes.some(note => note.noteType === NoteType.FEATHER);

            const preTransformedNotes = notes.map(note => {
                note.noteType = isAnyFeather ? NoteType.FEATHER : note.noteType
                return note
            })

            const skeletonNodeDataData = new SkeletonNodeData({
                notes: preTransformedNotes,
                isPresent: notes.length > 0,
                type: isAnyFeather ? NoteType.FEATHER : NoteType.REGULAR,
                hand: hand,
                originalText: originalText
            });

            const updatedSkeleton = JSON.parse(JSON.stringify(bars[skeletonIndex]));

            const handsArray = hand === HandType.RIGHT ? updatedSkeleton.right : updatedSkeleton.left;
            handsArray[index] = skeletonNodeDataData;

            const updatedBars = [...bars];
            updatedBars[skeletonIndex] = updatedSkeleton;
            updateBars(updatedBars)

        }
    }, [bars, skeletonIndex])

    const getSkeletonMidiSummary = (hand: HandType) => {
        const handNotes = hand === HandType.RIGHT ? skeletonData.right : skeletonData.left;
        const allMidisInHand = handNotes
            .flatMap(nodeData => nodeData.notes)
            .map(note => getMidiNumber(note));

        return {
            lowestMidi: Math.min(...allMidisInHand),
            higestMidi: Math.max(...allMidisInHand),
            hand: hand
        }

    }

    const rightHandMidiSummary = getSkeletonMidiSummary(HandType.RIGHT);
    const leftHandMidiSummary = getSkeletonMidiSummary(HandType.LEFT);

    const handleContextMenuClick = (e) => {
        if (selectedNodes.length > 0) {
            e.preventDefault()
            setMenuAnchorEl(e.currentTarget)
        }
    }

    const handleMenuClose = (e) => {
        setMenuAnchorEl(null);
    }

    const isNotTripletEligible = () => {
        if (selectedNodes.length !== 2 && selectedNodes.length !== 4) {
            return true;
        }

        if (selectedNodes.some(index => isPartOfTriplet(skeletonData.triplets, index))) {
            return true;
        }

        return selectedNodes
            .sort()
            .map((value, i) => (selectedNodes[i + 1] - value))
            .some(value => value > 1);
    }


    const initiateTriplet = () => {
        const tripletData: TripletData = {start: Math.min(...selectedNodes), length: selectedNodes.length}
        const updatedSkeleton = JSON.parse(JSON.stringify(bars[skeletonIndex]));
        const updatedTriplets = [...updatedSkeleton.triplets, tripletData]
            .filter(distinct);

        updatedSkeleton.triplets = updatedTriplets;

        const updatedBars = [...bars];
        updatedBars[skeletonIndex] = updatedSkeleton;
        updateBars(updatedBars)

        setSelectedNodes([])
        setMenuAnchorEl(null)
    }

    const clearTriplet = (hostIndex: number) => {
        const tripletDataToRemove = getTripletByIndex(skeletonData.triplets, hostIndex);
        if (!tripletDataToRemove) {
            console.log('not found triplet data by index', hostIndex)
            return;
        }

        const indexOfTriplet = skeletonData.triplets.indexOf(tripletDataToRemove);

        if (indexOfTriplet < 0) {
            console.log('not found triplet data ', tripletDataToRemove)
            return;
        }

        const updatedSkeleton = JSON.parse(JSON.stringify(bars[skeletonIndex]));
        updatedSkeleton.right[hostIndex] = new SkeletonNodeData();
        updatedSkeleton.triplets.splice(indexOfTriplet, 1);

        const updatedBars = [...bars];
        updatedBars[skeletonIndex] = updatedSkeleton;
        updateBars(updatedBars)
    }


    const getTripletProps = (idx: number): TripletHandlingProps => {
        return {
            isHostingTriplet: isHostingTriplet(skeletonData.triplets, idx),
            tripletDuration: getTripletDurationByIndex(skeletonData.triplets, idx) || 0,
            handleClearTriplet: clearTriplet
        }
    }

    return (
        <div>
            <ClickAwayListener onClickAway={() => {
                setSelectedNodes([]);
                setMenuAnchorEl(null);
            }}>
                <div css={styles.wrapper}>
                    <div className="rightHandRow" css={styles.row}>
                        {skeletonData.right
                            .map((noteData, idx) => <div css={styles.tempBox}
                                                         key={`${skeletonIndex}-r-${idx}-wrapper`}>
                                    <NodeSubtitle nodeData={noteData}
                                                  midiSummary={rightHandMidiSummary}
                                                  setNotes={setNote(HandType.RIGHT, idx)}
                                    ></NodeSubtitle>
                                    <div key={`${skeletonIndex}-r-${idx}-contextHandler`}
                                         onContextMenu={handleContextMenuClick}>
                                        <SkeletonNode data={noteData}
                                                      setData={setNote(HandType.RIGHT, idx)}
                                                      skeletonIndex={skeletonIndex}
                                                      handType={HandType.RIGHT}
                                                      nodeIndex={idx}
                                                      key={skeletonIndex + '-r-' + idx}
                                                      selectionMode={getSelectionMode(idx)}
                                                      onSelect={(event) => handleNodeSelected(event, idx)}
                                                      tripletProps={getTripletProps(idx)}
                                        ></SkeletonNode>
                                    </div>
                                </div>
                            )}
                    </div>

                    <div className="leftHandRow" css={styles.row}>
                        {skeletonData.left
                            .map((noteData, idx) =>
                                <div css={styles.tempBox} key={`${skeletonIndex}-l-${idx}-contextHandler`}>
                                    <SkeletonNode data={noteData}
                                                  setData={setNote(HandType.LEFT, idx)}
                                                  skeletonIndex={skeletonIndex}
                                                  handType={HandType.LEFT}
                                                  nodeIndex={idx}
                                                  selectionMode={NodeSelectionMode.NONE}
                                                  key={skeletonIndex + '-l-' + idx}></SkeletonNode>
                                    <NodeSubtitle nodeData={noteData}
                                                  midiSummary={leftHandMidiSummary}
                                                  setNotes={setNote(HandType.LEFT, idx)}></NodeSubtitle>
                                </div>
                            )}
                    </div>
                    <Menu
                        id="simple-menu"
                        anchorEl={menuAnchorEl}
                        keepMounted
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem disabled={isNotTripletEligible()} onClick={initiateTriplet}>
                            <ListItemText primary="Триоль"/>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemText>Редактировать</ListItemText>
                        </MenuItem>
                    </Menu>
                </div>
            </ClickAwayListener>
        </div>
    )
}
const styles = {
    wrapper: css`
    display:  flex;
    flex-direction: column;`,
    row: css`
    display:  flex;
    flex-direction: row;`,
    tempBox: css`
    position:relative;
    border:dotted blue 0px`
}
