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

    // const printDocument = async () => {
    //     const input = document.getElementById(PRINTABLE_AREA_ID);
    //     console.log(input)
    //     if (input) {
    //         html2canvas(input)
    //             .then((canvas) => {
    //                 console.log(canvas)
    //                 const imgData = canvas.toDataURL('image/png');
    //                 console.log(imgData)
    //                 const pdf = new jsPDF();
    //                 pdf.addImage(imgData, 'JPEG', 0, 0, 1000, 1000)
    //
    //                 pdf.save("download.pdf");
    //                 console.log('Cохранение как пдф');
    //             })
    //         ;
    //     }
    //
    // }

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
                     scale={0.8}
                     onComplete={() => updateSettings({...settings,isExportingInProgress:false})}>
                    {({toPdf}) => (

                        < Button
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
