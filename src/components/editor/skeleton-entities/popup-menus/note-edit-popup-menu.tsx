/** @jsx jsx */
import React, {useEffect, useRef, useState} from "react";
import {css, jsx} from "@emotion/react/macro";
import {INote, Note, NoteType} from "../../../../model/skeleton-entities-data/note-data";
import {HandType} from "../../../../model/skeleton-entities-data/skeleton-data";
import {
    Button,
    Checkbox, ClickAwayListener,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    TextField,
    Typography
} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import {FeatherSwitch} from "../../reusable/feather-switch";

export interface NoteContextMenuProps {
    note: INote;
    setNote: any;
    hand: HandType;
}

export const NoteEditPopupMenu = ({
                                      note,
                                      onUpdateNote,
                                      hand,
                                      anchorEl,
                                      updateAnchorEl,
                                      onClose,
                                      lyrics,
                                      nodeType
                                  }) => {
    const open = Boolean(anchorEl);
    const saveButtonRef = useRef<HTMLButtonElement|null>(null)
    const id = open ? 'simple-popover' : undefined;
    const [noteName, setNoteName] = useState<string | undefined>(note.note);
    const [octave, setNoteOctave] = useState<number | undefined>(note.octave);
    const [applicature, setApplicature] = useState<string | undefined>(note.applicature);
    const [noteType, setNoteType] = useState<NoteType | undefined>(nodeType);
    const [skeletonNodeLyrics, setSkeletonNodeLyrics] = useState<string | undefined>(lyrics);
    const [displayOctaveValue, setDisplayOctaveValue] = useState(note.displayOctave);
    useEffect(() => {
        setNoteType(nodeType)
    }, [nodeType])

    useEffect(() => {
        setSkeletonNodeLyrics(lyrics)
    }, [lyrics])

    useEffect(() => {
        setDisplayOctaveValue(note.displayOctave)
        setNoteName(note.note)
        setNoteOctave(note.octave)
        setApplicature(note.applicature)
    }, [note])

    const handleNoteUpdate = (data: Partial<INote>, lyrics?: string) => {
        const updatedNote = new Note({
            note: data.note || note.note,
            octave: data.octave || note.octave,
            displayOctave: data.displayOctave,
            applicature: data.applicature || note.applicature,
            duration: note.duration,
            playbackOffset: note.playbackOffset,
        });
        console.log('?????????? ????????', updatedNote)
        console.log('?????????? ??????????', lyrics)
        onUpdateNote(updatedNote, noteType, lyrics)
    }

    const handleSave = () => {
        handleNoteUpdate({
            note: noteName,
            octave: octave,
            displayOctave: displayOctaveValue,
            applicature: applicature,
            noteType: noteType
        }, skeletonNodeLyrics);
        updateAnchorEl(null)
    }

    const focusSaveButton = () => {
        console.log(saveButtonRef.current)
        saveButtonRef.current && saveButtonRef.current.focus()
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
                    <div style={{
                        padding: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center"
                    }}>
                        <TextField style={{paddingRight: 10, width: 50}}
                                   variant="standard"
                                   defaultValue={note.note}
                                   label="????????"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   inputProps={{maxLength: 4}}
                                   onChange={event => {
                                       setNoteName(event.target.value)
                                   }}
                                   onSubmit={focusSaveButton}
                        />

                        <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                            <FormControl sx={{m: 1, minWidth: 100}}>
                                <InputLabel id="octave-selector-label" style={{fontSize: "small"}}>????????????</InputLabel>
                                <Select
                                    labelId="octave-selector-label"
                                    id="octave-selector"
                                    variant="standard"
                                    value={octave}
                                    onChange={(e) => {
                                        setNoteOctave(Number(e.target.value))
                                        focusSaveButton()
                                    }}
                                    autoWidth
                                    MenuProps={{
                                        disablePortal: true,
                                        MenuListProps: {dense: true}
                                    }}
                                    label="????????????"
                                >
                                    <MenuItem value={0}><Typography
                                        fontSize="small">????????????????????????????</Typography></MenuItem>
                                    <MenuItem value={1}><Typography fontSize="small">??????????????????????</Typography></MenuItem>
                                    <MenuItem value={2}><Typography fontSize="small">??????????????</Typography></MenuItem>
                                    <MenuItem value={3}><Typography fontSize="small">??????????</Typography></MenuItem>
                                    <MenuItem value={4}><Typography fontSize="small">1</Typography></MenuItem>
                                    <MenuItem value={5}><Typography fontSize="small">2</Typography></MenuItem>
                                    <MenuItem value={6}><Typography fontSize="small">3</Typography></MenuItem>
                                    <MenuItem value={7}><Typography fontSize="small">4</Typography></MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                        <TextField style={{paddingRight: 10, width: 70}}
                                   variant="standard"
                                   defaultValue={note.applicature}
                                   label="??????????????????????"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}

                                   inputProps={{width: 50}}
                                   onChange={event => {
                                       setApplicature(event.target.value)
                                   }}
                                   onBlur={focusSaveButton}
                        />
                        {hand === HandType.RIGHT && <FormControlLabel
                            control={<FeatherSwitch checked={noteType === NoteType.FEATHER}
                                                    onChange={(event) => {
                                                        setNoteType(event.target.checked ? NoteType.FEATHER : NoteType.REGULAR)
                                                    }}/>}
                            labelPlacement="top"
                            label={<Typography
                                style={{color: "gray", fontSize: "small"}}>????????????????</Typography>}
                        />}
                    </div>
                    <FormControlLabel
                        value="top"
                        control={<Checkbox
                            checked={displayOctaveValue}
                            onChange={(e) => {
                                setDisplayOctaveValue(e.target.checked)
                                focusSaveButton()
                            }}
                        />}
                        label={<Typography
                            style={{color: "gray", fontSize: "small"}}>???????????????????? ????????????</Typography>}/>
                    <TextField style={{paddingRight: 10}}
                               variant="standard"
                               label="??????????"
                               fullWidth
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               defaultValue={lyrics}
                               onChange={event => {
                                   setSkeletonNodeLyrics(event.target.value)
                               }}
                               onSubmit={focusSaveButton}
                    />
                    <Button
                        ref={saveButtonRef}
                        autoFocus={true}
                        variant={"outlined"}
                        onClick={handleSave}>
                        <Typography fontSize={"small"}>??????????????????</Typography>
                    </Button>
                </div>
            </Popover>
    )
}
