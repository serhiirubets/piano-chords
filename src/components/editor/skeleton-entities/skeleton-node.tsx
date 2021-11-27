/** @jsx jsx */
import React, {useContext, useEffect, useRef, useState} from "react";
// import {jsx} from "@emotion/react/macro";
import {jsx} from "@emotion/react/macro";
import {SkeletonNodeData} from "../../../model/skeleton-entities-data/skeleton-node-data";
import {TextField} from "@mui/material";
import {HandType} from "../../../model/skeleton-entities-data/skeleton-data";
import {Note, PlaybackDuration, PlaybackOffset} from "../../../model/skeleton-entities-data/note-data";
import {SettingsContext} from "../../context/settings-context";
import {getEffectiveNodeColor, getOriginalText} from "../../../utils/skeleton-node-utils";
import {NodeSelectionMode, TripletHandlingProps} from "./skeleton";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import {groupBy} from "../../../utils/js-utils";
import {getTripletEffectiveParameters} from "../../../utils/triplet-utils";
import {getQuadratNodeDimension} from "../../../utils/rendering-utils";
import {OctaveNotation, parseOctaveNotationToScientific} from "../../../model/skeleton-entities-data/octave-data";

const NOTES_REGEX = /a-gmA-G#\s\//
const SIXTEENS_SEPARATOR = '/'
const CHORD_SEPARATOR = ' '
const TRIPLET_SEPARATOR = ':'

export interface BlockSchemeNodeProps {
    data: SkeletonNodeData;
    setData: (notes: Note[], originalText: string) => void;
    handType: HandType;
    onSelect?: any;
    onDeselect?: any;
    selectionMode?: string;
    nodeIndex: number;
    skeletonIndex: number;
    tripletProps?: TripletHandlingProps
}


const parseInputToTheNotes = (stringValue: string, defaultOctave: number, tripletProps: TripletHandlingProps, octaveNotation: OctaveNotation): Note[] => {
    if (stringValue.length === 0) {
        return []
    }
    if (stringValue.includes(SIXTEENS_SEPARATOR)) {
        const getOffset = index => index % 2 === 0 ? PlaybackOffset.NONE : PlaybackOffset.HALF;
        const sixteensParts = stringValue.split(SIXTEENS_SEPARATOR);
        return sixteensParts
            .flatMap((sixteens, index) => parseNoteOrChord(sixteens, defaultOctave, PlaybackDuration.HALF, getOffset(index), octaveNotation));
    } else if (stringValue.includes(TRIPLET_SEPARATOR)) {
        //Triplets are either 8th (4 nodes) or 16th (2 nodes)
        const tripletRealValues = getTripletEffectiveParameters(tripletProps);
        const getOffset = index => tripletRealValues.standardOffsets[index];

        const tripletParts = stringValue.split(TRIPLET_SEPARATOR);
        return tripletParts
            .flatMap((triplet, index) => parseNoteOrChord(triplet, defaultOctave, tripletRealValues.idealDuration, getOffset(index), octaveNotation));
    }

    return parseNoteOrChord(stringValue, defaultOctave, PlaybackDuration.FULL, PlaybackOffset.NONE, octaveNotation);
}

const parseNoteOrChord = (stringValue: string,
                          defaultOctave: number,
                          duration: PlaybackDuration,
                          offset: PlaybackOffset,
                          octaveNotation: OctaveNotation): Note[] => {
    return stringValue.split(CHORD_SEPARATOR)
        .map(s => parseNote(s, defaultOctave, octaveNotation))
        .filter(note => note.note !== '')
        .map(note => {
            note.duration = duration;
            note.playbackOffset = offset;
            return note;
        });
}

const parseNote = (stringValue: string, defaultOctave: number, octaveNotation: OctaveNotation): Note => {
    const octaveRegexp = octaveNotation.regexp
    const octaveMatches = stringValue.match(octaveRegexp);

    const octave = octaveMatches && octaveMatches.length > 0 ? parseOctaveNotationToScientific(octaveMatches[0], octaveNotation) : defaultOctave;
    const noteText = stringValue.replace(octaveRegexp, '');
    return new Note({note: noteText, octave})
}

