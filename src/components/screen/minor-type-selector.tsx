import React, {useState} from "react"
import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {MinorType, SelectedScale} from "../../model/SelectedScale";
import {majorFlat, majorSharp, minorFlat, minorSharp} from "../../data/scale-notes";
import {useGlobalStyles} from "../../App";

export interface MinorTypeSelectorProps {
    onMinorTypeChange: (a: MinorType) => any
}

export const MinorTypeSelector = (props: MinorTypeSelectorProps) => {
    const classes = useGlobalStyles();
    const [minorType, setMinorType] = useState('natural' as MinorType);

    const handleMinorTypeChange = (event) => {
        setMinorType(event.target.value);
        props.onMinorTypeChange(event.target.value);
    }
    return (

        <Card className={classes.thinCard} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    Тип минора
                </Typography>
                <RadioGroup value={minorType} onChange={handleMinorTypeChange}>
                    <FormControlLabel value="natural" control={<Radio/>} label="Натуральный"/>
                    <FormControlLabel value="harmonic" control={<Radio/>} label="Гармонический"/>
                    <FormControlLabel value="melodic" control={<Radio/>} label="Мелодический"/>
                </RadioGroup>
            </CardContent>

        </Card>
    )
}
const buttonStyle = {margin: "3px"}
