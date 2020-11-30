import {useGlobalStyles} from "../../../App";
import React, {useState} from "react";
import {SkeletonData, NoteHand} from "../../model/skeleton-data";
import {SkeletonNode} from "./skeleton-node";

export interface BlockSchemeSkeletonProps {
    blockSchemeData: SkeletonData;
    setBlockSchemeData: any;
}

export const Skeleton = ({blockSchemeData, setBlockSchemeData}: BlockSchemeSkeletonProps) => {
    return (
            <div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    {blockSchemeData?.right.map((item, index) => {
                        return <SkeletonNode data={blockSchemeData.getNode(NoteHand.RIGHT, index)}
                                             setData={(data) => {
                                                    const updatedData = blockSchemeData.copyPreservingId();
                                                    updatedData.setNode(NoteHand.RIGHT, index, data);
                                                    setBlockSchemeData(updatedData);
                                                    console.log('Rerendering data', updatedData)
                                                }} handType={NoteHand.RIGHT}/>
                    })}
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    {blockSchemeData?.left.map((item, index) => {
                        return <SkeletonNode data={blockSchemeData.getNode(NoteHand.LEFT, index)}
                                             setData={(data) => {
                                                    const updatedData = blockSchemeData.copyPreservingId();
                                                    updatedData.setNode(NoteHand.LEFT, index, data);
                                                    setBlockSchemeData(updatedData);
                                                    console.log('Rerendering data', updatedData)
                                                }} handType={NoteHand.LEFT}/>
                    })}
                </div>
            </div>
    )
}
