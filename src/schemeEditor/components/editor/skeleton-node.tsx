/** @jsx jsx */
import React, {useContext, useEffect, useState} from "react";
import {jsx} from "@emotion/react/macro";
import {DOT_WIDTH, QUADRAT_WIDTH, SMALL_DOT_WIDTH} from "../../model/global-constants";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {TextField} from "@material-ui/core";
import {HandType} from "../../model/deprecated/skeleton-data";
import {Note, PlaybackDuration, PlaybackOffset} from "../../model/note-data";
import {SettingsContext} from "../../context/settings-context";
import {getEffectiveNodeColor, getOriginalText} from "../../utils/skeleton-node-utils";
import {NodeSelectionMode, TripletHandlingProps} from "./skeleton";
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import {groupBy} from "../../utils/js-utils";
import {getTripletEffectiveParameters} from "../../utils/triplet-utils";

const DISALLOWED_KEYS_PATTERN = /[^a-gmA-G#:\s\/0-9\*]/g
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


const parseInputToTheNotes = (stringValue: string, defaultOctave: number, tripletProps: TripletHandlingProps): Note[] => {
    if (stringValue.length == 0) {
        return []
    }
    if (stringValue.includes(SIXTEENS_SEPARATOR)) {
        const getOffset = index => index % 2 == 0 ? PlaybackOffset.NONE : PlaybackOffset.HALF;
        const sixteensParts = stringValue.split(SIXTEENS_SEPARATOR);
        return sixteensParts
            .flatMap((sixteens, index) => parseNoteOrChord(sixteens, defaultOctave, PlaybackDuration.HALF, getOffset(index)));
    } else if (stringValue.includes(TRIPLET_SEPARATOR)) {

        //Triplets are either 8th (4 nodes) or 16th (2 nodes)
        const tripletRealValues = getTripletEffectiveParameters(tripletProps);
        const getOffset = index => tripletRealValues.standardOffsets[index];

        const tripletParts = stringValue.split(TRIPLET_SEPARATOR);
        return tripletParts
            .flatMap((triplet, index) => parseNoteOrChord(triplet, defaultOctave, tripletRealValues.idealDuration, getOffset(index)));
    }

    return parseNoteOrChord(stringValue, defaultOctave, PlaybackDuration.FULL, PlaybackOffset.NONE);
}

const parseNoteOrChord = (stringValue: string, defaultOctave: number, duration: PlaybackDuration, offset: PlaybackOffset): Note[] => {
    return stringValue.split(CHORD_SEPARATOR)
        .map(s => parseNote(s, defaultOctave))
        .filter(note => note.note !== '')
        .map(note => {
            note.duration = duration;
            note.playbackOffset = offset;
            return note;
        });
}

const parseNote = (stringValue: string, defaultOctave: number): Note => {

    const octaveMatches = stringValue.match(/[0-9]{1}/g);

    const octave = octaveMatches && octaveMatches.length > 0 ? Number(octaveMatches[0]) : defaultOctave;
    const noteText = stringValue.replace(/\d/g, '');
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
           rgba(0,0,0,0) 0%,
           rgba(0,0,0,0) calc(50% - 1px),
           rgba(0,0,0,1) 50%,
           rgba(0,0,0,0) calc(50% + 1px),
           rgba(0,0,0,0) 100%)
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

function computeBorderStyle(selectionMode: NodeSelectionMode | string | undefined) {
    const getBorderStyleForValue = (index) => {
        return selectionMode && selectionMode[index] === '1' ? 'solid #381D2A 3px' : 'solid black 1px'
    }
    return {
        borderLeft: getBorderStyleForValue(0),
        borderTop: getBorderStyleForValue(1),
        borderBottom: getBorderStyleForValue(2),
        borderRight: getBorderStyleForValue(3)
    }
}

const computeTripletDisplayProps = (tripletPropsOrFallback: TripletHandlingProps) => {
    return {
        left: 0,
        width: tripletPropsOrFallback.isHostingTriplet ? (QUADRAT_WIDTH) * tripletPropsOrFallback.tripletDuration : QUADRAT_WIDTH,
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

export const SkeletonNode = ({data, setData, nodeIndex, handType, selectionMode, onSelect, onDeselect, tripletProps}: BlockSchemeNodeProps) => {
    const {settings} = useContext(SettingsContext);
    const [isEditMode, setEditMode] = useState(false);
    const [inputText, setInputText] = useState<string>('');
    const tripletPropsOrFallback: TripletHandlingProps = tripletProps || {
        isHostingTriplet: false, tripletDuration: 0, handleClearTriplet: (any) => {
            /*NOOP*/
        }
    }
    useEffect(() => {
        setInputText(data.originalText || getOriginalText(data.notes))
    }, [data])

    const handeSelection = (event) => {
        if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
            setEditMode(true)
        }
        onSelect && onSelect(event);
    };

    const handleFocus = () => {
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

        const filteredValues = event.target.value.replace(DISALLOWED_KEYS_PATTERN, '');
        event.target.value = filteredValues || "";
        setInputText(filteredValues);
    }

    const handleSave = () => {
        const updatedNote = parseInputToTheNotes(inputText,
            settings.defaultOctaves.get(handType)!,
            tripletPropsOrFallback);
        setData(updatedNote, inputText)
        setEditMode(false);
    }

    const prepareTripletItems = () => {
        if (!tripletProps) {
            return
        }
        const groupedNotes = groupBy(data.notes, note => note.playbackOffset);
        const idealTripletValues = getTripletEffectiveParameters(tripletProps)

        const tripletDot = (isPresent) =>
            <div css={{
                width: idealTripletValues.is8thTriplet ? DOT_WIDTH : SMALL_DOT_WIDTH,
                height: idealTripletValues.is8thTriplet ? DOT_WIDTH : SMALL_DOT_WIDTH,
                transform: "rotateY(0deg) rotate(45deg)",
                opacity: isPresent ? 100 : 0,
                background: "red"
            }}/>


        return (<div
            css={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: (QUADRAT_WIDTH - DOT_WIDTH) / 2,
                opacity: isEditMode ? 0 : 100
            }}>

            {idealTripletValues.standardOffsets.map(offset => {
                const isNotePresentAtOffset = groupedNotes.get(offset);
                return tripletDot(isNotePresentAtOffset)
            })}
        </div>)
    }


    return (
        <div css={{justifyContent: "flex-end", display: "flex", position: "relative"}}>
            <div css={{
                ...{
                    position: tripletPropsOrFallback.isHostingTriplet ? "absolute" : "relative",
                    height: QUADRAT_WIDTH,
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
                ...computeBorderStyle(selectionMode),
                ...computeTripletDisplayProps(tripletPropsOrFallback)
            }}

            >
                {tripletPropsOrFallback.isHostingTriplet && <ClearButton
                    onClick={() => {
                        setEditMode(false)
                        setInputText("")
                        tripletPropsOrFallback.handleClearTriplet(nodeIndex)
                    }}/>
                }
                {tripletPropsOrFallback.isHostingTriplet && data.isPresent && prepareTripletItems()}
                <TextField
                    css={{
                        width: (tripletPropsOrFallback.isHostingTriplet ? QUADRAT_WIDTH * tripletPropsOrFallback.tripletDuration : QUADRAT_WIDTH) - 8,
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
                    // defaultValue={getOriginalText(data.notes)}
                />

            </div>
        </div>
    )
}
