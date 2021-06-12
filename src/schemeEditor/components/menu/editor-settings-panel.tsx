import {Card, CardContent, Checkbox, FormControlLabel, TextField, Typography} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import {SaveLoadSettingsPanel} from "./save-load-settings-panel";
import {EditorSettings} from "../../model/editor-settings-data";
import {BarContext} from "../../context/bar-context";
import {EditorModesSettingsPanel} from "./editor-modes-panel";
import {PlaybackPanel} from "./playback-panel";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";


export const EditorSettingsPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {bars, updateBars} = useContext(BarContext);

    const classes = useGlobalStyles();

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }

    const recalculateBars = (newBarSize: number) => {
        // if (newBarSize < 1){
        //     return;
        // }
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

    let fileReader;


    const handleSaveFileRead = (e) => {
        const stringifiedData = fileReader.result;
        console.log(stringifiedData)
        const memorizedScheme = stringifiedData ? JSON.parse(stringifiedData) : [];
        let validatedBlockScheme = memorizedScheme.map(maybeQuad => {
            // return SkeletonData.createFromDeserialized(maybeQuad);
        });
        updateBars(validatedBlockScheme)
    }

    const handleSaveFileSelected = (e) => {
        const file = e.target.files[0]
        fileReader = new FileReader();
        fileReader.onloadend = handleSaveFileRead
        fileReader.readAsText(file)
    }

    return (
        <Card className={classes.controlPanelCard}>
            <CardContent>
                <div style={{position: 'sticky'}}>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Панель управления
                    </Typography>
                    <SaveLoadSettingsPanel/>
                    <PlaybackPanel/>
                    <EditorModesSettingsPanel/>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={classes.accoridionHeading}>Структура</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField className={classes.textInputPadding}
                                       label="Размер квадрата"
                                       defaultValue={settings.quadratSize}
                                       onChange={(event) => {
                                           const newQuadratSize = Number(event.target.value);
                                           partialUpdateSettings({quadratSize: newQuadratSize});
                                           recalculateBars(newQuadratSize);
                                       }}
                                       disabled={false}/>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                        >
                            <Typography className={classes.accoridionHeading}>Отображение</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControlLabel
                                value="top"
                                control={<Checkbox
                                    checked={settings.displayApplicature}
                                    onChange={(e) => partialUpdateSettings({displayApplicature: e.target.checked})}
                                />}
                                label="Показывать аппликатуру"></FormControlLabel>
                        </AccordionDetails>
                    </Accordion>
                </div>
                {/*<EditorExportPanel/>*/}
            </CardContent>
        </Card>
    )
}
