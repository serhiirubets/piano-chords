/** @jsx jsx */
import React, {useContext} from "react";
import {jsx} from "@emotion/react/macro";
import {INote, Note, NoteType, PlaybackDuration, PlaybackOffset} from "../../model/note-data";
import {HandType} from "../../model/deprecated/skeleton-data";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {compareByMidiNumbers, getMidiNumber, isChord} from "../../utils/playback-utils";
import {HandMidiSummary, TripletHandlingProps} from "./skeleton";
import {
    Checkbox,
    ClickAwayListener,
    FormControlLabel,
    Popover,
    Switch,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import {blue, red} from "@material-ui/core/colors";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import {getOctaveInRussianNotation, getOriginalText} from "../../utils/skeleton-node-utils";
import {getTripletEffectiveParameters} from "../../utils/triplet-utils";
import {SettingsContext} from "../../context/settings-context";


export interface NodeSubtitleProps {
    nodeData: SkeletonNodeData;
    midiSummary: HandMidiSummary;
    setExternalNoteObject?: any;//(INote, number) => SetStateAction<INote>;
    index?: number;
    handType?: HandType;
    chord?: INote[],
    setNotes: any;
    tripletProps?: TripletHandlingProps
}

const FeatherSwitch = withStyles({
    switchBase: {
        color: red[500],
        '&$checked': {
            color: blue[500],
        },
        '&$checked + $track': {
            backgroundColor: blue[300],
        },
    },
    checked: {},
    track: {color: red[500],},
})(Switch);


export interface NoteContextMenuProps {
    note: INote;
    setNote: any;
    hand: HandType;
}

const NoteContextMenu = ({note, onUpdateNote, hand, anchorEl, onClose}) => {
    console.log('note in context menu', note)
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleNoteUpdate = (data: Partial<INote>) => {
        const updatedNote = new Note({
            note: data.note || note.note,
            octave: data.octave || note.octave,
            displayOctave: data.displayOctave || note.displayOctave,
            applicature: data.applicature || note.applicature,
            duration: note.duration,
            playbackOffset: note.playbackOffset,
            noteType: data.noteType || note.noteType
        });
        console.log('updating note in popover', updatedNote)
        onUpdateNote(updatedNote)

    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
        >
            <div style={{padding: 10, display: "flex", flexDirection: "column"}}>
                <div style={{position: "absolute", right: 3, top: 3}}>
                    <ClearRoundedIcon fontSize="small" color="action" onClick={onClose}/>
                </div>
                <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                    <TextField style={{paddingRight: 10, width: 50}}
                               defaultValue={note.note}
                               label="Нота"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               inputProps={{maxLength: 4}}
                               onChange={event => {
                                   handleNoteUpdate({note: event.target.value})
                               }}
                    />

                    <TextField style={{paddingRight: 10, width: 50}}
                               defaultValue={note.octave}
                               label="Октава"
                               type="number"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               inputProps={{maxLength: 4}}
                               onChange={event => {
                                   handleNoteUpdate({octave: Number(event.target.value)})
                               }}
                    />
                </div>
                <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                    <TextField style={{paddingRight: 10, width: 70}}
                               defaultValue={note.applicature}
                               label="Аппликатура"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               inputProps={{width: 50}}
                               onChange={event => {
                                   handleNoteUpdate({applicature: event.target.value})
                               }}
                    />
                    {hand === HandType.RIGHT && <FormControlLabel
                        control={<FeatherSwitch checked={note.noteType === NoteType.FEATHER}
                                                onChange={(event) => {
                                                    handleNoteUpdate({noteType: event.target.checked ? NoteType.FEATHER : NoteType.REGULAR})
                                                }}></FeatherSwitch>}
                        labelPlacement="top"
                        label={<Typography
                            style={{color: "gray", fontSize: "small"}}>Оперение</Typography>}
                    />}
                </div>
                <FormControlLabel
                    value="top"
                    control={<Checkbox
                        checked={note.displayOctave}
                        onChange={(e) => handleNoteUpdate({displayOctave: e.target.checked})}
                    />}
                    label={<Typography
                        style={{color: "gray", fontSize: "small"}}>Показывать октаву</Typography>}></FormControlLabel>

            </div>
        </Popover>
    )
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
                <NoteContextMenu note={note}
                                 anchorEl={anchorEl}
                                 hand={hand}
                                 onUpdateNote={onUpdateNote}
                                 onClose={handlePopoverClose}
                ></NoteContextMenu>
            </div>
        </ClickAwayListener>)
}

export const NodeSubtitle = ({nodeData, midiSummary, setNotes, tripletProps}: NodeSubtitleProps) => {
    const MAX_HEIGHT = QUADRAT_WIDTH * 1.75;
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
            return {right: QUADRAT_WIDTH / 2 + 1}
        }
        if (note.playbackOffset === PlaybackOffset.HALF && note.duration === PlaybackDuration.HALF) {
            return {left: QUADRAT_WIDTH / 2 + 1}
        }
        if (tripletProps) {
            const paddingOffset = 0.33;
            const effectiveProps = getTripletEffectiveParameters(tripletProps);
            const indexOfNoteInTriplet = effectiveProps.standardOffsets.indexOf(note.playbackOffset)

            const middleOffset = (effectiveProps.standardOffsets[2] - effectiveProps.standardOffsets[0])/2
            const offsetLeft = indexOfNoteInTriplet === 1 ?
                QUADRAT_WIDTH * ( middleOffset + paddingOffset):
                QUADRAT_WIDTH * (effectiveProps.standardOffsets[indexOfNoteInTriplet] + paddingOffset);
            return {left: offsetLeft}
        }

        return {left: 0, right: 0}
    }


    const handleUpdateOfNode = (oldNote: Note) => (newNote: Note) => {
        const updatedNotes = [...nodeData.notes];
        const indexOfOldNote = updatedNotes.indexOf(oldNote);
        updatedNotes[indexOfOldNote] = newNote
        setNotes(updatedNotes, getOriginalText(updatedNotes))

    }

    const constainsChords = isChord(nodeData.notes);
    return (
        <div>

            <div>
                <div css={{
                    minHeight: MAX_HEIGHT,
                    width: QUADRAT_WIDTH,
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
                            ></NodeSubtitleItem>
                        )
                }
                </div>

            </div>
        </div>
    )
}


