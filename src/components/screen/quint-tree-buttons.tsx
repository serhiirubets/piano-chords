import React, {useState} from "react"
import {
    Button,
    ButtonGroup,
    Card,
    FormControlLabel,
    Radio,
    RadioGroup,
    CardContent,
    Typography
} from "@material-ui/core";
import {MinorType, SelectedScale} from "../../model/SelectedScale";
import {majorFlat, majorSharp, minorFlat, minorSharp} from "../../data/scale-notes";
import {useGlobalStyles} from "../../App";

export interface QuintTreeButtonProps {
    onScaleSelect: (a: string) => any,
    // onMinorTypeChange: (a: MinorType) => any
}

export const QuintTreeButtons = (props: QuintTreeButtonProps) => {
    const classes = useGlobalStyles();
    return (
        <Card className={classes.thickCard} variant="outlined">
            <CardContent className={classes.quintTreeContent}>
                <div className={classes.quintTreeContent}>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Тональности
                    </Typography>
                    <h3>Мажорные</h3>
                    <div className={classes.scaleButtonGroup}>
                        <div>
                            {majorSharp.map(elem => {
                                return <Button
                                    style={buttonStyle}
                                    onClick={() => props.onScaleSelect(elem)}
                                    variant="outlined"
                                    color="primary">{elem}</Button>
                            })}
                        </div>

                        <div>
                            <Button onClick={() => props.onScaleSelect('C')} variant="contained"
                                    color="primary">C</Button>
                        </div>

                        <div>
                            {[...majorFlat].map(elem => {
                                return <Button
                                    onClick={() => props.onScaleSelect(elem)}
                                    variant="outlined"
                                    color="secondary"
                                    style={buttonStyle}>{elem}</Button>
                            })}
                        </div>
                    </div>

                    <h3>Минорные</h3>
                    <div className={classes.scaleButtonGroup}>
                        <div>
                            <div>
                                {minorSharp.map(elem => {
                                    return <Button style={buttonStyle}
                                                   onClick={() => props.onScaleSelect(elem)}
                                                   variant="outlined"
                                                   color="primary">{elem}</Button>
                                })}
                            </div>
                            <div>
                                <Button style={buttonStyle} onClick={() => props.onScaleSelect('Am')}
                                        variant="contained"
                                        color="primary">Am</Button>
                            </div>
                            <div>
                                {[...minorFlat].map(elem => {
                                    return <Button style={buttonStyle}
                                                   onClick={() => props.onScaleSelect(elem)}
                                                   variant="outlined"
                                                   color="secondary">{elem}</Button>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
const buttonStyle = {margin: "3px"}
