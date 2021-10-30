import {Card, CardContent, Checkbox, FormControlLabel, Grid, TextField, Typography} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import React, {useContext, useState} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import {SaveLoadSettingsPanel} from "./save-load-settings-panel";
import {EditorSettings} from "../../model/editor-settings-data";
import {BarContext} from "../../context/bar-context";
import {EditorModesSettingsPanel} from "./editor-modes-panel";
import {PlaybackPanel} from "./playback-panel";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {EditorExportPanel} from "./editor-export-panel";


export const EditorSettingsPanel = () => {
    const classes = useGlobalStyles();
    return (
        <Card className={classes.controlPanelCard}>
            <CardContent>
                <div style={{position: 'sticky'}}>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Панель управления
                    </Typography>

                    <SaveLoadSettingsPanel/>
                    <EditorExportPanel/>
                    <PlaybackPanel/>
                    {/*<EditorModesSettingsPanel/>*/}

                </div>
            </CardContent>
        </Card>
    )
}
