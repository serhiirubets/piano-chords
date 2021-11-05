import React, {useState} from "react";
import {INote, Note, NoteType} from "../../../model/skeleton-entities-data/note-data";
import {
    Button,
    Checkbox, FormControl,
    FormControlLabel, InputLabel,
    MenuItem, MenuList,
    Popover,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
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
    const [octave, setOctave] = useState<number | undefined>(undefined)
    const [displayOctave, setDisplayOctave] = useState<boolean | undefined>(undefined)
    const [applicature, setApplicature] = useState<string | undefined>(undefined)
    const [noteType, setNoteType] = useState<NoteType | undefined>(undefined)

    const id = open ? 'bulk-edit-menu-popover' : undefined;

    const handleNotesUpdate = (data: Partial<INote>) => {
        console.log(data)
        const updateOperation = (notes: INote[]) => {
            return notes.map(originalNote => {
                    return new Note({
                        note: data.note || originalNote.note,
                        octave: data.octave || originalNote.octave,
                        displayOctave: data.displayOctave,
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
                    <FormControl sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="demo-simple-select-helper-label" style={{fontSize:"small"}}>Октава</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            // value={octave}
                            onChange={(e) => {
                                const num = Number(e.target.value)
                                console.log('value',num)
                                setOctave(num)
                            }}
                            autoWidth
                            MenuProps={{disablePortal:true,
                            MenuListProps:{dense:true}}}
                            label="Октава"
                            value={octave}
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
                                   setApplicature(event.target.value)
                               }}
                    />
                    <FormControlLabel
                        control={<FeatherSwitch
                            onChange={(event) => {
                                setNoteType(event.target.checked ? NoteType.FEATHER : NoteType.REGULAR)
                            }}/>}
                        labelPlacement="top"
                        label={<Typography
                            style={{color: "gray", fontSize: "small"}}>Оперение</Typography>}
                    />
                </div>
                <FormControlLabel
                    value="top"
                    control={<Checkbox
                        // checked={note.displayOctave}
                        onChange={(e) => {
                            setDisplayOctave(e.target.checked)
                            // handleNotesUpdate({displayOctave: e.target.checked})}
                        }}
                    />}
                    label={<Typography
                        style={{color: "gray", fontSize: "small"}}>Показывать октаву</Typography>}/>
                <Button
                    variant={"outlined"}
                    onClick={() => handleNotesUpdate({
                        octave: octave,
                        displayOctave: displayOctave,
                        applicature: applicature,
                        noteType: noteType
                    })
                    }>
                    <Typography fontSize={"small"}>Сохранить</Typography>
                </Button>
            </div>
        </Popover>
    )
}

const selectMenuStyle = {
    margin:"5x",
    padding:"5px 7 px"
}
