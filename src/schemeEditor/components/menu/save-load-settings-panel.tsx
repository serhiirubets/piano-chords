import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Button, Grid, Typography} from "@material-ui/core";
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
import {QuadratsContext} from "../../context/quadrats-context";

export interface SaveLoadSettingsPanelProps{
    quadrats: Array<SkeletonData>;
    setQuadrats: any
}

export const SaveLoadSettingsPanel = ({quadrats,setQuadrats}:SaveLoadSettingsPanelProps)=>{
    const {settings, updateSettings} = useContext(SettingsContext);
    const {quads, updateQuads} = useContext(QuadratsContext);
    const SAVE_NAME = 'Новая блок-схема'
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


    return(<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
        >
            <Typography className={classes.accoridionHeading}>Загрузка/Сохранение</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="column" spacing={1}>

                <Download file={`${SAVE_NAME}.json`}
                          content={JSON.stringify(quadrats, null, 2)}
                >
                    <Button
                        variant="outlined"
                        startIcon={<SaveRoundedIcon/>}
                        style={{width: "100%"}}>
                        Сохранить
                    </Button>
                </Download>
                <label htmlFor="upload-photo">
                    <input
                        style={{display: 'none'}}
                        id="upload-photo"
                        name="upload-photo"
                        type="file"
                        onChange={(e) => handleSaveFileSelected(e)}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<PublishRoundedIcon/>}
                        component="span"
                        style={{width: '100%'}}
                    >
                        Загрузить
                    </Button>
                </label>
                <Button
                    variant="outlined"
                    startIcon={<PlaylistPlayRoundedIcon/>}
                    onClick={() => {
                        const restoredScheme = JSON.parse(BAIntroSchemeString);
                        let validatedBABlockScheme = restoredScheme.map(maybeQuad => {
                            return SkeletonData.createFromDeserialized(maybeQuad);
                        });
                        updateQuads(validatedBABlockScheme);
                    }}>
                    Загрузить демо
                </Button>
            </Grid>
        </AccordionDetails>
    </Accordion>)
}
