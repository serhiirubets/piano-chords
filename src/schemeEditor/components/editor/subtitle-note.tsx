import React, {useContext} from "react";
import {
    ClickAwayListener,
    FormControlLabel,
    Popover,
    Switch,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import {INote, Note, PlaybackDuration, PlaybackOffset} from "../../model/note-data";
import {NoteHand, NoteType} from "../../model/skeleton-data";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {blue, red} from "@material-ui/core/colors";
import {SettingsContext} from "../../context/settings-context";

export interface BlockSchemeNodeProps {
    externalNoteObject: INote;
    setExternalNoteObject: any;//(INote, number) => SetStateAction<INote>;
    index: number;
    handType: NoteHand;
    chord?: INote[]
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

export const SubtitleNote = ({externalNoteObject, setExternalNoteObject, index, handType, chord}: BlockSchemeNodeProps) => {
    const SYMBOL_HEIGHT_PX = 14;
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const {settings} = useContext(SettingsContext)
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    console.log('Initializing note object', open)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        console.log('Clicking away')
        setAnchorEl(null);
        // setIsPopupOpen(false)
    };

    const handleNoteUpdate = (data: Partial<INote>) => {
        const updatedNote = new Note({
            note: data.note || externalNoteObject.note,
            octave: data.octave || externalNoteObject.octave,
            applicature: data.applicature || externalNoteObject.applicature,
            duration: externalNoteObject.duration,
            playbackOffset: externalNoteObject.playbackOffset,
            noteType: data.noteType || externalNoteObject.noteType
        });
        console.log(updatedNote)
        setExternalNoteObject(updatedNote)

    }

    const getRelativeTop = (note: INote) => {
        const rightHandTop = 60 - (externalNoteObject.getMidiNumber() - 48) * 2.5;
        const leftHandTop = (60 - externalNoteObject.getMidiNumber()) * 2.5;
        const top = handType === NoteHand.RIGHT ? rightHandTop : leftHandTop;
        return top
    }

    const getRelativeTopInsideChord = (note: INote, chord: INote[]) => {
        let top;
        chord.sort(Note.compareByMidiNumbers);
        const chordRootTop = getRelativeTop(chord[0]);
        const noteIndex = chord.indexOf(note);
        if (noteIndex === 0) {
            return chordRootTop;
        } else {
            const mathEvaluatedTop = getRelativeTop(note);
            const prevNoteTop = getRelativeTop(chord[noteIndex - 1]);
            const relativeTop = prevNoteTop - SYMBOL_HEIGHT_PX;

            console.log('note', note.note + note.octave)
            console.log('prev note top', prevNoteTop)
            console.log('top including notes',relativeTop )
            console.log('correct top', mathEvaluatedTop)
            console.log('used', mathEvaluatedTop < relativeTop ? mathEvaluatedTop : relativeTop)

            return mathEvaluatedTop < relativeTop ? mathEvaluatedTop : relativeTop;
        }

    }

    const getRelativeLeft = (note: INote) => {
        if (note.duration === PlaybackDuration.FULL && note.playbackOffset === PlaybackOffset.NONE) {
            return {
                left: 0,
                right: 0
            }
        } else {
            return {
                left: 5 + QUADRAT_WIDTH * note.playbackOffset
            }
        }
    }
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                top: chord ? getRelativeTopInsideChord(externalNoteObject, chord) : getRelativeTop(externalNoteObject),
                zIndex: 10 + index,
                ...getRelativeLeft(externalNoteObject)
            }}>

                {settings.displayApplicature && <Typography style={{
                    pointerEvents: "none",
                    fontSize: "small",
                    position:"absolute",
                    top:-7,
                    right:5,
                    color: "#6833b1"
                }}>{externalNoteObject.applicature}</Typography>}
                <Typography style={{fontSize: "1em", lineHeight: 1.6, fontFamily:"sans-serif", fontWeight:600}}
                            onClick={handleClick}>{externalNoteObject.note}</Typography>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
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
                        <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                            <TextField style={{paddingRight: 10, width: 50}}
                                       defaultValue={externalNoteObject.note}
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
                                       defaultValue={externalNoteObject.octave}
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
                                       defaultValue={externalNoteObject.applicature}
                                       id="standard-number"
                                       label="Аппликатура"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       inputProps={{width: 50}}
                                       onChange={event => {
                                           handleNoteUpdate({applicature: event.target.value})
                                       }}
                            />
                            {handType === NoteHand.RIGHT && <FormControlLabel
                                control={<FeatherSwitch checked={externalNoteObject.noteType === NoteType.FEATHER}
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
            </div>
        </ClickAwayListener>
    )
}
