import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Accordion, AccordionSummary, Divider, Grid, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import PlaylistPlayRoundedIcon from "@mui/icons-material/PlaylistPlayRounded";
import React, {useContext, useEffect} from "react";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {SettingContextData} from "../../../model/context-data-models/settings-context-data";
import {BarContext} from "../../context/bar-context";
import {DDTScheme} from "../../../resources/DDT-triplets-recording";
import {SheetData} from "../../../model/skeleton-entities-data/sheet-data";
import {RefreshRounded} from "@mui/icons-material";
import {NymphScheme} from "../../../resources/Nymph-recording";
import {Octaves} from "../../../model/skeleton-entities-data/octave-data";


export const SettingsSaveLoadSection = () => {
    const {settings, updateSettings} = useContext(SettingsContext);
    const {
        sheets,
        updateSheets,
        updateActiveSheet,
        updateActiveSubSheet,
        isTouched,
        updateBars
    } = useContext(BarContext);
    const SHEETS_LOCALSTORAGE_KEY = "sheets_autosave";
    const SAVE_NAME = 'Новая блок-схема'

    let fileReader;
    let filename;


    const loadFromLocalstorage = () => {
        const sheetsLocalstorageValue = localStorage.getItem(SHEETS_LOCALSTORAGE_KEY);
        if (sheetsLocalstorageValue) {
            parseSaveFileAndUpdateModel(sheetsLocalstorageValue)
        }
    }

    useEffect(() => {
        if (!isTouched) {
            return;
        }
        localStorage.setItem(SHEETS_LOCALSTORAGE_KEY, JSON.stringify(prepareSaveFile()));
    }, [sheets, isTouched]);

    const reloadDemoFile = (fileString) => {
        const memorizedScheme = (fileString ? new Map(JSON.parse(fileString)) : []) as Map<string, SheetData>;
        const firstSheet = Array.from(memorizedScheme.keys())[0]
        updateSheets(memorizedScheme)
        updateActiveSheet(firstSheet)
        partialUpdateSettings({barSize: memorizedScheme.get(firstSheet)!.bars[0].size})
    }

    const partialUpdateSettings = (value: Partial<SettingContextData>) => {
        updateSettings({...settings, ...value})
    }


    const handleReadPersistedFile = (e) => {
        const stringifiedData = fileReader.result;
        parseSaveFileAndUpdateModel(stringifiedData)
    }

    const handleSaveFileSelected = (e) => {
        const file = e.target.files[0]
        const sanitizedFilename = file.name.replace(".json", "")
        filename = sanitizedFilename;

        fileReader = new FileReader();
        fileReader.onloadend = handleReadPersistedFile
        fileReader.readAsText(file)
    }

    const prepareSaveFile = () => {
        const saveObject = {
            settings: {
                quadratSize: settings.barSize,
                octaveNotation: settings.octaveNotation,
            },
            data: Array.from(sheets.entries())
        }
        return saveObject
    }

    const parseSaveFileAndUpdateModel = (stringifiedData) => {
        const saveObject = JSON.parse(stringifiedData)
        const partialSettings = saveObject.settings || {}
        const barData = saveObject.data
        const processedBarData = (barData || []).map(([key, value]) => {
            const valueAsSheet = new SheetData(value.bars.size)
            valueAsSheet.name = value.name;
            valueAsSheet.parentName = value.parentName
            valueAsSheet.bars = value.bars
            valueAsSheet.index = value.index
            valueAsSheet.isTrack = value.isTrack
            return [key, value]
        })

        const restoredSheetsData = new Map(processedBarData) as Map<string, SheetData>;

        const firstSheet = Array.from(restoredSheetsData.keys()).filter(value => value !== null)[0]
        const subSheets = Array.from(restoredSheetsData.values()).filter(value => value.parentName === firstSheet)
        const firstSubSheet = subSheets.length > 0 ? subSheets[0].name : null
        updateBars(restoredSheetsData.get(firstSheet)!.bars)
        updateSheets(restoredSheetsData)
        updateActiveSheet(firstSheet)
        updateActiveSubSheet(firstSubSheet)
        partialUpdateSettings({
            fileName: filename,
            octaveNotation: partialSettings.octaveNotation || Octaves.SCIENTIFIC,
            barSize: partialSettings.quadratSize || restoredSheetsData.get(firstSheet)!.bars.length
        })
    }

    return (
        <Grid container direction="column" spacing={1}>

            <Download file={`${SAVE_NAME}.json`}
                      content={JSON.stringify(prepareSaveFile(), null, 2)}
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
