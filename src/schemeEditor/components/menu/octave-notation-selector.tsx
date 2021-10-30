import React, {useContext, useState} from "react";
import QueueMusicRoundedIcon from '@material-ui/icons/QueueMusicRounded';
import {ClickAwayListener, IconButton, ListItemText, Menu, MenuItem, Tooltip} from "@material-ui/core";
import {SettingsContext} from "../../context/settings-context";
import {OctaveNotation} from "../../model/deprecated/octave";

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
    const {settings, partialUpdateSettings} = useContext(SettingsContext)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const open = Boolean(anchorEl);

    console.log('menu element', anchorEl)

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        console.log('menu target', event.currentTarget)
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const updateOctaveSettings = (notation: OctaveNotation) => {
        partialUpdateSettings({octaveNotation: notation})
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
                <MenuItem onClick={() => updateOctaveSettings(OctaveNotation.SCIENTIFIC)}>
                    <Tooltip title={<OctaveTooltip octaveNotations="0,1,2,3,4,5,6,7,8"/>}>
                        <ListItemText primary="Научная"
                                      secondary="0,1,2,3,4,5,6,7,8"/>
                    </Tooltip>
                </MenuItem>
                <MenuItem onClick={() => updateOctaveSettings(OctaveNotation.NAME)}>
                    <Tooltip title={<OctaveTooltip octaveNotations=".sk,.k,.b,.m,.1,.2,.3,.4"/>}>
                        <ListItemText primary="Именная"
                                      secondary=".sk,.k,.b,.m,.1,.2,.3,.4"/>
                    </Tooltip>
                </MenuItem>
                <MenuItem onClick={() => updateOctaveSettings(OctaveNotation.MIDI)}>
                    <Tooltip title={<OctaveTooltip octaveNotations="−4,−3,−2,−1,0,1,2,3,4"/>}>
                        <ListItemText primary="MIDI"
                                      secondary="−4,−3,−2,−1,0,1,2,3,4"/>
                    </Tooltip>
                </MenuItem>
            </Menu>
        </ClickAwayListener>

        <IconButton onClick={(e) => handleMenuOpen(e)}>
            <QueueMusicRoundedIcon/>
        </IconButton>
    </div>)
}
