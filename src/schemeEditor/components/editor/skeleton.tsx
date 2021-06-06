/** @jsx jsx */
import React, {useCallback, useContext, useMemo} from "react";
import {css, jsx} from "@emotion/react/macro";
import {SkeletonNode} from "./skeleton-node";
import {BarContext} from "../../context/bar-context";
import {HandType} from "../../model/deprecated/skeleton-data";
import {Note} from "../../model/note-data";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";

export const Skeleton = ({skeletonIndex}) => {
    const {bars, updateBars} = useContext(BarContext);

    const skeletonData =bars[skeletonIndex]
    console.log(skeletonData)

    const setNote = useCallback((hand:HandType, index:number) => {
        return (notes: Array<Note>) => {
            const skeletonNodeDataData = new SkeletonNodeData({
                notes: notes,
                isPresent: notes.length > 0,
                hand: hand
            });
            console.log('Set notes', notes)
            console.log('Skeleton node data update', skeletonNodeDataData)

            const updatedSkeleton = JSON.parse(JSON.stringify(bars[skeletonIndex]));

            const handsArray = hand === HandType.RIGHT ? updatedSkeleton.right : updatedSkeleton.left;
            handsArray[index] = skeletonNodeDataData;

            const updatedBars = [...bars];
            updatedBars[skeletonIndex] = updatedSkeleton;
            updateBars(updatedBars)

    }},[bars, skeletonIndex])


    return (
        <div>
            <div css={styles.wrapper}>
                <div className="rightHandRow" css={styles.row}>
                    {skeletonData.right
                        .map((noteData, idx) =>
                            <SkeletonNode data={noteData}
                                          setData={setNote(HandType.RIGHT, idx)}
                                          skeletonIndex={skeletonIndex}
                                          handType={HandType.RIGHT}
                                          nodeIndex={idx}
                                          key={skeletonIndex + '-r-' + idx}></SkeletonNode>
                        )}
                </div>

                <div className="leftHandRow" css={styles.row}>
                    {skeletonData.left
                        .map((noteData, idx) =>
                            <SkeletonNode data={noteData}
                                          setData={setNote(HandType.LEFT, idx)}
                                          skeletonIndex={skeletonIndex}
                                          handType={HandType.LEFT}
                                          nodeIndex={idx}
                                          key={skeletonIndex + '-r-' + idx}></SkeletonNode>
                        )}
                </div>
            </div>
        </div>
    )
}
const styles =  {
    wrapper: css`
    display:  flex;
    flex-direction: column;
    padding: 1em`,
    row: css`
    display:  flex;
    flex-direction: row;`
}
