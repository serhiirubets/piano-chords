import React, {useState} from "react"
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {QuintTreeButtons} from "./screen/quint-tree-buttons";
import {allScales, majorFlat, majorSharp, minorSharp, minorTypesNameMapping} from "../data/scale-notes";
import MuiAlert from '@material-ui/lab/Alert';
import {useGlobalStyles} from "../App";
import {TestPianoComponent} from "./screen/test-piano-component";
import {ScaleSelector} from "./screen/scale-selector";


export interface TestScreenProps {

}

export type TestType = 'playNotes|nameScale|listenAndName';

export const TestScreen = (props: TestScreenProps) => {
    const [testType, setTestType] = useState('playNotes');
    const [scalesToCheck, setScalesToCheck] = useState(allScales);
    const [guessedScale, setGuessedScale] = useState()
    const [advancedMinorTypes, setAdvancedMinorTypes] = useState();
    const [showScaleType, setShowScaleType] = useState(false);
    const [randomScale, setRandomScale] = useState();
    const [randomMinor, setRandomMinor] = useState();
    const [isAnswerDisplayed, setIsAnswerDisplayed] = useState();
    const [isRoundRunning, setIsRoundRunning] = useState(false);

    const classes = useGlobalStyles();
    const runTestRound = () => {
        const scaleToGuess = getRandomScale(testType, scalesToCheck);
        const minorToGuess = getMinorType(advancedMinorTypes)
        setIsAnswerDisplayed(false);
        setRandomScale(scaleToGuess)
        setRandomMinor(minorToGuess)
        setGuessedScale(undefined)
        setIsRoundRunning(true);

    }

    const scaleMinorObject = randomScale &&
        (<div>
            <Typography className={classes.taskTitle} color="textPrimary" gutterBottom>
                {'Тональность: ' + randomScale} {randomScale.includes('m') ? `, ${minorTypesNameMapping.get(randomMinor)}` : ''}
            </Typography>

            {showScaleType && <Typography className={classes.taskSubtitle} color="textPrimary" gutterBottom>
                {`${getScaleTypeMajorMinor(randomScale)}, ${getScaleTypeSign(randomScale)}`}
            </Typography>}
        </div>)
    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" onClose={runTestRound}
                         style={{margin: "10px", padding: "10px"}} {...props} />;
    }

    return (
        <div className={classes.testContentArea}>
            <div>
                <div>
                    {
                        (guessedScale && randomScale) && ((randomScale === guessedScale) ?
                            <Alert severity="success">Ты абсолютно и безоговорочно прав! Даже Шопен с тобой бы
                                согласился :)</Alert> :
                            <Alert severity="error">Увы! Этих тональностей понапридумывано столько, что немудрено и
                                ошибиться</Alert>)
                    }

                    <TestPianoComponent testType={testType}
                                        scale={randomScale}
                                        minorType={randomMinor}
                                        isAnswerDisplayed={isAnswerDisplayed}></TestPianoComponent>
                    {
                        testType !== 'playNotes' ?
                            <QuintTreeButtons onScaleSelect={(scale) => setGuessedScale(scale)}></QuintTreeButtons> :
                            <ScaleSelector selectedScales = {scalesToCheck} setSelectedScales={setScalesToCheck}></ScaleSelector>
                    }

                </div>
                }
            </div>
            <Card className={classes.thinCard}>
                <CardContent>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Тип теста
                    </Typography>
                    <RadioGroup value={testType} onChange={(event, value) => {
                        setTestType(value);
                        runTestRound();
                    }}>
                        <FormControlLabel value="playNotes" control={<Radio/>} label="Проиграй ноты"/>
                        <FormControlLabel value="nameScale" control={<Radio/>} label="Назови тональность"/>
                        <FormControlLabel value="listenAndName" control={<Radio/>}
                                          label="Назови тональность на слух"/>
                    </RadioGroup>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={advancedMinorTypes}
                                               onChange={(event, checked) => setAdvancedMinorTypes(checked)}/>}
                            label="Использовать гармонический и мелодический миноры"
                        />
                        {testType === "playNotes" && <FormControlLabel
                            control={<Checkbox checked={showScaleType}
                                               onChange={(event, checked) => setShowScaleType(checked)}/>}
                            label="Указывать тип тональности в задании"
                        />}
                    </FormGroup>

                    <Card className={classes.taskCard}>
                        <CardContent>
                            <Typography>
                                Задание:
                            </Typography>
                            <Button className={classes.paddedButton}
                                    onClick={runTestRound}
                                    variant="contained"
                                    color="primary">{isAnswerDisplayed ? 'Повторить' : 'Поехали'}</Button>
                            <Button className={classes.paddedButton}
                                    onClick={() => setIsAnswerDisplayed(!isAnswerDisplayed)}
                                    variant="contained"
                                    color="secondary">{isAnswerDisplayed ? 'Скрыть' : 'Показать'} ответ</Button>

                            {((testType == 'playNotes' && randomScale)
                                || (testType !== 'playNotes' && isAnswerDisplayed))
                            && scaleMinorObject}
                        </CardContent>
                    </Card>

                </CardContent>
            </Card>

        </div>
    )
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}


const getRandomScale = (exerciseType: string, scalesToCheck: string[]) => {
    const scales = [...allScales];
    // console.log(scales)
    const randomIndex = getRandomInt(scales);
    const randomScale = scales[randomIndex]
    console.log(randomIndex)
    console.log(randomScale)
    return randomScale
}

const getMinorType = (useAdvanced: boolean) => {
    const randomIndex = getRandomInt(3);
    return useAdvanced ? ['natural', 'harmonic', 'melodic'][randomIndex] : 'natural';
}

const getScaleTypeMajorMinor = (scaleAbbr) => {
    const isMajor = majorFlat.includes(scaleAbbr) || majorSharp.includes(scaleAbbr) || scaleAbbr === 'C'
    return isMajor ? 'Мажорная' : 'Минорная'
}

const getScaleTypeSign = (scaleAbbr) => {
    if (scaleAbbr === 'C' || scaleAbbr === 'Am') {
        return ''
    }
    const isSharp = minorSharp.includes(scaleAbbr) || majorSharp.includes(scaleAbbr)
    return isSharp ? 'Диезная' : 'Бемольная'
}
