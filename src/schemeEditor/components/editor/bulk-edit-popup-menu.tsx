import React from "react";
import {INote, Note, NoteType} from "../../model/note-data";
import {Checkbox, FormControlLabel, Popover, TextField, Typography} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import {FeatherSwitch} from "./subtitle/feather-switch";


export interface BulkEditPopupMenu {
    //index of node in skeleton
    bulkUpdateOperationChange: any;
    anchorEl: any;
    onClose: (e: any) => void;
}


export const BulkEditPopupMenu = ({bulkUpdateOperationChange, anchorEl, onClose}: BulkEditPopupMenu) => {
    const open = Boolean(anchorEl);

    const id = open ? 'bulk-edit-menu-popover' : undefined;

    const handleNotesUpdate = (data: Partial<INote>) => {
        const updateOperation = (notes: INote[]) => {
            return notes.map(originalNote => {
                    return new Note({
                        note: data.note || originalNote.note,
                        octave: data.octave || originalNote.octave,
                        displayOctave: data.displayOctave || originalNote.displayOctave,
                        applicature: data.applicature || originalNote.applicature,
                        duration: originalNote.duration,
                        playbackOffset: originalNote.playbackOffset,
                        noteType: data.noteType || originalNote.noteType
                    });
                }
            )
        }
        bulkUpdateOperationChange(updateOperation)

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
            {}
            <div style={{padding: 10, display: "flex", flexDirection: "column"}}>
                <div style={{position: "absolute", right: 3, top: 3}}>
                    <ClearRoundedIcon fontSize="small" color="action" onClick={onClose}/>
                </div>
                <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                    <TextField style={{paddingRight: 10, width: 50}}
                               label="Октава"
                               type="number"
                               variant="standard"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               inputProps={{maxLength: 4}}
                               onChange={event => {
                                   handleNotesUpdate({octave: Number(event.target.value)})
                               }}
                    />
                </div>
                <div style={{padding: 10, display: "flex", flexDirection: "row"}}>
                    <TextField style={{paddingRight: 10, width: 70}}
                               label="Аппликатура"
                               type="number"
                               variant="standard"
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               inputProps={{width: 50}}
                               onChange={event => {
                                   handleNotesUpdate({applicature: event.target.value})
                               }}
                    />
                    <FormControlLabel
                        control={<FeatherSwitch
                            // checked={note.noteType === NoteType.FEATHER}
                            onChange={(event) => {
                                handleNotesUpdate({noteType: event.target.checked ? NoteType.FEATHER : NoteType.REGULAR})
                            }}></FeatherSwitch>}
                        labelPlacement="top"
                        label={<Typography
                            style={{color: "gray", fontSize: "small"}}>Оперение</Typography>}
                    />
                </div>
                <FormControlLabel
                    value="top"
                    control={<Checkbox
                        // checked={note.displayOctave}
                        onChange={(e) => handleNotesUpdate({displayOctave: e.target.checked})}
                    />}
                    label={<Typography
                        style={{color: "gray", fontSize: "small"}}>Показывать октаву</Typography>}></FormControlLabel>

            </div>
        </Popover>
    )
}
