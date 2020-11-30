import React from "react";
import {ClickAwayListener, Popover, TextField} from "@material-ui/core";
import {INote, Note} from "../../model/note-data";
import {NoteHand} from "../../model/skeleton-data";

export interface BlockSchemeNodeProps {
    externalNoteObject: INote;
    setExternalNoteObject: any;//(INote, number) => SetStateAction<INote>;
    index:number;
    handType: NoteHand;
}

export const SubtitleNote = ({externalNoteObject, setExternalNoteObject, index, handType}: BlockSchemeNodeProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);

    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNoteUpdate = (data: Partial<INote>) => {
        const updatedNote = new Note({
            note: data.note || externalNoteObject.note,
            octave: data.octave || externalNoteObject.octave,
            applicature: data.applicature || externalNoteObject.applicature
        });
        setExternalNoteObject(updatedNote)

    }

    const getRelativeTop = (note:INote) => {
        const rightHandTop  = 60-(externalNoteObject.getMidiNumber()-48)*2.5;
        const leftHandTop  = (60-externalNoteObject.getMidiNumber())*2.5;
        const top = handType === NoteHand.RIGHT ? rightHandTop : leftHandTop;
        return top
    }

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div style={{position:"absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",top: getRelativeTop(externalNoteObject), zIndex:index}}>
                <span onClick={handleClick}>{externalNoteObject.note}</span>
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
                        <TextField style={{paddingRight: 10, width: 100}}
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
                    </div>
                </Popover>
            </div>
        </ClickAwayListener>
    )
}
