/** @jsx jsx */
import React, {useCallback, useContext, useState} from "react";
import {css, jsx} from "@emotion/react/macro";
import {SkeletonNode} from "./skeleton-node";
import {BarContext} from "../../context/bar-context";
import {HandType, SkeletonData, TripletData} from "../../model/deprecated/skeleton-data";
import {INote, Note, NoteType} from "../../model/note-data";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {NodeSubtitle} from "./node-subtitle";
import {getMidiNumber} from "../../utils/playback-utils";
import {ClickAwayListener, ListItemText, Menu, MenuItem} from "@material-ui/core";
import {distinct} from "../../utils/js-utils";
import {getTripletByIndex, getTripletDurationByIndex, isPartOfTriplet} from "../../utils/triplet-utils";
import {BulkEditPopupMenu} from "./bulk-edit-popup-menu";
import {SettingsContext} from "../../context/settings-context";
import {getSkeletonHandData, setSkeletonHandData} from "../../utils/skeleton-node-utils";
import {SelectionIndex} from "../../model/selection/selection-index";

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
    handleClearTriplet: (index: SelectionIndex) => void
}


const isHostingTriplet = (triplets: TripletData[], idx: SelectionIndex) => {
    return triplets
        .filter(triplet => triplet.hand === idx.noteHand)
        .filter(triplet => triplet.start === idx.index).length > 0
}

const getCommonValueOfTheAttributeOrDefault = (notes: Note[], attribute: string, defaultValue: string | number | boolean) => {
    let commonValue = notes.length > 0 ? notes[0][attribute] : defaultValue;
    return notes.every(note => note[attribute] === commonValue) ? commonValue : defaultValue
}

const getSelectedIndicesInHand = (selectedNodes: SelectionIndex[], noteHand: HandType) => {
    return selectedNodes
        .filter(index => index.noteHand === noteHand)
        .map(index => index.index);
}

