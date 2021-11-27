import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import React, {useContext} from "react";
import {SettingsContext} from "../../context/settings-context";
import PdfExporter from "../../../core/pdf-exporter-class";
import {getScaleSize} from "../../../utils/rendering-utils";
import IconButton from "@mui/material/IconButton";
import {PrintRounded} from "@mui/icons-material";

export const SettingsExportSection = () => {
    const {settings, updateSettings} = useContext(SettingsContext);

    return (<PdfExporter targetRef={settings.editorElementRef}
                         filename="block-scheme.pdf"
                         scale={getScaleSize(settings.barSize)}
                         onComplete={() => updateSettings({...settings, isExportingInProgress: false})}>

            {({toPdf}) =>
                <ListItem button key={"ExportToPdf"} onClick={() => {
                    updateSettings({...settings, isExportingInProgress: true})
                    toPdf()
                }}>
                    <ListItemIcon>
                        <SaveRoundedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Экспорт в PDF"/>
                </ListItem>
            }

        </PdfExporter>
    )


}
