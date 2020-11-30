import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {
    Button,
    ButtonGroup,
    Card,
    CardContent, Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {MinorType, SelectedScale} from "../../model/SelectedScale";
import {allScales, majorFlat, majorSharp, minorFlat, minorSharp} from "../../data/scale-notes";
import {useGlobalStyles} from "../../App";

export interface ScaleSelectorProps {
    onSelectedScalesChange?: (a: string[]) => any
    selectedScales: string[]
    setSelectedScales: Dispatch<SetStateAction<string[]>>
}

export const ScaleSelector = (props: ScaleSelectorProps) => {
    const classes = useGlobalStyles();
    const [markedScales, setMarkedScales] = useState(props.selectedScales);

    useEffect(() => setMarkedScales(props.selectedScales), [props.selectedScales])

    const addScaleToList = (scale: string[]) => {
        const tmpScale = Array.from((new Set([...markedScales, ...scale])));
        setMarkedScales(tmpScale);
        props.setSelectedScales(tmpScale)
    }

    const removeScale = (scale: string[]) => {
        const tmpScale = markedScales.filter(s => !scale.includes(s));
        setMarkedScales(tmpScale);
        props.setSelectedScales(tmpScale)
    }

    const addOrRemoveScale = (scale: string[], shouldBeAdded: boolean) => {
        if (shouldBeAdded) {
            addScaleToList(scale)
        } else {
            removeScale(scale)
        }
        console.log(markedScales)

        setMarkedScales(markedScales)
    }

    return (
        <Card className={classes.thickCard} variant="outlined">
            <CardContent className={classes.quintTreeContent}>
                <div className={classes.quintTreeContent}>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Тональности включенные в тест
                    </Typography>

                    <div>
                        <FormControlLabel checked={majorSharp.some(e => markedScales.includes(e))}
                                          control={<Checkbox
                                              onChange={(event, checked) => addOrRemoveScale(majorSharp, checked)}/>}
                                          label="Мажорные диезные"
                        />
                        {majorSharp.map(elem => {
                            return <FormControlLabel
                                control={<Checkbox checked={markedScales.includes(elem)}
                                                   onChange={(event, checked) => addOrRemoveScale([elem], checked)}/>}
                                label={elem}
                            />
                        })}

                        <div>

                        </div>
                        <FormControlLabel
                            control={<Checkbox checked={majorFlat.every(e => markedScales.includes(e))}
                                               onChange={(event, checked) => addOrRemoveScale(majorFlat, checked)}/>}
                            label="Мажорные бемольные"
                        />
                        {majorFlat.map(elem => {
                            return <FormControlLabel
                                control={<Checkbox checked={markedScales.includes(elem)}
                                                   onChange={(event, checked) => addOrRemoveScale([elem], checked)}/>}
                                label={elem}
                            />
                        })}
                    </div>

                    <div>
                        <FormControlLabel
                            control={<Checkbox checked={minorSharp.every(e => markedScales.includes(e))}
                                               onChange={(event, checked) => addOrRemoveScale(minorSharp, checked)}/>}
                            label="Минорные диезные"
                        />
                        {minorSharp.map(elem => {
                            return <FormControlLabel
                                control={<Checkbox checked={markedScales.includes(elem)}
                                                   onChange={(event, checked) => addOrRemoveScale([elem], checked)}/>}
                                label={elem}
                            />
                        })}

                    </div>

                    <div>
                        <FormControlLabel
                            control={<Checkbox checked={minorFlat.every(e => markedScales.includes(e))}
                                               onChange={(event, checked) => addOrRemoveScale(minorFlat, checked)}/>}
                            label="Минорные бемольные"
                        />
                        {minorFlat.map(elem => {
                            return <FormControlLabel
                                control={<Checkbox checked={markedScales.includes(elem)}
                                                   onChange={(event, checked) => addOrRemoveScale([elem], checked)}/>}
                                label={elem}
                            />
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}
