/** @jsx jsx */
import React, {useContext} from "react";
import {jsx} from "@emotion/react/macro";
import {INote, Note, PlaybackDuration, PlaybackOffset} from "../../../model/skeleton-entities-data/note-data";
import {HandType} from "../../../model/skeleton-entities-data/skeleton-data";
import {SkeletonNodeData} from "../../../model/skeleton-entities-data/skeleton-node-data";
import {compareByMidiNumbers, getMidiNumber, isChord} from "../../../utils/playback-utils";
import {HandMidiSummary, TripletHandlingProps} from "./skeleton";
import {ClickAwayListener} from "@mui/material";
import {getOctaveInRussianNotation, getOriginalText} from "../../../utils/skeleton-node-utils";
import {getTripletEffectiveParameters} from "../../../utils/triplet-utils";
import {SettingsContext} from "../../context/settings-context";
import {NoteEditPopupMenu} from "./popup-menus/note-edit-popup-menu";
import {getQuadratNodeDimension} from "../../../utils/rendering-utils";


export interface NodeSubtitleProps {
    nodeData: SkeletonNodeData;
    midiSummary: HandMidiSummary;
    setExternalNoteObject?: any;
    index?: number;
    handType?: HandType;
    chord?: INote[],
    setNotes: any;
    tripletProps?: TripletHandlingProps
}



const NodeSubtitleItem = ({note, hand, onUpdateNote, height, fontHeight, horizontalOffset}) => {
    const {settings} = useContext(SettingsContext)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const transformFlatSign = (note: INote) => {
        return note.note.length > 1 && note.note.endsWith('b') ?
            {
                note: note.note.substr(0, note.note.length - 1),
                isFlat: true
            } :
            {
                note: note.note,
                isFlat: false
            }
    }

    return (
        <ClickAwayListener onClickAway={handlePopoverClose}>
            <div>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    css={{
                        overflow: "wrap",
                        display: "inline-block",
                        position: "absolute",
                        height: `${fontHeight * 0.7}px`,
                        top: height,
                        fontFamily: "serif",
                        fontSize: `${fontHeight}px`,
                        fontWeight: "bold",
                        cursor:"default",
                        border: isHovered ? "solid 1px black" : "none",
                        ...horizontalOffset
                    }}
                    onClick={handleClick}>
                    {note.displayOctave && <sup css={{fontSize: fontHeight * 0.7,
                        color:"#6F2DA8",
                        zIndex:100,
                        position:"absolute",
                        top:"-7px",
                        left:"-7px"
                    }}>{getOctaveInRussianNotation(note.octave)}</sup>}
                    {transformFlatSign(note).note}
                    {transformFlatSign(note).isFlat && <sup css={{fontSize: fontHeight * 0.6}}>♭</sup>}
                    {settings.displayApplicature && <sup css={{fontSize: fontHeight * 0.7, color:"#D65F24"}}>{note.applicature}</sup>}
                </div>
                <NoteEditPopupMenu note={note}
                                 anchorEl={anchorEl}
                                 hand={hand}
                                 onUpdateNote={onUpdateNote}
                                 onClose={handlePopoverClose}
                />
            </div>
        </ClickAwayListener>)
}

