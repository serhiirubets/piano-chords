import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import PdfExporter from "../../../core/pdf-exporter-class";

export const SettingsExportSection = () => {
    const {settings, updateSettings} = useContext(SettingsContext);

    return (<PdfExporter targetRef={settings.editorElementRef}
                     filename="block-scheme.pdf"
                     scale={1.5}
                     onComplete={() => updateSettings({...settings, isExportingInProgress: false})}>
            {({toPdf}) => (
                <ListItem button key={"ExportToPdf"} onClick={() => {
                    updateSettings({...settings, isExportingInProgress: true})
                    toPdf()
                }}>
                    <ListItemIcon>
                        <SaveRoundedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Экспорт в PDF"/>
                </ListItem>
            )}
        </PdfExporter>
    )
}
