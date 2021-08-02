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
    const {settings, updateSettings} = useContext(SettingsContext);
    const {bars, updateBars} = useContext(BarContext);

    const [barSize, setBarSize] = useState<number>(settings.quadratSize);
    const classes = useGlobalStyles();

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }

    const recalculateBars = (newBarSize: number) => {
        const rightHandCombined = new Array<SkeletonNodeData>()
        const leftHandCombined = new Array<SkeletonNodeData>()
        const newBars = new Array<SkeletonData>();

        const chunkArray = (array: Array<SkeletonNodeData>, chunkSize: number) => {
            return Array(Math.ceil(array.length / chunkSize)).fill(new SkeletonNodeData()).map((_, i) => array.slice(i * chunkSize, i * chunkSize + chunkSize))
        }

        const mergeIntoArray = (target, values) => {
            for (let i = 0; i < target.length; i++) {
                if (values[i] != undefined) {
                    target[i] = values[i];
                }
            }
        }

        bars.forEach(bar => {
            rightHandCombined.push(...bar.right);
            leftHandCombined.push(...bar.left);
        })

        const rightHandChunks = chunkArray(rightHandCombined, newBarSize);
        const leftHandChunks = chunkArray(leftHandCombined, newBarSize);

        for (let i = 0; i < rightHandChunks.length; i++) {
            const newSkeletonData = new SkeletonData(newBarSize)
            mergeIntoArray(newSkeletonData.right, rightHandChunks[i]);
            mergeIntoArray(newSkeletonData.left, leftHandChunks[i]);
            newBars.push(newSkeletonData)
        }

        updateBars(newBars)
    }

    const handleQuadratSizeChange = (event) => {

        if (event.key === 'Enter') {
            partialUpdateSettings({quadratSize: barSize});
            recalculateBars(barSize);
        }
    }


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

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={classes.accordionHeading}>Cтруктура и Отображение</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction="column" spacing={1}>
                            <TextField className={classes.textInputPadding}
                                       label="Размер квадрата"
                                       defaultValue={barSize}
                                       onChange={(event) =>setBarSize(Number(event.target.value))}
                                       onKeyUp={(event)=>handleQuadratSizeChange(event)}
                                       disabled={false}/>
                            <FormControlLabel
                                value="top"
                                control={<Checkbox
                                    checked={settings.displayApplicature}
                                    onChange={(e) => partialUpdateSettings({displayApplicature: e.target.checked})}
                                />}
                                label="Показывать аппликатуру"></FormControlLabel>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </CardContent>
        </Card>
    )
}
