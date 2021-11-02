import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent,
    Typography
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import PlaylistPlayRoundedIcon from "@mui/icons-material/PlaylistPlayRounded";
import Accordion from "@mui/material/Accordion";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useGlobalStyles} from "../../../App";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";
import {BarContext} from "../../context/bar-context";
import {DDTScheme} from "../../resources/DDT-triplets-recording";
import {SheetData} from "../../model/deprecated/sheet-data";
import {RefreshRounded} from "@mui/icons-material";
import {NymphScheme} from "../../resources/Nymph-recording";

export interface SaveLoadSettingsPanelProps {
}

export const SaveLoadSettingsPanel = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {sheets, updateSheets, updateActiveSheet,isTouched} = useContext(BarContext);
    const SHEETS_LOCALSTORAGE_KEY = "sheets_autosave";
    const SAVE_NAME = 'Новая блок-схема'
    const classes = useGlobalStyles();

    const [demoFile, setDemoFile] = useState('ba');
    let fileReader;
    let filename;


    const loadFromLocalstorage = () => {
            const sheetsLocalstorageValue = localStorage.getItem(SHEETS_LOCALSTORAGE_KEY);
            if (sheetsLocalstorageValue) {
                const memorizedScheme = (sheetsLocalstorageValue ? new Map(JSON.parse(sheetsLocalstorageValue)) : []) as Map<string, SheetData>;
                const firstSheet = Array.from(memorizedScheme.keys())[0]
                updateSheets(memorizedScheme )
                updateActiveSheet(firstSheet)
                partialUpdateSettings({quadratSize:memorizedScheme.get(firstSheet)!.bars[0].size})
            }
    }

    useEffect(() => {
        if (!settings.autosave) {
            return;
        }
        if (!isTouched) {
            return;
        }
        localStorage.setItem(SHEETS_LOCALSTORAGE_KEY, JSON.stringify(Array.from(sheets.entries())));


    }, [sheets]);


    const handleDemoSongSelection = (event: SelectChangeEvent<string>) => {
        setDemoFile(event.target.value as string);
    };

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }


    const handleReadPersistedFile = (e) => {
        const stringifiedData = fileReader.result;
        const memorizedScheme = (stringifiedData ? new Map(JSON.parse(stringifiedData)) : []) as Map<string, SheetData>;
        const firstSheet = Array.from(memorizedScheme.keys()).filter(value => value !== null)[0]
        updateSheets(memorizedScheme )
        updateActiveSheet(firstSheet)
        partialUpdateSettings({quadratSize:memorizedScheme.get(firstSheet)!.bars[0].size, fileName:filename})
    }

    const handleSaveFileSelected = (e) => {
        const file = e.target.files[0]
        const sanitizedFilename = file.name.replace(".json", "")
        filename = sanitizedFilename;

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
                    label="Aвтосохранение в память"></FormControlLabel>
                <Button
                    variant="outlined"
                    startIcon={<RefreshRounded/>}
                    onClick={loadFromLocalstorage}>
                    Загрузить автосохранение
                </Button>
                <hr/>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Имя демо-файла</InputLabel>
                    <Select
                        variant="standard"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={demoFile}
                        onChange={handleDemoSongSelection}
                    >
                        <MenuItem value={'nymph'}>Nymphetamine</MenuItem>
                        <MenuItem value={'ddt'}>ДДТ - Свобода</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    startIcon={<PlaylistPlayRoundedIcon/>}
                    onClick={() => {

                        const fileString = demoFile === 'nymph' ? JSON.stringify(NymphScheme) :
                                demoFile === 'ddt' ? JSON.stringify(DDTScheme) : '';

                        const memorizedScheme = (fileString ? new Map(JSON.parse(fileString)) : []) as Map<string, SheetData>;
                        const firstSheet = Array.from(memorizedScheme.keys())[0]
                        updateSheets(memorizedScheme )
                        updateActiveSheet(firstSheet)
                        partialUpdateSettings({quadratSize:memorizedScheme.get(firstSheet)!.bars[0].size})
                    }}>
                    Загрузить демо
                </Button>
            </Grid>
        </AccordionDetails>
    </Accordion>)
}
