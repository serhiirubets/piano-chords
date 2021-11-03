import {List, ListItem, ListItemIcon, ListItemText, ListSubheader} from "@mui/material";
import React from "react";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {SettingsExportSection} from "./settings-export-section";
import {SettingsSaveLoadSection} from "./settings-save-load-section";
import {SettingsPlaybackSection} from "./settings-playback-section";


export const SettingsPanel = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height:"100%"
        }}>
            <List>
                <SettingsSaveLoadSection/>
                <SettingsExportSection/>
                <SettingsPlaybackSection/>
            </List>
            <List>
                <ListItem button key={"LoadQuickSave"} onClick={() => alert('Еще не готово, но скоро будет')}>
                    <ListItemIcon>
                        <HelpOutlineIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Помощь"/>
                </ListItem>
            </List>
        </div>
    )
}
