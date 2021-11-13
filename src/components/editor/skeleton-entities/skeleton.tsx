/** @jsx jsx */
import React, {useCallback, useContext, useState} from "react";
import {css, jsx} from "@emotion/react/macro";
import {SkeletonNode} from "./skeleton-node";
import {BarContext} from "../../context/bar-context";
import {HandType, TripletData} from "../../../model/skeleton-entities-data/skeleton-data";
import {INote, Note, NoteType} from "../../../model/skeleton-entities-data/note-data";
import {SkeletonNodeData} from "../../../model/skeleton-entities-data/skeleton-node-data";
import {NodeSubtitle} from "./node-subtitle";
import {getMidiNumber} from "../../../utils/playback-utils";
import {ClickAwayListener, Divider, ListItemText, Menu, MenuItem, MenuList} from "@mui/material";
import {deepCopy, distinct} from "../../../utils/js-utils";
import {getTripletByIndex, getTripletDurationByIndex, isPartOfTriplet} from "../../../utils/triplet-utils";
import {BulkEditPopupMenu} from "./popup-menus/bulk-edit-popup-menu";
import {SettingsContext} from "../../context/settings-context";
import {
    copySkeleton,
    getOriginalText,
    getSkeletonHandData,
    setSkeletonHandData
} from "../../../utils/skeleton-node-utils";
import {SelectionIndex} from "../../../model/selection/selection-index";
import {
    getIndicesLengthAndMinPosition,
    getPositionRelativeToSelectionStart
} from "../../../utils/selection-buffer-utils";
import {SheetData} from "../../../model/skeleton-entities-data/sheet-data";

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

const getSelectedIndicesInHand = (selectedNodes: SelectionIndex[], noteHand: HandType) => {
    return selectedNodes
        .filter(index => index.noteHand === noteHand)
        .map(index => index.index);
}


