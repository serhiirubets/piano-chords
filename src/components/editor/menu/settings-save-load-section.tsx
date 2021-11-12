import {Divider, Grid, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import React, {useContext, useEffect} from "react";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {SettingContextData} from "../../../model/context-data-models/settings-context-data";
import {BarContext} from "../../context/bar-context";
import {DDTScheme} from "../../../resources/DDT-triplets-recording";
import {SheetData} from "../../../model/skeleton-entities-data/sheet-data";
import {DownloadRounded, RefreshRounded} from "@mui/icons-material";
import {NymphScheme} from "../../../resources/Nymph-recording";
import {Octaves} from "../../../model/skeleton-entities-data/octave-data";
import {SaveGoogleDrive} from "./google-drive-save-list-item";
import {LoadFromGoogleDrive} from "./google-drive-load-list-item";
import {SettingsPanelExpandableSection} from "../reusable/settings-panel-expandable-section";
import FiberNewIcon from '@mui/icons-material/FiberNew';
import {SkeletonData} from "../../../model/skeleton-entities-data/skeleton-data";

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
        console.log('restored autosave object', saveObject)
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


        console.log(partialSettings.octaveNotation)
        const restoredOctaveNotationKey = Object.keys(Octaves).filter(key => Octaves[key].name === partialSettings.octaveNotation.name)[0]
        console.log('Key', restoredOctaveNotationKey)
        partialUpdateSettings({
            fileName: filename,
            octaveNotation: Octaves[restoredOctaveNotationKey],
            barSize: partialSettings.quadratSize || restoredSheetsData.get(firstSheet)!.bars.length
        })
    }

    const resetContext = () => {
        const defaultSheet = new SheetData(settings.barSize);
        defaultSheet.name = "Часть 1";
        defaultSheet.index = 0;
        defaultSheet.bars = [new SkeletonData(settings.barSize)];
        const newSheetData = new Map().set(defaultSheet.name, defaultSheet)
        updateSheets(newSheetData)

    }

    return (
        <Grid container direction="column" spacing={1}>
            <ListItem button key={"NewScheme"} onClick={resetContext}>
                <ListItemIcon>
                    <FiberNewIcon/>
                </ListItemIcon>
                <ListItemText primary="Новая блок-схема"/>
            </ListItem>
            <SettingsPanelExpandableSection title={"Сохранить"}>
                <List>
                    <Download file={`${settings.fileName}.json`}
                              content={JSON.stringify(prepareSaveFile(), null, 2)}>
                        <ListItem button key={"SaveLocalDrive"}>
                            <ListItemIcon>
                                <DownloadRounded/>
                            </ListItemIcon>
                            <ListItemText primary="Локальный диск"/>
                        </ListItem>
                    </Download>
                    <SaveGoogleDrive content={JSON.stringify(prepareSaveFile(), null, 2)}/>
                </List>
            </SettingsPanelExpandableSection>
            <SettingsPanelExpandableSection title={"Загрузить"}>
                <List>
                    <label htmlFor="upload-local">
                        <input
                            style={{display: 'none'}}
                            id="upload-local"
                            name="upload-local"
                            type="file"
                            onChange={(e) => handleSaveFileSelected(e)}
                        />
                        <ListItem button key={"Load"}>
                            <ListItemIcon>
                                <PublishRoundedIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Локальный диск"/>
                        </ListItem>
                    </label>
                    <LoadFromGoogleDrive onFileRead={parseSaveFileAndUpdateModel}/>
                </List>
            </SettingsPanelExpandableSection>
            <ListItem button key={"LoadQuickSave"} onClick={loadFromLocalstorage}>
                <ListItemIcon>
                    <RefreshRounded/>
                </ListItemIcon>
                <ListItemText primary="Загрузить автосохранение"/>
            </ListItem>
            <Divider/>
            <SettingsPanelExpandableSection title={"Загрузить демо"}>
                <List>
                    <ListItem button key={"LoadDemoNymph"}
                              onClick={() => reloadDemoFile(JSON.stringify(NymphScheme))}>
                        <ListItemText primary="Nymphetamine"/>
                    </ListItem>
                    <ListItem button key={"LoadDemoDDT"} onClick={() => reloadDemoFile(JSON.stringify(DDTScheme))}>
                        <ListItemText primary="ДДТ - Свобода"/>
                    </ListItem>
                </List>
            </SettingsPanelExpandableSection>
            <Divider/>
        </Grid>
    )
}
