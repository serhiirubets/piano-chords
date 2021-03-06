import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Checkbox, FormControlLabel, ListItem, ListItemText, Slider, Typography} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import {PlaybackModule} from "../reusable/playback-module";

export interface SaveLoadSettingsPanelProps {
}

export const SettingsPlaybackSection = () => {
    const {settings, partialUpdateSettings} = useContext(SettingsContext);

    const handleNoteDurationChange = (event: any, newValue: number | number[]) => {
        partialUpdateSettings({playbackTempo: (newValue as number) * -1});
    };

    return (<Accordion>
        <AccordionSummary
            style={{padding: 0, margin: 0, maxHeight: "48px"}}
            expandIcon={<ExpandMoreIcon/>}
        >
            <ListItem button key={"Playback"}>
                <ListItemText inset primary="Настройки воспроизведения"/>
            </ListItem>
        </AccordionSummary>
        <AccordionDetails>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <SpeedRoundedIcon/>
                        <Typography id="discrete-slider" gutterBottom>
                            Темп
                        </Typography>
                    </div>
                    <Slider
                        style={{width: '100%'}}
                        onChange={handleNoteDurationChange}
                        defaultValue={-0.25}
                        step={0.05}
                        marks
                        min={-1}
                        max={-0.05}
                    />
                    <PlaybackModule/>
                    <FormControlLabel
                        value="top"
                        control={<Checkbox
                            checked={settings.alterGainForFeather}
                            onChange={(e) => partialUpdateSettings({alterGainForFeather: e.target.checked})}
                        />}
                        label="Различать оперение по громкости"/>
                </div>
            </div>

        </AccordionDetails>
    </Accordion>)
}