export const Skeleton = ({skeletonIndex, sheetName}) => {
    const {bars, updateSingleBar, selectionBuffer, sheets} = useContext(BarContext);
    const {settings} = useContext(SettingsContext);

    const skeletonData = (sheets.get(sheetName) || new SheetData(settings.barSize)).bars[skeletonIndex]
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
        return (notes: Note[], originalText: string, noteType?:NoteType, lyrics?:string) => {

            const preTransformedNotes = noteType ? notes.map(note => {
                const updatedNote = deepCopy(note)
                updatedNote.noteType = noteType
                return updatedNote
            }) : notes;

            console.log(`nodeType ${hand} ${index}`, noteType)

            const skeletonNodeDataData = new SkeletonNodeData({
                notes: preTransformedNotes,
                isPresent: notes.length > 0,
                type: noteType,
                hand: hand,
                originalText: originalText,
                lyrics:lyrics ?  lyrics: ""
            });

            const updatedSkeleton = deepCopy(bars[skeletonIndex]);

            const handsArray = hand === HandType.RIGHT ? updatedSkeleton.right : updatedSkeleton.left;
            handsArray[index] = skeletonNodeDataData;

            updateSingleBar(skeletonIndex, updatedSkeleton)
        }
    }, [bars, skeletonIndex])


    const getSkeletonMidiSummary = (hand: HandType) => {
        const handNotes = getSkeletonHandData(skeletonData, hand);
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

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    }

    const openBulkEditPopupMenu = (e) => {
        setBulkEditMenuAnchorEl(e.currentTarget)
        setMenuAnchorEl(null)
    }

    const closeBulkEditPopupMenu = (e) => {
        setBulkEditMenuAnchorEl(null);
    }

    const bulkUpdateNotes = (indices: SelectionIndex[], bulkUpdateFunction: (notes: INote[]) => INote[]) => {
        const updatedSkeletonData = copySkeleton(skeletonData)

        indices.forEach(selectionIndex => {
            const handDataToUpdate = getSkeletonHandData(updatedSkeletonData, selectionIndex.noteHand)
            if (handDataToUpdate[selectionIndex.index].isPresent) {
                const updatedNode = {...handDataToUpdate[selectionIndex.index]}
                const updatedNotes = bulkUpdateFunction(updatedNode.notes)
                updatedNode.notes = updatedNotes
                updatedNode.originalText = getOriginalText(updatedNotes, settings.octaveNotation)
                updatedNode.type = updatedNotes.some(note => note.noteType === NoteType.FEATHER) ? NoteType.FEATHER : NoteType.REGULAR
                handDataToUpdate[selectionIndex.index] = updatedNode
                setSkeletonHandData(updatedSkeletonData, handDataToUpdate, selectionIndex.noteHand);
            }
        })
        updateSingleBar(skeletonIndex, updatedSkeletonData)
    }

    const copyNodesToBuffer = () => {
        selectionBuffer.current.clear()

        selectedNodes.forEach(index => {
            selectionBuffer.current.put(index, getSkeletonHandData(skeletonData, index.noteHand)[index.index])
            if (isHostingTriplet(skeletonData.triplets, index)) {
                const tripletToCopy = getTripletByIndex(skeletonData.triplets, index)
                tripletToCopy && selectionBuffer.current.putTriplet(index, tripletToCopy)
            }
        })

    }

    const pasteFromBuffer = () => {
        const selectionMatches = selectionBuffer.current.doesBufferMatchSelection(selectedNodes)
        if (!selectionMatches) {
            alert("Ячейки, скопированные в исходном квадрате, не соответствуют ячейкам, выделенным в целевом")
            return;
        }
        const positionToPasteFrom = getIndicesLengthAndMinPosition(selectedNodes).maxLengthMinIndex

        if (positionToPasteFrom + selectionBuffer.current.getMaximumBufferLength() > skeletonData.size) {
            alert('Невозможно произвести вставку. Данные вылазят за пределы квадрата')
            return;
        }

        const updatedSkeletonData = copySkeleton(skeletonData)

        selectedNodes.forEach(selectionIndex => {
            const indexOfNode = getPositionRelativeToSelectionStart(selectionIndex, selectedNodes)
            //Might be undefined for nodes covered by triplet ranges
            const updatedNode = selectionBuffer.current.getByRelativePositionAndOffset(indexOfNode, selectionIndex)
            if (updatedNode) {
                const handDataToUpdate = getSkeletonHandData(updatedSkeletonData, selectionIndex.noteHand)
                handDataToUpdate[selectionIndex.index] = updatedNode

                setSkeletonHandData(updatedSkeletonData, handDataToUpdate, selectionIndex.noteHand);
            }
        })


        selectedNodes.forEach(selectionIndex => {
            const indexOfNode = getPositionRelativeToSelectionStart(selectionIndex, selectedNodes)
            const maybeTriplet = selectionBuffer.current.getTripletByPositionAndIndex(indexOfNode, selectionIndex)
            if (maybeTriplet) {
                updatedSkeletonData.triplets.push(maybeTriplet)
            }
        })
        updateSingleBar(skeletonIndex, updatedSkeletonData)
    }

    const clearNodesBySelectionIndices = () => {
        const updatedSkeletonData = copySkeleton(skeletonData)

        selectedNodes.forEach(selectionIndex => {
            const handDataToUpdate = getSkeletonHandData(updatedSkeletonData, selectionIndex.noteHand)
            handDataToUpdate[selectionIndex.index] = new SkeletonNodeData({hand: selectionIndex.noteHand})
            setSkeletonHandData(updatedSkeletonData, handDataToUpdate, selectionIndex.noteHand);
        })

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
        const updatedSkeleton = deepCopy(bars[skeletonIndex]);
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
            return;
        }

        const indexOfTriplet = skeletonData.triplets.indexOf(tripletDataToRemove);

        if (indexOfTriplet < 0) {
            return;
        }

        const updatedSkeleton = deepCopy(bars[skeletonIndex]);
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
                                    <NodeSubtitle
                                        key={skeletonIndex + '-r-subtitle-' + idx}
                                        nodeData={noteData}
                                                  midiSummary={rightHandMidiSummary}
                                                  setNotes={setNote(HandType.RIGHT, idx)}
                                                  tripletProps={getTripletProps(idx, HandType.RIGHT)}
                                        nodeKey={skeletonIndex + '-r-subtitle-' + idx}
                                    />
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
                                        />
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
                                    />
                                    <NodeSubtitle
                                        key={skeletonIndex + '-l-subtitle-' + idx}
                                        nodeData={noteData}
                                                  midiSummary={leftHandMidiSummary}
                                                  setNotes={setNote(HandType.LEFT, idx)}
                                                  tripletProps={getTripletProps(idx, HandType.LEFT)}
                                        nodeKey={skeletonIndex + '-l-subtitle-' + idx}
                                   />
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
                        <MenuList dense>
                            <MenuItem disabled={isNotTripletEligible()} onClick={initiateTriplet}>
                                <ListItemText primary="Триоль"/>
                            </MenuItem>
                            <Divider/>
                            <MenuItem onClick={openBulkEditPopupMenu}>
                                <ListItemText>Редактировать</ListItemText>
                            </MenuItem>
                            <Divider/>
                            <MenuItem onClick={() => {
                                copyNodesToBuffer()
                                setSelectedNodes([])
                                handleMenuClose()
                            }}>
                                <ListItemText>Копировать</ListItemText>
                            </MenuItem>
                            <MenuItem
                                disabled={selectionBuffer.current.isEmpty()}
                                onClick={pasteFromBuffer}>
                                <ListItemText>Вставить</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                clearNodesBySelectionIndices()
                                handleMenuClose()
                            }}>
                                <ListItemText>Удалить</ListItemText>
                            </MenuItem>
                        </MenuList>
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
