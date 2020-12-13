import GridLayout from 'react-grid-layout';
import {Responsive, WidthProvider} from 'react-grid-layout';
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react"
import {SkeletonData} from "../../model/skeleton-data";
import PlaylistAddRoundedIcon from '@material-ui/icons/PlaylistAddRounded';
import {SkeletonWrapper} from "./skeleton-wrapper";
import {Button, Grid} from "@material-ui/core";
import {DRAGGABLE_CLASSNAME, PRINTABLE_AREA_ID} from "../../model/global-constants";
import {SettingsContext} from "../../context/settings-context";
import {QuadratsContext} from "../../context/quadrats-context";

export interface BlockSchemeGridProps {

}

export const BlockSchemeGrid = () => {
    const ADD_MORE_BUTTON_KEY = 'addMoreButton';
    const {settings} = useContext(SettingsContext)
    const {quads, updateQuads} = useContext(QuadratsContext);

    const getBlockSchemeSkeletonForQuadrats = () => {
        const getXIndex = (num: number) => num % 2
        const getYIndex = (num: number) => Math.floor(num / 2)
        const existingSkeletons = quads.map((element, index) => {
            return (<div key={element.id} data-grid={{x: getXIndex(index), y: getYIndex(index), w: 1, h: 1}}>
                    <SkeletonWrapper skeletonData={element} setSkeletonData={(data) => {
                        console.log('New data',data)
                        const items = [...quads];
                        items[index] = data;
                        console.log('new array', items)
                        updateQuads(items);
                    }} quadrats={quads} setQuadrats={updateQuads}
                                     index={index}/>
                </div>
            )
        })

        const addMoreButton = (
            <div key={ADD_MORE_BUTTON_KEY}
                 data-grid={{x: getXIndex(quads.length + 1), y: getYIndex(quads.length + 1), w: 1, h: 1}}
                 className={DRAGGABLE_CLASSNAME}>
                <Button variant="outlined" key="addNewButton" style={{height: 284, width: 336}}
                        onClick={() => {
                            const newQuadrats = [...quads, new SkeletonData(settings.quadratSize)]
                            updateQuads(newQuadrats)
                        }}>
                    <PlaylistAddRoundedIcon color="action" style={{fontSize: 60}}></PlaylistAddRoundedIcon>
                </Button>
            </div>)
        return [...existingSkeletons, addMoreButton]
    }

    const handleLayoutChange = (layout: { x: number, y: number, i: string }[]) => {
        const newQuadratState = new Array<SkeletonData>();
        const calculateNewIdex = (layoutItem) => layoutItem.x + layoutItem.y * 2;

        const indicesBefore = {};
        quads.forEach((quad, index) => {
            indicesBefore[quad.id] = index;

        })
        const sortedLayout = layout.sort(
            (a, b) => (calculateNewIdex(a) - calculateNewIdex(b)))

        for (let i = 0; i < sortedLayout.length; i++) {
            const layoutItem = sortedLayout[i];
            const itemId = layoutItem.i;
            if (itemId === ADD_MORE_BUTTON_KEY) {
                continue
            }
            newQuadratState.push(quads[indicesBefore[itemId]])
        }
        updateQuads(newQuadratState)
    }
//TODO: make sesizable
    return (
        <div style={{display: "flex", width: "100%", flexWrap: "wrap"}}>
            <div style={{position: "relative"}} id={PRINTABLE_AREA_ID}>
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
