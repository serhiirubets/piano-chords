import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Button, Checkbox, FormControlLabel, Grid, TextField, Typography} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import Accordion from "@material-ui/core/Accordion";
import React, {useContext} from "react";
import {useGlobalStyles} from "../../../App";
import Download from '@axetroy/react-download';
import {SettingsContext} from "../../context/settings-context";
import {EditorSettings} from "../../model/editor-settings-data";
import {BarContext} from "../../context/bar-context";
import html2canvas from "html2canvas";
import {ImageCompression, jsPDF} from "jspdf";
import {PRINTABLE_AREA_ID} from "../../model/global-constants";

export interface SaveLoadSettingsPanelProps {
}

export const EditorExportPanel = () => {
    const {settings} = useContext(SettingsContext);
    const {bars} = useContext(BarContext);
    const classes = useGlobalStyles();

    const printDocument = async () => {
        const input = document.getElementById(PRINTABLE_AREA_ID);
        console.log(input)
        if (input) {
            html2canvas(input)
                .then((canvas) => {
                    console.log(canvas)
                    const imgData = canvas.toDataURL('image/png');
                    console.log(imgData)
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'JPEG', 0, 0, 1000, 1000)

                    pdf.save("download.pdf");
                    console.log('Cохранение как пдф');
                })
            ;
        }

    }

    return (<Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
        >
            <Typography className={classes.accoridionHeading}>Экспорт</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="column" spacing={1}>
                <Button
                    variant="outlined"
                    startIcon={<SaveRoundedIcon/>}
                    style={{width: "100%"}}
                    onClick={async () => await printDocument()}
                    disabled={true}>
                    Сохранить как PDF
                </Button>
            </Grid>
        </AccordionDetails>
    </Accordion>)
}
