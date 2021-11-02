import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Checkbox, FormControlLabel, Grid, TextField, Typography} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";

export const EditorModesSettingsPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const classes = useGlobalStyles();

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }

    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
        >
            <Typography className={classes.accordionHeading}>Упрощенный ввод</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid direction="column">
                <Grid>
                    <Grid item>
                        <FormControlLabel
                            value="top"
                            control={<Checkbox
                                disabled
                                checked={settings.simpleMode}
                                onChange={(e) => partialUpdateSettings({simpleMode: e.target.checked})}
                            />}
                            label="Заполнить по клику ПКМ"></FormControlLabel>
                    </Grid>
                </Grid>
                <Grid item direction="row">
                    <Grid item>
                        <TextField className={classes.textInputPadding}
                                   label="Нота по умолчанию левой руки"
                                   defaultValue={settings.simpleModeLeftHandNote}
                                   onChange={(event => partialUpdateSettings({simpleModeLeftHandNote: event.target.value}))}
                        />
                    </Grid>
                    <Grid item>
                        <TextField className={classes.textInputPadding}
                                   label="Нота по умолчанию правой руки"
                                   defaultValue={settings.simpleModeRightHandNote}
                                   onChange={(event => partialUpdateSettings({simpleModeRightHandNote: event.target.value}))}
                        />
                    </Grid>
                </Grid>
            </Grid>


        </AccordionDetails>
    </Accordion>)
}
