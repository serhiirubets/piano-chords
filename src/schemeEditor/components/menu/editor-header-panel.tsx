import {Checkbox, Divider, FormControlLabel, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {SettingsContext} from "../../../context/settings-context";
import {BarContext} from "../../../context/bar-context";
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import {OctaveNotationSelector} from "./octave-notation-selector";
import {StyledSlider} from "./playback-module";
import {recalculateBarsToNewSize} from "../../../utils/skeleton-node-utils";
import {deepCopyMap} from "../../../utils/js-utils";


export const EditorHeaderPanel = () => {
    const {settings, partialUpdateSettings} = useContext(SettingsContext);
    const {undo, sheets, updateSheets} = useContext(BarContext);
    const [barSize, setBarSize] = useState<number>(settings.quadratSize);
    console.log(settings)
    useEffect(() => {setBarSize(settings.quadratSize)})

    const recalculateBars = (newBarSize: number) => {
        const updatedSheets = deepCopyMap(sheets);
        updatedSheets.forEach((value,key)=> {
            const updatedBars = recalculateBarsToNewSize(value.bars, newBarSize);
            value.bars = updatedBars
        })
        updateSheets(updatedSheets)
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
                    label={<Typography style={{fontSize: "small"}}>Aппликатурa</Typography>}/>
                <Divider orientation="vertical" flexItem/>
                <FormControlLabel
                    control={<TextField
                        variant="outlined"
                        style={{width: 50, maxWidth: 50, paddingLeft: "20px",}}
                        size="small"
                        value={barSize}
                        onChange={(event) => setBarSize(Number(event.target.value))}
                        onKeyUp={(event) => handleQuadratSizeChange(event)}
                        disabled={false}/>}
                    label={<Typography style={{
                        fontSize: "small",
                        paddingLeft: "5px",
                        paddingRight: "10px"
                    }}>Размер <br/> квадрата</Typography>}/>
                <Divider orientation="vertical" flexItem/>
                <FormControlLabel
                    style={{width: 140, maxWidth: 140, paddingLeft: "20px"}}
                    control={<OctaveNotationSelector/>}
                    label={<Typography style={{
                        fontSize: "small",
                        paddingLeft: "5px",
                        paddingRight: "10px"
                    }}> Нотация <br/> октав</Typography>}/>
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