export const NodeSubtitle = ({nodeData, midiSummary, setNotes, tripletProps}: NodeSubtitleProps) => {
    const {settings} = useContext(SettingsContext)
    const MAX_HEIGHT = getQuadratNodeDimension(settings.isMasteringMode).quadratWidth * 1.75;
    const RECOMMENDED_SCALE = MAX_HEIGHT / 30; //30 =2.5 octaves
    const FONT_HEIGHT = 18;
    const HAND_MULTIPLIER = midiSummary.hand === HandType.RIGHT ? -1 : 1;
    const optimalScale = (MAX_HEIGHT - FONT_HEIGHT) / Math.abs(midiSummary.lowestMidi - midiSummary.higestMidi)

    const getSingleNoteRelativeTop = (note: INote) => {
        const scale = RECOMMENDED_SCALE <= optimalScale ? RECOMMENDED_SCALE : optimalScale;
        const calculationAttributes = midiSummary.hand === HandType.RIGHT ?
            getSingleNoteRelativeRightHand :
            getSingleNoteRelativeLeftHand;

        const relativeNoteTop = calculationAttributes.baseBottomLevel + calculationAttributes.noteDeltaCalculation(note, scale);
        return calculationAttributes.baseTopLevel + HAND_MULTIPLIER * relativeNoteTop + HAND_MULTIPLIER * FONT_HEIGHT;
    }

    const getSingleNoteRelativeRightHand = {
        baseTopLevel: MAX_HEIGHT,
        baseBottomLevel: MAX_HEIGHT * 0.1,
        noteDeltaCalculation: (note, scale) => (getMidiNumber(note) - midiSummary.lowestMidi) * scale
    }

    const getSingleNoteRelativeLeftHand = {
        baseTopLevel: 0,
        baseBottomLevel: -1 * MAX_HEIGHT * 0.2,
        noteDeltaCalculation: (note, scale) => (midiSummary.higestMidi - getMidiNumber(note)) * scale
    }

    const getChordNoteHeights = (chord: INote[], hand:HandType) => {
        const comparator= hand === HandType.RIGHT ?
                compareByMidiNumbers :
                (a,b) => -1*compareByMidiNumbers(a,b)

        const chordTops = chord
            .sort(comparator)
            .map(note => getSingleNoteRelativeTop(note));

        const isSpreadRequired = chordTops
            .map((value, i) => (chordTops[i + 1] - value))
            .some(value => value < FONT_HEIGHT / 2);

        if (isSpreadRequired) {
            for (let i = 1; i < chordTops.length; i++) {
                chordTops[i] = chordTops[i - 1] + HAND_MULTIPLIER * FONT_HEIGHT * 0.7;
            }
        }
        return chordTops;
    }

    const getChordNoteRelativeTop = (note: INote, allNotes: INote[], hand:HandType) => {
        const chord = allNotes.filter(n => n.playbackOffset === note.playbackOffset);
        chord.sort(compareByMidiNumbers)
        const chordTops = getChordNoteHeights(chord,hand);
        const noteIndex = chord.indexOf(note);
        return chordTops[noteIndex];
    }

    const getNoteHorizontalOffset = (note: INote) => {

        if (note.playbackOffset === PlaybackOffset.NONE && note.duration === PlaybackDuration.HALF) {
            return {right: getQuadratNodeDimension(settings.isMasteringMode).quadratWidth / 2 + 1}
        }
        if (note.playbackOffset === PlaybackOffset.HALF && note.duration === PlaybackDuration.HALF) {
            return {left: getQuadratNodeDimension(settings.isMasteringMode).quadratWidth / 2 + 1}
        }
        if (tripletProps) {
            const paddingOffset = 0.33;
            const effectiveProps = getTripletEffectiveParameters(tripletProps);
            const indexOfNoteInTriplet = effectiveProps.standardOffsets.indexOf(note.playbackOffset)

            const middleOffset = (effectiveProps.standardOffsets[2] - effectiveProps.standardOffsets[0])/2
            const offsetLeft = indexOfNoteInTriplet === 1 ?
                getQuadratNodeDimension(settings.isMasteringMode).quadratWidth * ( middleOffset + paddingOffset):
                getQuadratNodeDimension(settings.isMasteringMode).quadratWidth * (effectiveProps.standardOffsets[indexOfNoteInTriplet] + paddingOffset);
            return {left: offsetLeft}
        }

        return {left: 0, right: 0}
    }


    const handleUpdateOfNode = (oldNote: Note) => (newNote: Note) => {
        const updatedNotes = [...nodeData.notes];
        const indexOfOldNote = updatedNotes.indexOf(oldNote);
        updatedNotes[indexOfOldNote] = newNote
        setNotes(updatedNotes, getOriginalText(updatedNotes, settings.octaveNotation))

    }

    const constainsChords = isChord(nodeData.notes);
    return (
        <div>

            <div>
                <div css={{
                    minHeight: MAX_HEIGHT,
                    width: getQuadratNodeDimension(settings.isMasteringMode).quadratWidth,
                    position: "relative",
                    textAlign: "center",
                }}>{
                    nodeData.notes
                        .sort((first, second) => getMidiNumber(second) - getMidiNumber(first))
                        .map(note => <NodeSubtitleItem
                                note={note}
                                onUpdateNote={handleUpdateOfNode(note)}
                                hand={nodeData.hand}
                                height={constainsChords ? getChordNoteRelativeTop(note, nodeData.notes,nodeData.hand) : getSingleNoteRelativeTop(note)}
                                fontHeight={FONT_HEIGHT}
                                horizontalOffset={getNoteHorizontalOffset(note)}
                            />
                        )
                }
                </div>

            </div>
        </div>
    )
}


