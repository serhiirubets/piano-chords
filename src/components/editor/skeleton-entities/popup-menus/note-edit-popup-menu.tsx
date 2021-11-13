/** @jsx jsx */
import React, {useEffect, useState} from "react";
import {css, jsx} from "@emotion/react/macro";
import {INote, Note, NoteType} from "../../../../model/skeleton-entities-data/note-data";
import {HandType} from "../../../../model/skeleton-entities-data/skeleton-data";
import {
    Button,
    Checkbox,
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
    const id = open ? 'simple-popover' : undefined;
    const [noteName, setNoteName] = useState<string | undefined>(note.note);
    const [octave, setNoteOctave] = useState<number | undefined>(note.octave);
    const [applicature, setApplicature] = useState<string | undefined>(note.applicature);
    const [noteType, setNoteType] = useState<NoteType | undefined>(nodeType);
    const [skeletonNodeLyrics, setSkeletonNodeLyrics] = useState<string|undefined>(lyrics);
    const [displayOctaveValue, setDisplayOctaveValue] = useState(note.displayOctave);
    console.log('types')
    console.log(noteType)
    console.log(nodeType)
    useEffect(() => {
        setNoteType(nodeType)
    }, [ nodeType])

    useEffect(() => {
        setDisplayOctaveValue(note.displayOctave)
    }, [ note])

    const handleNoteUpdate = (data: Partial<INote>, lyrics?:string) => {
        const updatedNote = new Note({
            note: data.note || note.note,
            octave: data.octave || note.octave,
            displayOctave: data.displayOctave,
            applicature: data.applicature || note.applicature,
            duration: note.duration,
            playbackOffset: note.playbackOffset,
        });
        console.log('Новая нота', updatedNote)
        onUpdateNote(updatedNote, noteType, lyrics)
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
                <div style={{padding: 10, display: "flex", flexDirection: "row", alignItems:"center", alignContent:"center"}}>
                    <TextField style={{paddingRight: 10, width: 50}}
                               variant="standard"
                               defaultValue={note.note}
                               label="Нота"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               inputProps={{maxLength: 4}}
                               onChange={event => {
                                   setNoteName(event.target.value)
                               }}
                    />

                    <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                        <FormControl sx={{m: 1, minWidth: 100}}>
                            <InputLabel id="octave-selector-label" style={{fontSize: "small"}}>Октава</InputLabel>
                            <Select
                                labelId="octave-selector-label"
                                id="octave-selector"
                                variant="standard"
                                value={octave}
                                onChange={(e) => {
                                    setNoteOctave(Number(e.target.value))
                                }}
                                autoWidth
                                MenuProps={{
                                    disablePortal: true,
                                    MenuListProps: {dense: true}
                                }}
                                label="Октава"
                            >
                                <MenuItem value={0}><Typography fontSize="small">Субконтроктава</Typography></MenuItem>
                                <MenuItem value={1}><Typography fontSize="small">Контроктава</Typography></MenuItem>
                                <MenuItem value={2}><Typography fontSize="small">Большая</Typography></MenuItem>
                                <MenuItem value={3}><Typography fontSize="small">Малая</Typography></MenuItem>
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
                               label="Аппликатура"
                               InputLabelProps={{
                                   shrink: true,
                               }}

                               inputProps={{width: 50}}
                               onChange={event => {
                                   setApplicature(event.target.value)
                               }}
                    />
                    {hand === HandType.RIGHT && <FormControlLabel
                        control={<FeatherSwitch checked={noteType === NoteType.FEATHER}
                                                onChange={(event) => {
                                                    setNoteType(event.target.checked ? NoteType.FEATHER : NoteType.REGULAR)
                                                }}/>}
                        labelPlacement="top"
                        label={<Typography
                            style={{color: "gray", fontSize: "small"}}>Оперение</Typography>}
                    />}
                </div>
                <FormControlLabel
                    value="top"
                    control={<Checkbox
                        checked={displayOctaveValue}
                        onChange={(e) => {
                            setDisplayOctaveValue(e.target.checked)
                        }}
                    />}
                    label={<Typography
                        style={{color: "gray", fontSize: "small"}}>Показывать октаву</Typography>}/>
                <TextField style={{paddingRight: 10}}
                           variant="standard"
                           label="Текст"
                           fullWidth
                           InputLabelProps={{
                               shrink: true,
                           }}
                           defaultValue={lyrics}
                           onChange={event => {
                               setSkeletonNodeLyrics(event.target.value)
                           }}/>
                <Button
                    variant={"outlined"}
                    onClick={() => {
                        handleNoteUpdate({
                            note: noteName,
                            octave: octave,
                            displayOctave: displayOctaveValue,
                            applicature: applicature,
                            noteType: noteType
                        }, skeletonNodeLyrics);
                        updateAnchorEl(null)
                    }}>
                    <Typography fontSize={"small"}>Сохранить</Typography>
                </Button>

            </div>
        </Popover>
    )
}
