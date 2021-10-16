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

const getCommonValueOfTheAttributeOrDefault = (notes: Note[], attribute: string, defaultValue: string | number | boolean) => {
    let commonValue = notes.length > 0 ? notes[0][attribute] : defaultValue;
    return notes.every(note => note[attribute] === commonValue) ? commonValue : defaultValue
}


export const Skeleton = ({skeletonIndex}) => {
    const {bars, updateBars, updateSingleBar} = useContext(BarContext);
    const {settings} = useContext(SettingsContext);

    const skeletonData = bars[skeletonIndex]
    const [selectedNodes, setSelectedNodes] = useState<number[]>(new Array<number>());
    const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const [bulkEditMenuAnchorEl, setBulkEditMenuAnchorEl] = useState<null | HTMLElement>(null);

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

    const bulkUpdateNotes = (indices: number[], noteHand: HandType, buFunction:(notes: INote[]) => INote[]) => {

        const updatedSkeletonData = new SkeletonData(settings.quadratSize);
        updatedSkeletonData.right = [...skeletonData.right]
        updatedSkeletonData.left = [...skeletonData.left]

        const updatedHand = getSkeletonHandData(updatedSkeletonData, noteHand)
        console.log('originalSkeleton', skeletonData)
        indices.forEach(index => {
            if (indices.includes(index)) {
                const updatedNode = {...updatedHand[index]}
                console.log('passedFromFunc',buFunction)
                const updatedNotes = buFunction(updatedNode.notes)
                updatedNode.notes = updatedNotes
                updatedHand[index] = updatedNode
            }
        })
        console.log('updatedSkeleton', updatedSkeletonData)
        setSkeletonHandData(updatedSkeletonData, updatedHand, noteHand);

        updateSingleBar(skeletonIndex, updatedSkeletonData)
    }

    const isNotTripletEligible = () => {
        if (selectedNodes.length !== 2 && selectedNodes.length !== 4 && selectedNodes.length !== 8) {
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
        updateSingleBar(skeletonIndex, updatedSkeleton)
        // const updatedBars = [...bars];
        // updatedBars[skeletonIndex] = updatedSkeleton;
        // updateBars(updatedBars)

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

        updateSingleBar(skeletonIndex, updatedSkeleton)
        // const updatedBars = [...bars];
        // updatedBars[skeletonIndex] = updatedSkeleton;
        // updateBars(updatedBars)
    }


    const getTripletProps = (idx: number): TripletHandlingProps => {
        return {
            isHostingTriplet: isHostingTriplet(skeletonData.triplets, idx),
            tripletDuration: getTripletDurationByIndex(skeletonData.triplets, idx) || 0,
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
                                                  tripletProps={getTripletProps(idx)}
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
                            bulkUpdateNotes(selectedNodes, HandType.RIGHT, bulkOperationFunction)
                        }}

                        // note={new Note({note:"c", octave:4})}
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
