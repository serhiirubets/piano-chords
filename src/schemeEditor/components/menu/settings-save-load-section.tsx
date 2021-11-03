import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionSummary,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SelectChangeEvent
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import PlaylistPlayRoundedIcon from "@mui/icons-material/PlaylistPlayRounded";
import React, {useContext, useEffect, useState} from "react";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";
import {BarContext} from "../../context/bar-context";
import {DDTScheme} from "../../resources/DDT-triplets-recording";
import {SheetData} from "../../model/deprecated/sheet-data";
import {RefreshRounded} from "@mui/icons-material";
import {NymphScheme} from "../../resources/Nymph-recording";


export const SettingsSaveLoadSection = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {sheets, updateSheets, updateActiveSheet, isTouched} = useContext(BarContext);
    const SHEETS_LOCALSTORAGE_KEY = "sheets_autosave";
    const SAVE_NAME = 'Новая блок-схема'

    const [demoFile, setDemoFile] = useState('nymphetamine');
    let fileReader;
    let filename;


    const loadFromLocalstorage = () => {
        const sheetsLocalstorageValue = localStorage.getItem(SHEETS_LOCALSTORAGE_KEY);
        if (sheetsLocalstorageValue) {
            const memorizedScheme = (sheetsLocalstorageValue ? new Map(JSON.parse(sheetsLocalstorageValue)) : []) as Map<string, SheetData>;
            const firstSheet = Array.from(memorizedScheme.keys())[0]
            updateSheets(memorizedScheme)
            updateActiveSheet(firstSheet)
            partialUpdateSettings({quadratSize: memorizedScheme.get(firstSheet)!.bars[0].size})
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

    const reloadDemoFile = (fileString) => {
        const memorizedScheme = (fileString ? new Map(JSON.parse(fileString)) : []) as Map<string, SheetData>;
        const firstSheet = Array.from(memorizedScheme.keys())[0]
        updateSheets(memorizedScheme)
        updateActiveSheet(firstSheet)
        partialUpdateSettings({quadratSize: memorizedScheme.get(firstSheet)!.bars[0].size})
    }

    const partialUpdateSettings = (value: Partial<EditorSettings>) => {
        updateSettings({...settings, ...value})
    }


    const handleReadPersistedFile = (e) => {
        const stringifiedData = fileReader.result;
        const memorizedScheme = (stringifiedData ? new Map(JSON.parse(stringifiedData)) : []) as Map<string, SheetData>;
        const firstSheet = Array.from(memorizedScheme.keys()).filter(value => value !== null)[0]
        updateSheets(memorizedScheme)
        updateActiveSheet(firstSheet)
        partialUpdateSettings({quadratSize: memorizedScheme.get(firstSheet)!.bars[0].size, fileName: filename})
    }

    const handleSaveFileSelected = (e) => {
        const file = e.target.files[0]
        const sanitizedFilename = file.name.replace(".json", "")
        filename = sanitizedFilename;

        fileReader = new FileReader();
        fileReader.onloadend = handleReadPersistedFile
        fileReader.readAsText(file)
    }

    return (
        <Grid container direction="column" spacing={1}>

            <Download file={`${SAVE_NAME}.json`}
                      content={JSON.stringify(Array.from(sheets.entries()), null, 2)}
            >
                <ListItem button key={"Save"}>
                    <ListItemIcon>
                        <SaveRoundedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Сохранить"/>
                </ListItem>
            </Download>
            <label htmlFor="upload-photo">
                <input
                    style={{display: 'none'}}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    onChange={(e) => handleSaveFileSelected(e)}
                />
                <ListItem button key={"Load"}>
                    <ListItemIcon>
                        <PublishRoundedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Загрузить"/>
                </ListItem>
            </label>
            <ListItem button key={"LoadQuickSave"} onClick={loadFromLocalstorage}>
                <ListItemIcon>
                    <RefreshRounded/>
                </ListItemIcon>
                <ListItemText primary="Загрузить автосохранение"/>
            </ListItem>
            <Divider/>
            <Accordion>
                <AccordionSummary
                    style={{padding: 0, margin: 0, maxHeight: "48px"}}
                    expandIcon={<ExpandMoreIcon/>}
                >
                    <ListItem button key={"LoadDemoFile"}>
                        <ListItemIcon>
                            <PlaylistPlayRoundedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Загрузить демо"/>
                    </ListItem>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        <ListItem button key={"LoadDemoNymph"}
                                  onClick={() => reloadDemoFile(JSON.stringify(NymphScheme))}>
                            <ListItemText primary="Nymphetamine"/>
                        </ListItem>
                        <ListItem button key={"LoadDemoDDT"} onClick={() => reloadDemoFile(JSON.stringify(DDTScheme))}>
                            <ListItemText primary="ДДТ - Свобода"/>
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
            <Divider/>
        </Grid>
    )
}
