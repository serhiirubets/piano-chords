/** @jsx jsx */
import React from "react";
import {jsx} from "@emotion/react/macro";
import {INote, Note, NoteType} from "../../model/note-data";
import {HandType} from "../../model/deprecated/skeleton-data";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {compareByMidiNumbers, getMidiNumber, isChord} from "../../utils/playback-utils";
import {HandMidiSummary} from "./skeleton";
import {
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
import {getOriginalText} from "../../utils/skeleton-node-utils";


export interface NodeSubtitleProps {
    nodeData: SkeletonNodeData;
    midiSummary: HandMidiSummary;
    setExternalNoteObject?: any;//(INote, number) => SetStateAction<INote>;
    index?: number;
    handType?: HandType;
    chord?: INote[],
    setNotes: any;
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
            </div>
        </Popover>
    )
}

const NodeSubtitleItem = ({note, hand, onUpdateNote, height, fontHeight}) => {
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
            note.note.substr(0, note.note.length - 1) + '♭' :
            note.note;
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
                        // height: `${fontHeight * 0.7}px`,
                        top: height,
                        left: 0,
                        right: 0,
                        fontFamily: "serif",
                        fontSize: `${fontHeight}px`,
                        fontWeight: "bold",
                        border: isHovered ? "solid 1px black" : "none"
                    }}
                    onClick={handleClick}>{transformFlatSign(note)}</div>
                <NoteContextMenu note={note}
                                 anchorEl={anchorEl}
                                 hand={hand}
                                 onUpdateNote={onUpdateNote}
                                 onClose={handlePopoverClose}
                ></NoteContextMenu>

            </div>
        </ClickAwayListener>)
}

export const NodeSubtitle = ({nodeData, midiSummary, setNotes}: NodeSubtitleProps) => {
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

    const getChordNoteHeights = (chord: INote[]) => {
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


    const handleUpdateOfNode = (oldNote: Note) => (newNote: Note) => {
        const updatedNotes = [...nodeData.notes];
        const indexOfOldNote = updatedNotes.indexOf(oldNote);
        const updatedNotes2 = updatedNotes[indexOfOldNote] = newNote
        console.log('ion', indexOfOldNote)
        console.log('nn', newNote)
        console.log('un2', updatedNotes2)
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
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                }}>{
                    nodeData.notes
                        .sort((first, second) => getMidiNumber(second) - getMidiNumber(first))
                        .map(note => <NodeSubtitleItem
                                note={note}
                                onUpdateNote={handleUpdateOfNode(note)}
                                hand={nodeData.hand}
                                height={constainsChords ? getChordNoteRelativeTop(note, nodeData.notes) : getSingleNoteRelativeTop(note)}
                                fontHeight={FONT_HEIGHT}
                            ></NodeSubtitleItem>
                        )
                }
                </div>

            </div>
        </div>
    )
}