const computeBackgroundValue = (noteData: SkeletonNodeData, isEditMode: boolean, isHostingTriplet: boolean) => {
    //No note at all
    if (!noteData.isPresent || isEditMode) {
        return
    }

    //Sixteens note
    if (noteData.notes.filter(note => note.duration === PlaybackDuration.HALF).length > 0) {
        const getGradientDirection = (noteData: Note) => noteData.playbackOffset === PlaybackOffset.NONE ? 'to top left' : 'to bottom right';

        const sixteensSeparator = `
           linear-gradient(to top left,
           transparent 0%,
           transparent calc(50% - 1.5px),
           black 50%,
           transparent calc(50% + 1.5px),
           transparent 100%)
            `
        return [sixteensSeparator, ...noteData.notes.map(note => {
            return `
             linear-gradient(${getGradientDirection(note)},
             rgba(0,0,0,0) 0%,
             rgba(0,0,0,0) 50%,
             ${getEffectiveNodeColor(noteData, isHostingTriplet)} 50%,
             ${getEffectiveNodeColor(noteData, isHostingTriplet)} 100%)
             `
        })].join(',');
    }

    //Regular note
    return getEffectiveNodeColor(noteData, isHostingTriplet);
}

function computeBorderStyle(nodeIndex: number, hand: HandType, barSize: number, selectionMode: NodeSelectionMode | string | undefined) {
    const thinBorder = '0.5px solid #4e4e4e '
    const normalBorder = '2px solid #4e4e4e '
    const selectedBorder = '3px solid #381D2A '
    const getBorderStyleForValue = (index) => {
        return selectionMode && selectionMode[index] === '1' ? selectedBorder : thinBorder
    }
     if (selectionMode === NodeSelectionMode.NONE) {
        return {
            borderLeft: nodeIndex === 0  ? normalBorder : thinBorder,
            borderTop: hand === HandType.RIGHT ? normalBorder : thinBorder,
            borderBottom: hand === HandType.LEFT ? normalBorder : thinBorder,
            borderRight: nodeIndex === barSize -1 ? normalBorder : thinBorder
        }
    }else {
         return {
             borderLeft: getBorderStyleForValue(0),
             borderTop: getBorderStyleForValue(1),
             borderBottom: getBorderStyleForValue(2),
             borderRight: getBorderStyleForValue(3)
         }
     }

}

const computeTripletDisplayProps = (tripletPropsOrFallback: TripletHandlingProps, isMasteringMode: boolean) => {
    return {
        left: 0,
        width: tripletPropsOrFallback.isHostingTriplet ? getQuadratNodeDimension(isMasteringMode).quadratWidth * tripletPropsOrFallback.tripletDuration : getQuadratNodeDimension(isMasteringMode).quadratWidth,
        zIndex: tripletPropsOrFallback.isHostingTriplet ? 3 : 1,
    }
}

const ClearButton = ({onClick}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    return (<div
        css={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 10,
            opacity: isHovered ? 100 : 0,
            border: "solid 1px black"
        }}

        onClick={() => {
            onClick()
        }}

        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <ClearRoundedIcon fontSize="small"/>
    </div>)
}

