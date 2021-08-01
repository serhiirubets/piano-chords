import Tab from "@material-ui/core/Tab";
import React, {useEffect, useState} from "react";
import {ClickAwayListener, ListItemText, Menu, MenuItem, TextField} from "@material-ui/core";
import {jsx} from "@emotion/react/macro";

export interface TabElementProps {
    label: string;
    onNameChange: (newName: string) => any;
    onTabSelect: () => any;
    onRemoveTriggered: (name:string) => any;
}

export const TabElement = ({label, onNameChange,onTabSelect,onRemoveTriggered}: TabElementProps) => {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isEditMode, setEditMode] = useState<boolean>(false);

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    }
    const handleContextMenuClick = (e) => {
        e.preventDefault()
        onTabSelect();
        setMenuAnchorEl(e.currentTarget)
    }
    const handleSave = (newName:string) => {
        onNameChange(newName);
        setEditMode(false);
    }

    const handleTextInput = (event) => {
        if (!event.target.value) {
            return;
        }

        if (event.key === 'Enter') {
            handleSave(event.target.value)
        }

        if (event.key === 'Escape') {
            setEditMode(false)
        }
    }

    return (
        <ClickAwayListener onClickAway={() => {
            handleMenuClose();
            setEditMode(false);
        }}>
            <div style={{position: "relative"}}>
                <Menu
                    id="simple-menu"
                    anchorEl={menuAnchorEl}
                    keepMounted
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => {
                        setEditMode(true);
                        handleMenuClose();
                    }}>
                        <ListItemText primary="Переименовать"/>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        onRemoveTriggered(label)
                        handleMenuClose();
                    }}>
                        <ListItemText primary="Удалить"/>
                    </MenuItem>
                </Menu>
                <TextField
                    style={{
                        opacity: isEditMode ? 100 : 0,
                        zIndex: isEditMode ? 2 : 0,
                        position: "absolute",
                        paddingLeft:"1em",
                        paddingRight:"1em"
                    }}
                    onKeyUp={(event) => handleTextInput(event)}
                    defaultValue={label}
                ></TextField>
                <Tab style={{opacity: isEditMode ? 0 : 100, zIndex: isEditMode ? 0 : 2}}
                     label={label}
                     onClick={()=> onTabSelect()}
                     onContextMenu={handleContextMenuClick}>
                </Tab>
            </div>
        </ClickAwayListener>
    )
}
