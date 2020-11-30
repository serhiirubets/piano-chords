import GridLayout from 'react-grid-layout';
import {Responsive, WidthProvider} from 'react-grid-layout';
import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {SkeletonData} from "../../model/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button} from "@material-ui/core";
import {DRAGGABLE_CLASSNAME} from "../../model/global-constants";

export interface BlockSchemeGridProps {
    quadrats: Array<SkeletonData>;
    quadratSize: number;
    setQuadrats: Dispatch<SetStateAction<SkeletonData[]>>
    noteDuration: number;

}

export const BlockSchemeGrid = ({quadrats, setQuadrats, quadratSize, noteDuration}: BlockSchemeGridProps) => {
    const ADD_MORE_BUTTON_KEY = 'addMoreButton';

    const getBlockSchemeSkeletonForQuadrats = () => {
        const getXIndex = (num: number) => num % 2
        const getYIndex = (num: number) => Math.floor(num / 2)
        const existingSkeletons = quadrats.map((element, index) => {
            return (<div key={element.id} data-grid={{x: getXIndex(index), y: getYIndex(index), w: 1, h: 1}}>
                    <SkeletonWrapper skeletonData={element} setSkeletonData={(data) => {
                        const items = [...quadrats];
                        items[index] = data;
                        setQuadrats(items);
                    }} quadrats={quadrats} setQuadrats={setQuadrats}
                                     index={index} noteDuration={noteDuration}/>
                </div>
            )
        })

        const addMoreButton = (
            <div key={ADD_MORE_BUTTON_KEY}
                 data-grid={{x: getXIndex(quadrats.length + 1), y: getYIndex(quadrats.length + 1), w: 1, h: 1}}
                 className={DRAGGABLE_CLASSNAME}>
                <Button variant="outlined" key="addNewButton" style={{height: 284, width: 336}}
                        onClick={() => {
                            const newQuadrats = [...quadrats, new SkeletonData(quadratSize)]
                            setQuadrats(newQuadrats)
                        }}>
                    <PlaylistAddRoundedIcon color="action" style={{fontSize: 60}}></PlaylistAddRoundedIcon>
                </Button>
            </div>)
        return [...existingSkeletons, addMoreButton]
    }

    const handleLayoutChange = (layout: { x: number, y: number, i: string }[]) => {
        const newQuadratState = new Array<SkeletonData>();
        const calculateNewIdex = (layoutItem) =>  layoutItem.x + layoutItem.y * 2;

        const indicesBefore = {};
        quadrats.forEach((quad, index) => {
            indicesBefore[quad.id] = index;

        })
        const sortedLayout = layout.sort(
            (a,b) => (calculateNewIdex(a) - calculateNewIdex(b)))

        for(let i = 0; i < sortedLayout.length; i++){
            const layoutItem = sortedLayout[i];
            const itemId = layoutItem.i;
            if(itemId=== ADD_MORE_BUTTON_KEY){
                continue
            }
            newQuadratState.push(quadrats[indicesBefore[itemId]])
        }
        setQuadrats(newQuadratState)
    }

    return (
        <div style={{display: "flex", width: "75vw", flexWrap: "wrap"}}>
            <div style={{position: "relative"}}>
                <GridLayout className="layout" cols={2} rowHeight={284} width={700}
                            draggableHandle={`.${DRAGGABLE_CLASSNAME}`}
                            verticalCompact={true}
                            onDragStop={handleLayoutChange}
                >
                    {getBlockSchemeSkeletonForQuadrats()}
                </GridLayout>
            </div>
        </div>
    )
}
