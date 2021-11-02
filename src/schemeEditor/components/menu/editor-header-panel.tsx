import {Checkbox, Divider, FormControlLabel, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import {SettingsContext} from "../../context/settings-context";
import {BarContext} from "../../context/bar-context";
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {SkeletonData} from "../../model/deprecated/skeleton-data";
import {OctaveNotationSelector} from "./octave-notation-selector";
import {StyledSlider} from "./playback-module";


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
            justifyContent: "space-between",
            width: "100%",
            height: "40",
            padding: "0 10px"

        }}>
            <div style={{
                display: "flex",
                flexDirection: "row"
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
                        style={{width: 50, maxWidth: 50, paddingLeft: "20px",}}
                        size="small"
                        defaultValue={barSize}
                        onChange={(event) => setBarSize(Number(event.target.value))}
                        onKeyUp={(event) => handleQuadratSizeChange(event)}
                        disabled={false}/>}
                    label={<Typography style={{
                        fontSize: "small",
                        paddingLeft: "5px",
                        paddingRight: "10px"
                    }}>Размер <br/> квадрата</Typography>}></FormControlLabel>
                <Divider orientation="vertical" flexItem/>
                <FormControlLabel
                    style={{width: 140, maxWidth: 140, paddingLeft: "20px"}}
                    control={<OctaveNotationSelector></OctaveNotationSelector>}
                    label={<Typography style={{
                        fontSize: "small",
                        paddingLeft: "5px",
                        paddingRight: "10px"
                    }}> Нотация <br/> октав</Typography>}></FormControlLabel>
                <Divider orientation="vertical" flexItem/>
                <Tooltip title="Отменить" placement="top">
                    <IconButton component="span" size="large">
                        <UndoRoundedIcon fontSize="small" onClick={undo} style={{fill: "#4b4a4a"}}/>
                    </IconButton>
                </Tooltip>
            </div>

            <div style={{
                display: "flex",
                alignSelf:"flex-end",
                alignItems:"center",
                alignContent:"center",
                flexDirection: "row",
                minWidth:"200px",
                width:"200px",
                paddingRight:"30px"

            }}><Typography style={{
                fontSize: "small",
                paddingLeft: "5px",
                paddingRight: "10px"
            }}> Темп: </Typography>
                <StyledSlider
                    style={{width: '90%'}}
                    onChange={(value, newValue)=>partialUpdateSettings({playbackTempo: (newValue as number) * -1})}
                    defaultValue={-0.25}
                    step={0.05}
                    min={-1}
                    max={-0.05}
                />
            </div>
        </div>
    );
}
