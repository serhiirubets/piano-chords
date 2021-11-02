import {Card, CardContent, Typography} from "@mui/material";
import React from "react";
import {useGlobalStyles} from "../../../App";
import {SaveLoadSettingsPanel} from "./save-load-settings-panel";
import {PlaybackPanel} from "./playback-panel";
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
