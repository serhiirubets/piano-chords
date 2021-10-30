import {Checkbox, Divider, FormControlLabel, IconButton, TextField, Tooltip, Typography} from "@material-ui/core";
import React, {useContext, useState} from "react";
import {SettingsContext} from "../../context/settings-context";
import {BarContext} from "../../context/bar-context";
import UndoRoundedIcon from '@material-ui/icons/UndoRounded';
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {SkeletonData} from "../../model/deprecated/skeleton-data";

export interface SaveLoadSettingsPanelProps {
}

export const NotationMenu = () => {
    const {settings, partialUpdateSettings} = useContext(SettingsContext);

}
