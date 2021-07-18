import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
    Button,
    Checkbox, debounce,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import PlaylistPlayRoundedIcon from "@material-ui/icons/PlaylistPlayRounded";
import {BAIntroScheme} from "../../resources/BA-intro-recording";
import Accordion from "@material-ui/core/Accordion";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useGlobalStyles} from "../../../App";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";
import {BarContext} from "../../context/bar-context";
import {Gorod} from "../../resources/Gorod-kotorogo-net-recordings";
import {DDTScheme} from "../../resources/DDT-triplets-recording";
import {SheetData} from "../../model/deprecated/sheet-data";
import { unstable_next } from "scheduler";
import {AUTOSAVE_INTERVAL_MS} from "../../model/global-constants";

export interface SaveLoadSettingsPanelProps {
}

export const SaveLoadSettingsPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {sheets, updateSheets, isTouched} = useContext(BarContext);
    const SHEETS_LOCALSTORAGE_KEY = "sheets_autosave";
    const SAVE_NAME = 'Новая блок-схема'
    const classes = useGlobalStyles();

    const [demoFile, setDemoFile] = React.useState('ba');
    const [isAutosaveScheduled, setAutosaveScheduled] = useState(false);
    let fileReader;

    const debouncedSave = useCallback(
        debounce(() => {
            localStorage.setItem(SHEETS_LOCALSTORAGE_KEY, JSON.stringify(Array.from(sheets.entries()), null, 2))
        }, AUTOSAVE_INTERVAL_MS),
        [],
    );

    useEffect(() => {

        if(!settings.autosave){
            return;
        }
        if(!isTouched){
            const sheetsLocalstorageValue = localStorage.getItem(SHEETS_LOCALSTORAGE_KEY);
                if (sheetsLocalstorageValue) {
                    const processedSheetsValue = new Map(JSON.parse(sheetsLocalstorageValue));
                    updateSheets(processedSheetsValue as Map<string, SheetData>)
                }
        }
        if(!isAutosaveScheduled){
            setTimeout(() => {
                localStorage.setItem(SHEETS_LOCALSTORAGE_KEY, JSON.stringify(Array.from(sheets.entries()), null, 2));
                setAutosaveScheduled(false);
            },AUTOSAVE_INTERVAL_MS)
        }

    }, []);



    const handleDemoSongSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
        setDemoFile(event.target.value as string);
    };

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }





    const handleReadPersistedFile = (e) => {
        const stringifiedData = fileReader.result;
        console.log(stringifiedData)
        const memorizedScheme = stringifiedData ? new Map(JSON.parse(stringifiedData)) : [];
        updateSheets(memorizedScheme as Map<string, SheetData>)
    }

    const handleSaveFileSelected = (e) => {
        const file = e.target.files[0]
        partialUpdateSettings({fileName:file.name.replace(".json","")})
        fileReader = new FileReader();
        fileReader.onloadend = handleReadPersistedFile
        fileReader.readAsText(file)
    }


    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
        >
            <Typography className={classes.accordionHeading}>Загрузка/Сохранение</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="column" spacing={1}>

                <Download file={`${SAVE_NAME}.json`}
                          content={JSON.stringify(Array.from(sheets.entries()), null, 2)}
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
                <hr/>

                <FormControlLabel
                    value="top"
                    control={<Checkbox
                        checked={settings.autosave}
                        onChange={(e) => partialUpdateSettings({autosave: e.target.checked})}
                    />}
                    label="Сохранять между обновлениями страницы"></FormControlLabel>

                <hr/>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Имя демо-файла</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={demoFile}
                        onChange={handleDemoSongSelection}
                    >
                        <MenuItem value={'ba'}>Беспечный ангел</MenuItem>
                        <MenuItem value={'gorod'}>Город которого нет</MenuItem>
                        <MenuItem value={'ddt'}>ДДТ - Свобода</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    startIcon={<PlaylistPlayRoundedIcon/>}
                    onClick={() => {

                        const fileString = demoFile === 'ba' ? JSON.stringify(BAIntroScheme) :
                            demoFile === 'gorod' ? JSON.stringify(Gorod) :
                                demoFile === 'ddt' ? JSON.stringify(DDTScheme) : '';

                        const restoredScheme = JSON.parse(fileString);
                        updateSheets(restoredScheme);
                    }}>
                    Загрузить демо
                </Button>
            </Grid>
        </AccordionDetails>
    </Accordion>)
}
