import Tab from "@material-ui/core/Tab";
import React, {useState} from "react";
import {ClickAwayListener, ListItemText, Menu, MenuItem, TextField} from "@material-ui/core";
import DragIndicatorRounded from '@material-ui/icons/DragIndicatorRounded';

export interface TabElementProps {
    label: string;
    onNameChange: (newName: string) => any;
    onTabSelect: () => any;
    onRemoveTriggered: (name: string) => any;
    externalStyle?: Object,
    externalRef:any;
    draggableAttributes: any;
    draggableListeners: any;
}

export const TabElement = ({
                               externalRef,
                               label,
                               onNameChange,
                               onTabSelect,
                               onRemoveTriggered,
                               externalStyle,
                               draggableAttributes,
                               draggableListeners
                           }: TabElementProps) => {
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
    const handleSave = (newName: string) => {
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
                <div style={{flex: "1", flexDirection: "row"}}>
                    <TextField
                        style={{
                            opacity: isEditMode ? 100 : 0,
                            zIndex: isEditMode ? 2 : 0,
                            position: "absolute",
                            paddingLeft: "1em",
                            paddingRight: "1em"
                        }}
                        onKeyUp={(event) => handleTextInput(event)}
                        defaultValue={tabnameText}
                        onBlur={() => handleSave(tabnameText)}
                    ></TextField>
                    <Tab style={{
                        opacity: isEditMode ? 0 : 100,
                        zIndex: isEditMode ? 0 : 2,
                        ...(externalStyle || {})
                    }}
                         ref={externalRef}
                         label={label}
                         onClick={() => onTabSelect()}
                         onContextMenu={handleContextMenuClick}
                         {...draggableListeners}
                         {...draggableAttributes}
                    ></Tab>
                    {/*<MoveTabButton></MoveTabButton>*/}
                </div>
            </div>
        </ClickAwayListener>
    )
}
