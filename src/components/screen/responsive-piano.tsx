import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import {Piano, KeyboardShortcuts, MidiNumbers} from 'react-piano';
import 'react-piano/dist/styles.css';

import DimensionsProvider from '../piano-core/DimensionsProvider';
import SoundfontProvider from '../piano-core/SoundfontProvider';
import {Button, Card, CardContent, Icon, TextField, Typography} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ClearIcon from '@material-ui/icons/Clear';
import {MinorType} from "../../model/SelectedScale";
import {applyMinorTypeModification, generateMajorScale, generateMinorScale} from "../../data/scale-generator";
import {noteMidiKeyOverrides} from "../../data/scale-notes";
import {useGlobalStyles} from "../../App";

// webkitAudioContext fallback needed to support Safari
// @ts-ignore
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
    first: MidiNumbers.fromNote('c2'),
    last: MidiNumbers.fromNote('d4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: noteRange.first,
    lastNote: noteRange.last,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

export interface ResponsivePianoProps {
    selectedScale?: string;
    minorType?: MinorType;
    showNotesOnStart: boolean;
    isTestMode: boolean;
}

export const ResponsivePiano = (props: ResponsivePianoProps) => {
    const [activeNotes, setActiveNotes] = useState();
    const [notesToPlay, setNotesToPlay] = useState();
    const [noteDuration, setNoteDuration] = useState(0.25);
    const classes = useGlobalStyles();

    useEffect(() => {
        const selectedScaleNotes = getPlayedNotes(props.selectedScale, props.minorType);
        setNotesToPlay(selectedScaleNotes)
        if (props.showNotesOnStart) {
            setActiveNotes(selectedScaleNotes)
        }
    }, [props.selectedScale, props.minorType])


    const playScale = () => {
        let i = 1;
        console.log(notesToPlay)
        setActiveNotes([])
        notesToPlay.forEach(midiNumber => {
            console.log('schedulingh', midiNumber)
            setTimeout(() => {
                setActiveNotes([midiNumber])
            }, i * noteDuration * 1000)
            i++
        })
        if (props.showNotesOnStart) {
            setTimeout(() => {
                setActiveNotes(notesToPlay)
            }, noteDuration * 10000)
        }
    }

    const getPlayedNotes = (scaleAbbr: string | undefined, minorType: MinorType | undefined) => {
        if (!scaleAbbr) {
            return []
        }
        const isMinorScale = scaleAbbr.includes('m');
        const notes = ['D', 'E', 'F', 'G', 'A', 'B', 'C'];
        const actualScaleStartNote =
            noteMidiKeyOverrides.has(scaleAbbr) ? noteMidiKeyOverrides.get(scaleAbbr)! :
                isMinorScale ? scaleAbbr.slice(0, scaleAbbr.length - 1) : scaleAbbr;
        const scaleIndex = notes.indexOf(actualScaleStartNote[0]) < 6 ? '2' : '3';
        const scaleStart = MidiNumbers.fromNote(actualScaleStartNote + scaleIndex)
        const defaultNotes = isMinorScale ? generateMinorScale(scaleStart) : generateMajorScale(scaleStart);
        return applyMinorTypeModification(scaleAbbr, defaultNotes, minorType);
        ;
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    {!props.isTestMode && <Typography className={classes.title} color="textPrimary" gutterBottom>
                        Тональность: {props.selectedScale}
                    </Typography>}
                    <SoundfontProvider
                        instrumentName="bright_acoustic_piano"
                        audioContext={audioContext}
                        hostname={soundfontHostname}
                        render={({isLoading, playNote, stopNote}) => (
                            <div className={classes.cardRow}>

                                <Piano
                                    activeNotes={activeNotes}
                                    noteRange={noteRange}
                                    width={800}
                                    playNote={(midi) => activeNotes && activeNotes.length > 1 ? (midiNumber) => {
                                    } : playNote(midi)}
                                    stopNote={stopNote}
                                    disabled={isLoading}
                                    {...props}
                                />

                                <div className={classes.cardColumn}>
                                    <TextField className={classes.textInputPadding} id="standard-basic" label="Длительность ноты [0;1]"
                                               defaultValue={noteDuration}
                                               onChange={(event => setNoteDuration(Number(event.target.value)))}/>
                                    <Button
                                        className={classes.paddedButton}
                                        variant="contained"
                                        startIcon={<PlayArrowIcon/>}
                                        onClick={playScale}>Play</Button>
                                    <Button
                                        className={classes.paddedButton}
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<ClearIcon/>}
                                        onClick={() => setActiveNotes([])}
                                    >Clear</Button>
                                </div>
                            </div>
                        )}
                    />
                </CardContent>
            </Card>

        </div>

    );
}
