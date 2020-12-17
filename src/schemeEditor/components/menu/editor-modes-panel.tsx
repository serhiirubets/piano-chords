import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Button, Checkbox, FormControlLabel, Grid, TextField, Typography} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import PlaylistPlayRoundedIcon from "@material-ui/icons/PlaylistPlayRounded";
import {BAIntroSchemeString} from "../../resources/BA-intro-recording";
import {SkeletonData} from "../../model/skeleton-data";
import Accordion from "@material-ui/core/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";

export interface SaveLoadSettingsPanelProps {
}

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
            <Typography className={classes.accoridionHeading}>Упрощенный ввод</Typography>
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