export const Skeleton = ({skeletonIndex}) => {
    const {bars, updateBars, updateSingleBar} = useContext(BarContext);
    const {settings} = useContext(SettingsContext);

    const skeletonData = bars[skeletonIndex]
    const [selectedNodes, setSelectedNodes] = useState<SelectionIndex[]>(new Array<SelectionIndex>());
    const [activeNodeIndex, setActiveNodeIndex] = useState<SelectionIndex | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const [bulkEditMenuAnchorEl, setBulkEditMenuAnchorEl] = useState<null | HTMLElement>(null);

    const getSelectionMode = (idx: number, noteHand: HandType) => {
        const selectionNodeIndices = getSelectedIndicesInHand(selectedNodes, noteHand)

        if (!selectionNodeIndices.includes(idx)) {
            return NodeSelectionMode.NONE
        }
        if (selectionNodeIndices.includes(idx - 1) && selectionNodeIndices.includes(idx + 1)) {
            return NodeSelectionMode.MIDDLE;
        }
        if (selectionNodeIndices.includes(idx - 1)) {
            return NodeSelectionMode.RIGHT;
        }
        if (selectionNodeIndices.includes(idx + 1)) {
            return NodeSelectionMode.LEFT;
        }
        return NodeSelectionMode.STANDALONE;
    }

    const handleNodeSelected = useCallback((event, idx: number, noteHand: HandType) => {
        const handleShiftSelection = () => {
            if (activeNodeIndex === null) {
                setActiveNodeIndex({index: idx, noteHand: noteHand});
            } else {
                const start = Math.min(activeNodeIndex.index, idx);
                const end = Math.max(activeNodeIndex.index, idx);
                const nodesInRange = Array(end - start + 1).fill(0)
                    .map((_, i) => start + i)
                    .map(index => {
                        return {
                            index: index,
                            noteHand: noteHand
                        }
                    });
                console.log(nodesInRange)
                setSelectedNodes(nodesInRange)
            }
        }

        const handleCtrlSelection = () => {
            const maybeIndex = {index: idx, noteHand: noteHand}
            let newSelectedNodes;

            if (selectedNodes.some(entry => entry.index === maybeIndex.index && entry.noteHand === maybeIndex.noteHand)) {
                const index = selectedNodes.findIndex(entry => entry.index === maybeIndex.index && entry.noteHand === maybeIndex.noteHand);
                newSelectedNodes = [...selectedNodes];
                newSelectedNodes.splice(index, 1);
                newSelectedNodes.sort()
            } else {
                newSelectedNodes = [...selectedNodes, maybeIndex];
            }
            setSelectedNodes(newSelectedNodes);
            setActiveNodeIndex({index: idx, noteHand: noteHand});
        }

        if (event.shiftKey) {
            handleShiftSelection()
            event.preventDefault()
        } else if (event.ctrlKey || event.metaKey) {
            handleCtrlSelection()
            event.preventDefault()
        } else {
            setSelectedNodes([]);
            setActiveNodeIndex({index: idx, noteHand: noteHand});
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

            updateSingleBar(skeletonIndex, updatedSkeleton)
            // const updatedBars = [...bars];
            // updatedBars[skeletonIndex] = updatedSkeleton;
            // updateBars(updatedBars)

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

    const openBulkEditPopupMenu = (e) => {
        setBulkEditMenuAnchorEl(e.currentTarget)
        // setSelectedNodes([])
        setMenuAnchorEl(null)
    }

    const closeBulkEditPopupMenu = (e) => {
        setBulkEditMenuAnchorEl(null);
    }

    const bulkUpdateNotes = (indices: SelectionIndex[], bulkUpdateFunction: (notes: INote[]) => INote[]) => {

        const updatedSkeletonData = new SkeletonData(settings.quadratSize);
        updatedSkeletonData.right = [...skeletonData.right]
        updatedSkeletonData.left = [...skeletonData.left]
        updatedSkeletonData.triplets = [...skeletonData.triplets]

        console.log('originalSkeleton', skeletonData)

        indices.forEach(selectionIndex => {
            const handDataToUpdate = getSkeletonHandData(updatedSkeletonData, selectionIndex.noteHand)
            const updatedNode = {...handDataToUpdate[selectionIndex.index]}
            const updatedNotes = bulkUpdateFunction(updatedNode.notes)
            updatedNode.notes = updatedNotes
            handDataToUpdate[selectionIndex.index] = updatedNode
            setSkeletonHandData(updatedSkeletonData, handDataToUpdate, selectionIndex.noteHand);
        })
        console.log('updatedSkeleton', updatedSkeletonData)


        updateSingleBar(skeletonIndex, updatedSkeletonData)
    }

    const isNotTripletEligible = () => {
        const aa = selectedNodes.some(selectedNode => selectedNode.noteHand !== selectedNodes[0].noteHand)
        if ((selectedNodes.length !== 2 && selectedNodes.length !== 4 && selectedNodes.length !== 8) || aa) {
            return true;
        }

        if (selectedNodes.some(index => isPartOfTriplet(skeletonData.triplets, index))) {
            return true;
        }
        const selectedIndices = selectedNodes
            .map(selectionIndex => selectionIndex.index)
        return selectedIndices
            .sort()
            .map((value, i) => (selectedIndices[i + 1] - value))
            .some(value => value > 1);
    }


    const initiateTriplet = () => {
        const tripletHand = selectedNodes[0].noteHand
        const tripletData: TripletData = {
            start: Math.min(...getSelectedIndicesInHand(selectedNodes, tripletHand)),
            length: selectedNodes.length,
            hand: tripletHand
        }
        const updatedSkeleton = JSON.parse(JSON.stringify(bars[skeletonIndex]));
        const updatedTriplets = [...updatedSkeleton.triplets, tripletData]
            .filter(distinct);

        updatedSkeleton.triplets = updatedTriplets;
        updateSingleBar(skeletonIndex, updatedSkeleton)

        setSelectedNodes([])
        setMenuAnchorEl(null)
    }


    const clearTriplet = (hostIndex: SelectionIndex) => {
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
        updatedSkeleton.right[hostIndex.index] = new SkeletonNodeData();
        updatedSkeleton.triplets.splice(indexOfTriplet, 1);

        updateSingleBar(skeletonIndex, updatedSkeleton)
    }


    const getTripletProps = (idx: number, noteHand: HandType): TripletHandlingProps => {
        const selectionIndex = {index: idx, noteHand: noteHand}
        return {
            isHostingTriplet: isHostingTriplet(skeletonData.triplets, selectionIndex),
            tripletDuration: getTripletDurationByIndex(skeletonData.triplets, selectionIndex) || 0,
            handleClearTriplet: clearTriplet
        }
    }

    const getNotesBySelectedIndices = (handType: HandType) => {
        const handNotes = handType === HandType.LEFT ? skeletonData.left : skeletonData.right;
        return handNotes
            .filter((el, index) => selectedNodes.includes(index))
            .flatMap(node => node.notes)
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
                                                  tripletProps={getTripletProps(idx, HandType.RIGHT)}
                                    ></NodeSubtitle>
                                    <div key={`${skeletonIndex}-r-${idx}-contextHandler`}
                                         onContextMenu={handleContextMenuClick}>
                                        <SkeletonNode data={noteData}
                                                      setData={setNote(HandType.RIGHT, idx)}
                                                      skeletonIndex={skeletonIndex}
                                                      handType={HandType.RIGHT}
                                                      nodeIndex={idx}
                                                      key={skeletonIndex + '-r-' + idx}
                                                      selectionMode={getSelectionMode(idx, HandType.RIGHT)}
                                                      onSelect={(event) => handleNodeSelected(event, idx, HandType.RIGHT)}
                                                      tripletProps={getTripletProps(idx, HandType.RIGHT)}
                                        ></SkeletonNode>
                                    </div>
                                </div>
                            )}
                    </div>

                    <div className="leftHandRow" css={styles.row}>
                        {skeletonData.left
                            .map((noteData, idx) =>
                                <div css={styles.tempBox} key={`${skeletonIndex}-l-${idx}-contextHandler`}
                                     onContextMenu={handleContextMenuClick}>
                                    <SkeletonNode data={noteData}
                                                  setData={setNote(HandType.LEFT, idx)}
                                                  skeletonIndex={skeletonIndex}
                                                  handType={HandType.LEFT}
                                                  onSelect={(event) => handleNodeSelected(event, idx, HandType.LEFT)}
                                                  nodeIndex={idx}
                                                  selectionMode={getSelectionMode(idx, HandType.LEFT)}
                                                  key={skeletonIndex + '-l-' + idx}
                                                  tripletProps={getTripletProps(idx, HandType.LEFT)}
                                    ></SkeletonNode>
                                    <NodeSubtitle nodeData={noteData}
                                                  midiSummary={leftHandMidiSummary}
                                                  setNotes={setNote(HandType.LEFT, idx)}
                                                  tripletProps={getTripletProps(idx, HandType.LEFT)}
                                    ></NodeSubtitle>
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
                        <MenuItem onClick={openBulkEditPopupMenu}>
                            <ListItemText>Редактировать</ListItemText>
                        </MenuItem>
                        <MenuItem disabled onClick={handleMenuClose}>
                            <ListItemText>Копировать</ListItemText>
                        </MenuItem>
                        <MenuItem disabled onClick={handleMenuClose}>
                            <ListItemText>Удалить</ListItemText>
                        </MenuItem>
                    </Menu>
                    <BulkEditPopupMenu
                        onClose={closeBulkEditPopupMenu}
                        bulkUpdateOperationChange={(bulkOperationFunction) => {
                            bulkUpdateNotes(selectedNodes, bulkOperationFunction)
                        }}

                        anchorEl={bulkEditMenuAnchorEl}
                    ></BulkEditPopupMenu>
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
