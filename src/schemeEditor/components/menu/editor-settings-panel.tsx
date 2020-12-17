import {
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    Slider,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {SkeletonData} from "../../model/skeleton-data";
import SoundfontProvider from "../../../components/piano-core/SoundfontProvider";
import {audioContext, soundfontHostname} from "../../model/global-constants";
import SpeedRoundedIcon from "@material-ui/icons/SpeedRounded";
import IconButton from "@material-ui/core/IconButton";
import {getNotesToPlay, playNotes} from "../../utils/playback-utils";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import {SaveLoadSettingsPanel} from "./save-load-settings-panel";
import {EditorSettings} from "../../model/editor-settings-data";
import {QuadratsContext} from "../../context/quadrats-context";
import {EditorModesSettingsPanel} from "./editor-modes-panel";
import {EditorExportPanel} from "./editor-export-panel";
import {PlaybackPanel} from "./playback-panel";


export interface EditorSettingsPanelProps {
    quadrats: Array<SkeletonData>;
    setQuadrats: any
}

export const EditorSettingsPanel = ({quadrats, setQuadrats}: EditorSettingsPanelProps) => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {quads, updateQuads} = useContext(QuadratsContext);

    const classes = useGlobalStyles();

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }

    let fileReader;



    const handleSaveFileRead = (e) => {
        const stringifiedData = fileReader.result;
        console.log(stringifiedData)
        const memorizedScheme = stringifiedData ? JSON.parse(stringifiedData) : [];
        let validatedBlockScheme = memorizedScheme.map(maybeQuad => {
            return SkeletonData.createFromDeserialized(maybeQuad);
        });
        setQuadrats(validatedBlockScheme)
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
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    Панель управления
                </Typography>
                <SaveLoadSettingsPanel/>
                <PlaybackPanel/>
                <EditorModesSettingsPanel/>
                {/*<Accordion>*/}
                {/*    <AccordionSummary*/}
                {/*        expandIcon={<ExpandMoreIcon/>}*/}
                {/*    >*/}
                {/*        <Typography className={classes.accoridionHeading}>Структура</Typography>*/}
                {/*    </AccordionSummary>*/}
                {/*    <AccordionDetails>*/}
                {/*        <TextField className={classes.textInputPadding}*/}
                {/*                   label="Размер квадрата"*/}
                {/*                   defaultValue={settings.quadratSize}*/}
                {/*                   onChange={(event => partialUpdateSettings({quadratSize: Number(event.target.value)}))}*/}
                {/*                   disabled={true}/>*/}
                {/*    </AccordionDetails>*/}
                {/*</Accordion>*/}
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
                {/*<EditorExportPanel/>*/}
            </CardContent>
        </Card>
    )
}
