import {Checkbox, Divider, FormControlLabel, IconButton, TextField, Tooltip, Typography} from "@material-ui/core";
import React, {useContext, useState} from "react";
import {SettingsContext} from "../../context/settings-context";
import {BarContext} from "../../context/bar-context";
import UndoRoundedIcon from '@material-ui/icons/UndoRounded';
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import {OctaveNotationSelector} from "./octave-notation-selector";

export interface SaveLoadSettingsPanelProps {
}

export const EditorHeaderPanel = () => {
    const {settings, partialUpdateSettings} = useContext(SettingsContext);
    const {undo, bars, updateBars} = useContext(BarContext);
    const [barSize, setBarSize] = useState<number>(settings.quadratSize);
    const recalculateBars = (newBarSize: number) => {
        const rightHandCombined = new Array<SkeletonNodeData>()
        const leftHandCombined = new Array<SkeletonNodeData>()
        const newBars = new Array<SkeletonData>();

        const chunkArray = (array: Array<SkeletonNodeData>, chunkSize: number) => {
            return Array(Math.ceil(array.length / chunkSize)).fill(new SkeletonNodeData()).map((_, i) => array.slice(i * chunkSize, i * chunkSize + chunkSize))
        }

        const mergeIntoArray = (target, values) => {
            for (let i = 0; i < target.length; i++) {
                if (values[i] != undefined) {
                    target[i] = values[i];
                }
            }
        }

        bars.forEach(bar => {
            rightHandCombined.push(...bar.right);
            leftHandCombined.push(...bar.left);
        })

        const rightHandChunks = chunkArray(rightHandCombined, newBarSize);
        const leftHandChunks = chunkArray(leftHandCombined, newBarSize);

        for (let i = 0; i < rightHandChunks.length; i++) {
            const newSkeletonData = new SkeletonData(newBarSize)
            mergeIntoArray(newSkeletonData.right, rightHandChunks[i]);
            mergeIntoArray(newSkeletonData.left, leftHandChunks[i]);
            newBars.push(newSkeletonData)
        }

        updateBars(newBars)
    }

    const handleQuadratSizeChange = (event) => {

        if (event.key === 'Enter') {
            partialUpdateSettings({quadratSize: barSize});
            recalculateBars(barSize);
        }
    }


    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            overflow: "scroll",
            height: "40",
            padding: "0 10px"

        }}>

            <FormControlLabel
                value="top"
                control={<Checkbox
                    checked={settings.displayApplicature}
                    onChange={(e) => partialUpdateSettings({displayApplicature: e.target.checked})}
                />}
                label={<Typography style={{fontSize: "small"}}>Aппликатурa</Typography>}></FormControlLabel>
            <Divider orientation="vertical" flexItem/>
            <FormControlLabel
                control={<TextField
                    variant="outlined"
                    style={{width: 40, maxWidth: 40, paddingLeft: "15px"}}
                    size="small"
                    defaultValue={barSize}
                    onChange={(event) => setBarSize(Number(event.target.value))}
                    onKeyUp={(event) => handleQuadratSizeChange(event)}
                    disabled={false}/>}
                label={<Typography style={{fontSize: "small"}}>Размер <br/> квадрата</Typography>}></FormControlLabel>
            <Divider orientation="vertical" flexItem/>

            <Tooltip title="Отменить" placement="top">
                <IconButton component="span">
                    <UndoRoundedIcon fontSize="small" onClick={undo} style={{fill: "#4b4a4a"}}/>
                </IconButton>
            </Tooltip>
            <OctaveNotationSelector></OctaveNotationSelector>
        </div>
    )
}
