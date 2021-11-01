import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Checkbox, FormControlLabel, Slider, Typography} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import {PlaybackModule} from "./playback-module";

export interface SaveLoadSettingsPanelProps {
}

export const PlaybackPanel = () => {
    const {settings, partialUpdateSettings} = useContext(SettingsContext);
    const classes = useGlobalStyles();

    const handleNoteDurationChange = (event: any, newValue: number | number[]) => {
        partialUpdateSettings({playbackTempo: (newValue as number) * -1});
    };

    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
        >
            <Typography className={classes.accordionHeading}>Воспроизведение</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div className={classes.cardRow}>
                <div className={classes.cardColumn}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <SpeedRoundedIcon></SpeedRoundedIcon>
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
                        label="Различать оперение по громкости"></FormControlLabel>
                </div>
            </div>

        </AccordionDetails>
    </Accordion>)
}
