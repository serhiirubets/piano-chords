import {ListItemText, Menu, MenuItem, MenuList, TextField, Typography} from "@mui/material";
import React, {useState} from "react";

export const EditableLabel = ({label, labelProps, textfieldProps, onChange}) => {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState(label)

    const handleMenuClose = () => {

        setMenuAnchorEl(null)
    }

    const handleTextInput = (event) => {
        if (!event.target.value) {
            return;
        }

        if (event.key === 'Enter') {
            onChange(title)
            setEditMode(false)
        }

        if (event.key === 'Escape') {
            setEditMode(false)
        }
        setTitle(event.target.value)
    }

    return (
        <><Menu
            id="edit-tab-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <MenuList dense >
                <MenuItem onClick={() => {
                    setEditMode(true);
                    handleMenuClose();
                }}>
                    <ListItemText primary="Переименовать"/>
                </MenuItem>
            </MenuList>
        </Menu>
            <div style={{flex: "1"}}>
                {<> <TextField
                    {...textfieldProps}
                    style={{
                        ...(textfieldProps.style || {}),
                        opacity: isEditMode ? 100 : 0,
                        zIndex: isEditMode ? 5 : 0
                    }}
                    onKeyUp={(event) => handleTextInput(event)}
                    defaultValue={title}
                />
                    <Typography {...labelProps}
                                style={{
                                    ...(labelProps.style || {}),
                                    opacity: isEditMode ? 0 : 100
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    setMenuAnchorEl(e.target)
                                }
                                }>{title}</Typography>
                </>}
            </div>
        </>
    )
}
