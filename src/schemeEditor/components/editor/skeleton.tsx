/** @jsx jsx */
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {css, jsx} from "@emotion/react/macro";
import {SkeletonNode} from "./skeleton-node";
import {BarContext} from "../../context/bar-context";
import {HandType} from "../../model/deprecated/skeleton-data";
import {Note} from "../../model/note-data";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {NodeSubtitle} from "./node-subtitle";
import {getMidiNumber} from "../../utils/playback-utils";

function useOutsideAlerter(ref, callback) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export enum NodeSelectionMode {
    NONE = "0000",
    LEFT = "1110",
    RIGHT = "0111",
    MIDDLE = "0110",
    STANDALONE = "1111"
}

export interface HandMidiSummary {
    lowestMidi:number;
    higestMidi:number;
    hand:HandType;
}

export const Skeleton = ({skeletonIndex}) => {
    const {bars, updateBars} = useContext(BarContext);

    const skeletonData = bars[skeletonIndex]
    const [selectedNodes, setSelectedNodes] = useState<number[]>(new Array<number>());
    const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
    const wrapperDivRef = useRef<HTMLDivElement>(null);

    useOutsideAlerter(wrapperDivRef, () => {
        setSelectedNodes([])
    });

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

    console.log(skeletonData)
    const setNote = useCallback((hand: HandType, index: number) => {
        return (notes: Note[], originalText: string) => {
            console.log('notes update', notes)
            const skeletonNodeDataData = new SkeletonNodeData({
                notes: notes,
                isPresent: notes.length > 0,
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

    const getSkeletonMidiSummary = (hand: HandType) =>{
        const handNotes = hand === HandType.RIGHT ? skeletonData.right : skeletonData.left;
        const allMidisInHand = handNotes
            .flatMap(nodeData => nodeData.notes)
            .map(note => getMidiNumber(note));

        return {
            lowestMidi:Math.min(...allMidisInHand),
            higestMidi:Math.max(...allMidisInHand),
            hand:hand
        }

    }

    const rightHandMidiSummary = getSkeletonMidiSummary(HandType.RIGHT);
    const leftHandMidiSummary = getSkeletonMidiSummary(HandType.LEFT);

    return (
        <div>
            <div css={styles.wrapper} ref={wrapperDivRef}>
                <div className="rightHandRow" css={styles.row}>
                    {skeletonData.right
                        .map((noteData, idx) => <div css={styles.tempBox} key={skeletonIndex + '-r-' + idx +'-wrapper'}>
                                <NodeSubtitle nodeData={noteData} midiSummary={rightHandMidiSummary}></NodeSubtitle>
                                <SkeletonNode data={noteData}
                                              setData={setNote(HandType.RIGHT, idx)}
                                              skeletonIndex={skeletonIndex}
                                              handType={HandType.RIGHT}
                                              nodeIndex={idx}
                                              key={skeletonIndex + '-r-' + idx}
                                              selectionMode={getSelectionMode(idx)}
                                              onSelect={(event) => handleNodeSelected(event, idx)}
                                ></SkeletonNode>
                            </div>
                        )}
                </div>

                <div className="leftHandRow" css={styles.row}>
                    {skeletonData.left
                        .map((noteData, idx) =>
                            <div css={styles.tempBox} key={skeletonIndex + '-l-' + idx +'-wrapper'}>
                                <SkeletonNode data={noteData}
                                              setData={setNote(HandType.LEFT, idx)}
                                              skeletonIndex={skeletonIndex}
                                              handType={HandType.LEFT}
                                              nodeIndex={idx}
                                              selectionMode={NodeSelectionMode.NONE}
                                              key={skeletonIndex + '-l-' + idx}></SkeletonNode>
                                <NodeSubtitle nodeData={noteData} midiSummary={leftHandMidiSummary}></NodeSubtitle>
                            </div>
                        )}
                </div>
            </div>
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
    border:dotted blue 1px`
}
