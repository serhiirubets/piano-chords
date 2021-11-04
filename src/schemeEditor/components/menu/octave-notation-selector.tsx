import React, {useContext, useState} from "react";
import {
    Button,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip
} from "@mui/material";
import {SettingsContext} from "../../../context/settings-context";
import {OctaveNotation, Octaves} from "../../../model/deprecated/octave";
import {BarContext} from "../../../context/bar-context";
import {deepCopy} from "../../../utils/js-utils";

const OctaveTooltip = ({octaveNotations}) => {
    const notations = octaveNotations.split(',')
    return (<>
        Четвертая : {notations[7]}<br/>
        Третья : {notations[6]}<br/>
        Вторая : {notations[5]}<br/>
        Первая : {notations[4]}<br/>
        Малая : {notations[3]}<br/>
        Большая : {notations[2]}<br/>
        Контроктава : {notations[1]}<br/>
        СубКонтроктава : {notations[0]}<br/>
    </>)
}

export const OctaveNotationSelector = () => {
    const {bars, updateBars} = useContext(BarContext)
    const {settings, partialUpdateSettings} = useContext(SettingsContext)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const [isDialogOpened, setDialogOpened] = useState<boolean>(false);
    const [targetOctaveNotation, setTargetOctaveNotation] = useState<OctaveNotation | null>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setDialogOpened(false);
    };

    const handleDialogConfirm = () => {
        setDialogOpened(false);
        if(targetOctaveNotation){
            partialUpdateSettings({octaveNotation: targetOctaveNotation})
        }
        setAnchorEl(null);
    };


    const updateOctaveSettings = (notation: OctaveNotation) => {
        if(notation.name !== settings.octaveNotation.name){
            setDialogOpened(true)
        }
        const updatedBars = deepCopy(bars);
        console.log(updatedBars)
        updatedBars.forEach(bar => {
            bar.left.forEach(node => {
                node.originalText = ''
            })
            bar.right.forEach(node => {
                node.originalText = ''
            })
        })
        updateBars(updatedBars)
        partialUpdateSettings({...settings, octaveNotation:notation})
        setAnchorEl(null);
    };

    return (<div>
        <ClickAwayListener onClickAway={() => {
        }}>
            <Menu
                id="octave-notation-selector-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => updateOctaveSettings(Octaves.SCIENTIFIC)}>
                    <Tooltip title={<OctaveTooltip octaveNotations="0,1,2,3,4,5,6,7,8"/>}>
                        <ListItemText primary="Научная"
                                      secondary="0,1,2,3,4,5,6,7,8"/>
                    </Tooltip>
                </MenuItem>
                <MenuItem onClick={() => updateOctaveSettings(Octaves.NAME)}>
                    <Tooltip title={<OctaveTooltip octaveNotations=".sk,.k,.b,.m,.1,.2,.3,.4"/>}>
                        <ListItemText primary="Именная"
                                      secondary=".sk,.k,.b,.m,.1,.2,.3,.4"/>
                    </Tooltip>
                </MenuItem>
                <MenuItem onClick={() => updateOctaveSettings(Octaves.MIDI)}>
                    <Tooltip title={<OctaveTooltip octaveNotations="−4,−3,−2,−1,0,1,2,3,4"/>}>
                        <ListItemText primary="MIDI"
                                      secondary="−4,−3,−2,−1,0,1,2,3,4"/>
                    </Tooltip>
                </MenuItem>
            </Menu>
        </ClickAwayListener>
        <Dialog
            open={isDialogOpened}
            onClose={handleDialogClose}
        >
            <DialogTitle id="alert-dialog-title">
                {"Смена нотации записи октав"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Для корректной работы программы может быть необходимо изменить значения введенные в ячейки.<br></br>
                    Изменения коснутся ячеек, в которых явно указаны октавы. Произойдет замена на новую нотацию.
                    Продожить?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Отменить</Button>
                <Button onClick={handleDialogConfirm} autoFocus>
                    Продолжить
                </Button>
            </DialogActions>
        </Dialog>
        <Button
            variant="outlined"
            onClick={(e) => handleMenuOpen(e)}>
            {settings.octaveNotation.name}
        </Button>
    </div>)
}
