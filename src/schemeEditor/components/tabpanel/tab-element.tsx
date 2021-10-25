import Tab from "@material-ui/core/Tab";
import React, {useEffect, useState} from "react";
import {ClickAwayListener, ListItemText, Menu, MenuItem, TextField} from "@material-ui/core";
import {jsx} from "@emotion/react/macro";
import {SortableElement, SortableHandle} from "react-sortable-hoc";
import OpenWithRoundedIcon from '@material-ui/icons/OpenWithRounded';

export interface TabElementProps {
    label: string;
    onNameChange: (newName: string) => any;
    onTabSelect: () => any;
    onRemoveTriggered: (name:string) => any;
    externalStyle?:Object
}

const MoveTabButton = SortableHandle(() => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    return (<div
        css={{
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 10,
            opacity: isHovered ? 0 : 100
        }}

        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <OpenWithRoundedIcon fontSize="small" color="action"/>
    </div>)
})

export const TabElement = ({label, onNameChange,onTabSelect,onRemoveTriggered,externalStyle}: TabElementProps) => {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [tabnameText, setTabnameText] = useState(label)

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
            handleSave(tabnameText)
        }

        if (event.key === 'Escape') {
            setEditMode(false)
        }
        setTabnameText(event.target.value)
    }

    return (
        <ClickAwayListener onClickAway={() => {
            handleMenuClose();
            setEditMode(false);
        }}>
            <div style={{position: "relative", ...externalStyle}}>
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
                <div style={{flex:"1", flexDirection:"row"}}>
                <TextField
                    style={{
                        opacity: isEditMode ? 100 : 0,
                        zIndex: isEditMode ? 2 : 0,
                        position: "absolute",
                        paddingLeft:"1em",
                        paddingRight:"1em"
                    }}
                    onKeyUp={(event) => handleTextInput(event)}
                    defaultValue={tabnameText}
                    onBlur = {() => handleSave(tabnameText)}
                ></TextField>
                <Tab style={{opacity: isEditMode ? 0 : 100,
                    zIndex: isEditMode ? 0 : 2,
                    ...(externalStyle || {})
                }}
                     label={label}
                     onClick={()=> onTabSelect()}
                     onContextMenu={handleContextMenuClick}></Tab>
                {/*<MoveTabButton></MoveTabButton>*/}
                </div>
            </div>
        </ClickAwayListener>
    )
}
