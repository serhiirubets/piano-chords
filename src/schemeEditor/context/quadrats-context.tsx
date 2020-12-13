import React, {useState} from "react";
import {QuadratContextData} from "../model/quadrat-context-data";
import {SkeletonData} from "../model/skeleton-data";

const defaultSettings :QuadratContextData= {
    quads:[new SkeletonData(8)],
    updateQuads:(newvValue) =>{},
    quadSize:8,
    updateQuadSize:(newvValue) =>{}

}

export const QuadratsContext = React.createContext(defaultSettings);

export const QuadratsContextProvider = (props: any) => {
    const [quads, setQuads] = useState([new SkeletonData(8)]);
    const [quadSize, setQuadSize] = useState(8);

    return (
        <QuadratsContext.Provider value={{quads: quads, updateQuads: setQuads, quadSize: quadSize, updateQuadSize:setQuadSize}}>
            {props.children}
        </QuadratsContext.Provider>
    )
}
