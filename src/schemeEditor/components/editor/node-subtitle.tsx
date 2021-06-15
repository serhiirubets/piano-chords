/** @jsx jsx */
import React from "react";
import {jsx} from "@emotion/react/macro";
import {INote} from "../../model/note-data";
import {HandType} from "../../model/deprecated/skeleton-data";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {compareByMidiNumbers, getMidiNumber, isChord} from "../../utils/playback-utils";
import {HandMidiSummary} from "./skeleton";


export interface NodeSubtitleProps {
    nodeData: SkeletonNodeData;
    midiSummary: HandMidiSummary;
    setExternalNoteObject?: any;//(INote, number) => SetStateAction<INote>;
    index?: number;
    handType?: HandType;
    chord?: INote[]
}

// const FeatherSwitch = withStyles({
//     switchBase: {
//         color: red[500],
//         '&$checked': {
//             color: blue[500],
//         },
//         '&$checked + $track': {
//             backgroundColor: blue[300],
//         },
//     },
//     checked: {},
//     track: {color: red[500],},
// })(Switch);


export const NodeSubtitle = ({nodeData, midiSummary}: NodeSubtitleProps) => {
    const MAX_HEIGHT = QUADRAT_WIDTH * 1.75;
    const RECOMMENDED_SCALE = MAX_HEIGHT / 30; //30 =2.5 octaves
    const FONT_HEIGHT = 18;
    const HAND_MULTIPLIER = midiSummary.hand === HandType.RIGHT ? -1 : 1;
    const optimalScale = (MAX_HEIGHT - FONT_HEIGHT) / Math.abs(midiSummary.lowestMidi - midiSummary.higestMidi)
    const labelRef = React.createRef<HTMLDivElement>();
    // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    // const open = Boolean(anchorEl);
    // const id = open ? 'simple-popover' : undefined;

    // const getSingleNoteRelativeTop = (note: INote) => {
    //     const scale = RECOMMENDED_SCALE <= optimalScale ? RECOMMENDED_SCALE : optimalScale;
    //     const baseTopLevel = midiSummary.hand === HandType.RIGHT ? MAX_HEIGHT : 0;
    //     const baseBottomLevel = midiSummary.hand === HandType.RIGHT ? MAX_HEIGHT * 0.1 : MAX_HEIGHT * 0.9;
    //     const noteDiff = midiSummary.hand === HandType.RIGHT ?
    //     const relativeNoteHeight = (getMidiNumber(note) - midiSummary.lowestMidi) * scale;
    //     const relativeNoteTop = baseBottomLevel + relativeNoteHeight;
    //     return baseTopLevel + HAND_MULTIPLIER * relativeNoteTop + HAND_MULTIPLIER * FONT_HEIGHT;
    // }
    const getSingleNoteRelativeTop = (note: INote) => {
        const scale = RECOMMENDED_SCALE <= optimalScale ? RECOMMENDED_SCALE : optimalScale;
        const calculationAttributes = midiSummary.hand === HandType.RIGHT ?
            getSingleNoteRelativeRightHand :
            getSingleNoteRelativeLeftHand;

        const relativeNoteTop = calculationAttributes.baseBottomLevel + calculationAttributes.noteDeltaCalculation(note,scale);
        return calculationAttributes.baseTopLevel + HAND_MULTIPLIER * relativeNoteTop + HAND_MULTIPLIER * FONT_HEIGHT;
    }


    const getSingleNoteRelativeRightHand = {
        baseTopLevel: MAX_HEIGHT,
        baseBottomLevel: MAX_HEIGHT * 0.1,
        noteDeltaCalculation:(note, scale) => (getMidiNumber(note) - midiSummary.lowestMidi) * scale
    }

    const getSingleNoteRelativeLeftHand = {
        baseTopLevel: 0,
        baseBottomLevel: -1*MAX_HEIGHT*0.2,
        noteDeltaCalculation: (note, scale) => (midiSummary.higestMidi - getMidiNumber(note)) * scale
    }


    const getChordNoteHeights = (chord: INote[]) => {
        const highNotes = ['b', 'd', 'f'];
        const lowNotes = ['g'];
        const chordTops = chord
            .sort(compareByMidiNumbers)
            .map(note => {
                console.log(note.note, getSingleNoteRelativeTop(note))
                return getSingleNoteRelativeTop(note)
            });

        const isSpreadRequired = chordTops.slice(1)
            .map((item, index) => {
                return item - chordTops[index]
            })
            .filter(distance => distance < FONT_HEIGHT).length > 1;

        if (isSpreadRequired) {
            for (let i = 1; i < chordTops.length; i++) {
                chordTops[i] = chordTops[i - 1] + HAND_MULTIPLIER * FONT_HEIGHT * 0.7;
            }
        }

        console.log('tops', chordTops)

        return chordTops;
    }

    const getChordNoteRelativeTop = (note: INote, allNotes: INote[]) => {
        const chord = allNotes.filter(n => n.playbackOffset === note.playbackOffset);
        chord.sort(compareByMidiNumbers)
        const chordTops = getChordNoteHeights(chord);
        console.log('chordTops', chordTops)
        const noteIndex = chord.indexOf(note);
        return chordTops[noteIndex];
    }


    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    //
    // const handleClose = () => {
    //     console.log('Clicking away')
    //     setAnchorEl(null);
    // };


    const transformFlatSign = (note: INote) => {
        return note.note.length > 1 && note.note.endsWith('b') ?
            note.note.substr(0, note.note.length - 1) + '♭' :
            note.note;
    }

    const constainsChords = isChord(nodeData.notes);
    console.log('is chord', constainsChords)
    return (
        <div>
            {/*<ClickAwayListener>*/}
            <div>
                <div css={{
                    minHeight: MAX_HEIGHT,
                    width: QUADRAT_WIDTH,
                    position: "relative",
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                }}>{
                    nodeData.notes
                        .sort((first, second) => getMidiNumber(second) - getMidiNumber(first))
                        .map(note => <span css={{
                            display: "block",
                            position: "absolute",
                            top: constainsChords ? getChordNoteRelativeTop(note, nodeData.notes) : getSingleNoteRelativeTop(note),
                            left: 0,
                            right: 0,
                            fontFamily: "serif",
                            fontSize: `${FONT_HEIGHT}px`,
                            fontWeight: "bold"
                        }}>{transformFlatSign(note)}</span>)
                }
                </div>

            </div>
            {/*</ClickAwayListener>*/}
        </div>
    )
}


