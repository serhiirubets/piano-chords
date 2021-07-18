import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Checkbox, FormControlLabel, Slider, Typography} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";
import SpeedRoundedIcon from "@material-ui/icons/SpeedRounded";
import {BarContext} from "../../context/bar-context";
import {PlaybackModule} from "./playback-module";

export interface SaveLoadSettingsPanelProps {
}

export const PlaybackPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {bars, updateBars} = useContext(BarContext);
    const classes = useGlobalStyles();

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }

    const handleNoteDurationChange = (event: any, newValue: number | number[]) => {
        partialUpdateSettings({playbackTempo: (newValue as number) * -1});
        console.log(newValue as number)
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
