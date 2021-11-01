import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Button, Grid, Typography} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Accordion from "@mui/material/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";
import PdfExporter from "../../../core/pdf-exporter-class";


export interface SaveLoadSettingsPanelProps {
}

export const EditorExportPanel = () => {
    const {settings,updateSettings} = useContext(SettingsContext);
    const classes = useGlobalStyles();

    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
        >
            <Typography className={classes.accordionHeading}>Экспорт</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="column" spacing={1}>

                <PdfExporter targetRef={settings.editorElementRef}
                     filename="block-scheme.pdf"
                     scale={1.5}
                     onComplete={() => updateSettings({...settings,isExportingInProgress:false})}>
                    {({toPdf}) => (

                        <Button
                            variant="outlined"
                            startIcon={<SaveRoundedIcon/>}
                            style={{width: "100%"}}
                            onClick={() => {
                                updateSettings({...settings,isExportingInProgress:true})
                                toPdf()
                            }}>
                            Сохранить как PDF
                        </Button>
                    )}
                </PdfExporter>
            </Grid>
        </AccordionDetails>
    </Accordion>)
}
