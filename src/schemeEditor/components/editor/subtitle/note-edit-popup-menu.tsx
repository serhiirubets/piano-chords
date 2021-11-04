/** @jsx jsx */
import React, {useState} from "react";
import {jsx} from "@emotion/react/macro";
import {INote, Note, NoteType} from "../../../../model/note-data";
import {HandType} from "../../../../model/deprecated/skeleton-data";
import {Checkbox, FormControlLabel, Popover, TextField, Typography} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import {FeatherSwitch} from "./feather-switch";

export interface NoteContextMenuProps {
    note: INote;
    setNote: any;
    hand: HandType;
}

export const NoteEditPopupMenu = ({note, onUpdateNote, hand, anchorEl, onClose}) => {
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [displayOctaveValue, setDisplayOctaveValue]= useState(note.displayOctave);

    const handleNoteUpdate = (data: Partial<INote>) => {
        const updatedNote = new Note({
            note: data.note || note.note,
            octave: data.octave || note.octave,
            displayOctave: data.displayOctave,
            applicature: data.applicature || note.applicature,
            duration: note.duration,
            playbackOffset: note.playbackOffset,
            noteType: data.noteType || note.noteType
        });
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
                               variant="standard"
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
                               variant="standard"
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
                               variant="standard"
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
                        checked={displayOctaveValue}
                        onChange={(e) => {
                            setDisplayOctaveValue( e.target.checked)
                            handleNoteUpdate({displayOctave: e.target.checked})
                        }}
                    />}
                    label={<Typography
                        style={{color: "gray", fontSize: "small"}}>Показывать октаву</Typography>}/>

            </div>
        </Popover>
    )
}