export const SkeletonNode = ({
                                 data,
                                 setData,
                                 nodeIndex,
                                 handType,
                                 selectionMode,
                                 onSelect,
                                 tripletProps
                             }: BlockSchemeNodeProps) => {
    const transientInputValue = useRef(data.originalText);
    const {settings} = useContext(SettingsContext);
    const [isEditMode, setEditMode] = useState(false);
    const [inputText, setInputText] = useState<string>('');
    const tripletPropsOrFallback: TripletHandlingProps = tripletProps || {
        isHostingTriplet: false, tripletDuration: 0, handleClearTriplet: (any) => {
            /*NOOP*/
        }
    }
    const {quadratWidth, quadratDotWidth, quadratSmallDotWidth} = getQuadratNodeDimension(settings.isMasteringMode)

    useEffect(() => {
        setInputText(data.originalText || getOriginalText(data.notes, settings.octaveNotation))
        transientInputValue.current = data.originalText
    }, [data, settings.octaveNotation])

    const handeSelection = (event) => {
        if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
            setEditMode(true)
        }
        onSelect && onSelect(event);
    };

    const handleFocus = (event) => {
        setEditMode(true)
    };

    const handleNoteInput = (event) => {
        if (!event.target.value) {
            setInputText("")
            return;
        }

        if (event.key === 'Enter') {
            handleSave()
        }
        const DISALLOWED_KEYS = new RegExp(`[^${NOTES_REGEX.source}${settings.octaveNotation.regexpKeys}${tripletPropsOrFallback.isHostingTriplet?":":""}]+`)
        const filteredValues = event.target.value.replace(DISALLOWED_KEYS, '');
        event.target.value = filteredValues || "";
        setInputText(filteredValues);
    }

    const handleSave = () => {

        if (transientInputValue.current === inputText) {
            setEditMode(false);
            return
        }
        const updatedNote = parseInputToTheNotes(inputText,
            settings.defaultOctaves.get(handType)!,
            tripletPropsOrFallback,
            settings.octaveNotation);
        setData(updatedNote, inputText)
        setEditMode(false);
        transientInputValue.current = inputText;
    }

    const prepareTripletItems = () => {
        if (!tripletProps) {
            return
        }
        const groupedNotes = groupBy(data.notes, note => note.playbackOffset);
        const idealTripletValues = getTripletEffectiveParameters(tripletProps)

        const tripletDot = (isPresent) =>
            <div css={{
                width: idealTripletValues.is8thTriplet ? quadratDotWidth : quadratSmallDotWidth,
                height: idealTripletValues.is8thTriplet ? quadratDotWidth : quadratSmallDotWidth,
                transform: "rotateY(0deg) rotate(45deg)",
                opacity: isPresent ? 100 : 0,
                background: handType === HandType.RIGHT ? "red" : "green"
            }}/>


        return (<div
            css={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: (quadratWidth - quadratDotWidth) / 2,
                opacity: isEditMode ? 0 : 100
            }}>

            {idealTripletValues.standardOffsets.map(offset => {
                const isNotePresentAtOffset = groupedNotes.get(offset);
                return tripletDot(isNotePresentAtOffset)
            })}
        </div>)
    }


    return (
        <div css={{justifyContent: "flex-end", display: "flex", position: "relative"}} className="active-skeleton-node">
            <div  css={{
                ...{
                    position: tripletPropsOrFallback.isHostingTriplet ? "absolute" : "relative",
                    height: quadratWidth,
                    flex: 1,
                    display: 'flex',
                    boxSizing: 'border-box',
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                        tripletPropsOrFallback.isHostingTriplet ? "yellow" :
                            selectionMode === NodeSelectionMode.NONE ? 'none' : '#DAE2DF',
                    background: computeBackgroundValue(data, isEditMode, tripletPropsOrFallback.isHostingTriplet),

                },
                ...computeBorderStyle(nodeIndex, handType, settings.barSize, selectionMode),
                ...computeTripletDisplayProps(tripletPropsOrFallback, settings.isMasteringMode)
            }}
                 tabIndex={-1}
            >
                {tripletPropsOrFallback.isHostingTriplet && <ClearButton
                    onClick={() => {
                        setEditMode(false)
                        setInputText("")
                        tripletPropsOrFallback.handleClearTriplet({index: nodeIndex, noteHand: data.hand})
                    }}/>
                }
                {tripletPropsOrFallback.isHostingTriplet && data.isPresent && prepareTripletItems()}
                <TextField
                    css={{
                        width: tripletPropsOrFallback.isHostingTriplet ? quadratWidth * tripletPropsOrFallback.tripletDuration : quadratWidth - 8,
                        height: '100%',
                        opacity: isEditMode ? 100 : 0,
                        position: "absolute",
                    }}
                    tabIndex={1}
                    onFocus={handleFocus}
                    onClick={handeSelection}
                    onChange={handleNoteInput}
                    onKeyUp={handleNoteInput}
                    onBlur={handleSave}
                    value={inputText}
                    variant="standard"
                />

            </div>
        </div>
    )
}
