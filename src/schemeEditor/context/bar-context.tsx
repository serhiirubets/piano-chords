import React, {useState} from "react";
import {BarContextData} from "../model/deprecated/bar-context-data";
import {SkeletonData} from "../model/deprecated/skeleton-data";

const defaultSettings :BarContextData= {
    bars:[new SkeletonData(8)],
    updateBars:(newValue) =>{},
    barSize:8,
    updateBarSize:(newValue) =>{}

}

export const BarContext = React.createContext(defaultSettings);

export const BarContextProvider = (props: any) => {
    const [quads, setQuads] = useState([new SkeletonData(8)]);
    const [quadSize, setQuadSize] = useState(8);

    return (
        <BarContext.Provider value={{bars: quads, updateBars: setQuads, barSize: quadSize, updateBarSize:setQuadSize}}>
            {props.children}
        </BarContext.Provider>
    )
}
