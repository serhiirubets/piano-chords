import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Button, Checkbox, FormControlLabel, Grid, TextField, Typography} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import Accordion from "@material-ui/core/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import {SettingsContext} from "../../context/settings-context";

import Pdf from "react-to-pdf";

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

                <Pdf targetRef={settings.editorElementRef}
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
                </Pdf>
            </Grid>
        </AccordionDetails>
    </Accordion>)
}
