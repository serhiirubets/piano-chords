import {Accordion, AccordionSummary, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import {LoadFromGoogleDrive} from "../menu/google-drive-load-list-item";
import React from "react";

export const SettingsPanelExpandableSection = ({title, children}) => {
    return (
        <Accordion>
            <AccordionSummary
                style={{padding: 0, margin: 0, maxHeight: "48px"}}
                expandIcon={<ExpandMoreIcon/>}
            >
                <ListItem button key={`section-button-${title}`}>
                    <ListItemText inset primary={title}/>
                </ListItem>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}
