import React, {useState} from "react"
import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {MinorType, SelectedScale} from "../../model/SelectedScale";
import {majorFlat, majorSharp, minorFlat, minorSharp} from "../../data/scale-notes";
import {useGlobalStyles} from "../../App";
import {ResponsivePiano} from "./responsive-piano";
import {QuintTreeButtons} from "./quint-tree-buttons";
import {TestType} from "../test-screen";

export interface TestPianoComponentProps {
    testType: string;
    scale: string;
    minorType: MinorType;
    isAnswerDisplayed: boolean;


}

export const TestPianoComponent = ({testType, scale, minorType, isAnswerDisplayed}: TestPianoComponentProps) => {
    const classes = useGlobalStyles();

    return (
        <div>
            {/*===============KEYBOARD WITH ANSWER=======================*/}
            {testType === 'playNotes' && (isAnswerDisplayed ?
                < ResponsivePiano selectedScale={scale} minorType={minorType} showNotesOnStart={true}
                                  isTestMode={false}/>
                :
                < ResponsivePiano showNotesOnStart={false}
                                  isTestMode={true}/>)
            }

            {/*===============TEST TYPE --- GUESS SCALE=======================*/}
            {/*===============CARD WITH SCALE TASK=======================*/}
            {testType !== 'playNotes' &&
            <div>
                <ResponsivePiano selectedScale={scale} minorType={minorType}
                                 showNotesOnStart={scale !== undefined && testType !== 'listenAndName'}
                                 isTestMode={true}/>
            </div>
            }
        </div>
    );
}
