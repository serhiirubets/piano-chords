import React, {useContext, useEffect, useState} from "react";
import {TextField} from "@material-ui/core";
import {SkeletonNodeData} from "../../model/skeleton-node-data";
import {NoteHand} from "../../model/skeleton-data";
import {SubtitleNote} from "./subtitle-note";
import {Note, PlaybackDuration, PlaybackOffset} from "../../model/note-data";
import {DOT_WIDTH, QUADRAT_WIDTH} from "../../model/global-constants";
import {TripletHandlerProps} from "./skeleton";
import {v4 as uuid} from 'uuid';
import {SettingsContext} from "../../context/settings-context";

export interface BlockSchemeNodeProps {
    data: SkeletonNodeData;
    setData: any;
    handType: NoteHand;
    onSelect?: any;
    onDeselect?: any;
    isSelected: boolean;
    nodeIndex: number;
    tripletHandlingProps?: TripletHandlerProps;
}

export const SkeletonNode = ({
                                 data,
                                 setData,
                                 handType,
                                 onSelect,
                                 onDeselect,
                                 tripletHandlingProps,
                                 isSelected,
                                 nodeIndex
                             }: BlockSchemeNodeProps) => {
    const NOTE_SUBTITLES_PLACEHOLDER_HEIGHT = 80;
    const DEFAULT_NODE_SYMBOL = '*';
    const CHORD_NOTE_SEPARATOR = ' ';
    const TRIPLET_NOTE_SEPARATOR = ':';
    const SIXTEENS_NOTE_SEPARATOR = '/';

    const [tripletUntouched, setTripletUntouched] = useState<boolean>(true);
    const [isEditState, setIsEditState] = useState<boolean>(false)
    const [notes, setNotes] = useState<Array<Note>>(new Array<Note>())
    const [contains16th, setContains16th] = useState<boolean>(false)
    const {settings} = useContext(SettingsContext);


    useEffect(() => {
        setNotes(data.notes || new Array())
    }, [data])

    useEffect(() => {
        if (tripletHandlingProps?.isHostingTriplet && tripletUntouched && internalInputRef.current) {
            console.log('should be focusing div')
            internalInputRef.current.focus();
        }
    }, [tripletHandlingProps])

    const internalInputRef = React.createRef<HTMLInputElement>();
    const focusInternalInputRef = () => {
        if (internalInputRef.current) {
            internalInputRef.current.focus();
            internalInputRef.current.select();
        }
    }
    const updateInternalInputRefValue = (value: string) => {
        if (internalInputRef.current) {
            internalInputRef.current.value = value;
        }
    }

    const handleSelection = (event) => {
        if (event.shiftKey) {
            onSelect && onSelect()
        } else {
            setIsEditState(true)
            onDeselect && onDeselect();
        }
    }

    const handleFocus = (event) => {
        if (event.type !== "contextMenu") {
            setIsEditState(true);
            focusInternalInputRef();
        } else {
            handleRightClick(event)
        }

    }

    const handleRightClick = (event) => {
        event.preventDefault()
        setIsEditState(false)
        const defaultNote = '*';
        const defaultNotes = parseInputToTheNotes(defaultNote)
        if (internalInputRef.current) {
            internalInputRef.current.value = defaultNote;
        }
        console.log("DEFAULT NOTES", defaultNotes)
        writeNodeState(defaultNotes)
    }

    const handleNoteInput = (event) => {
        if (tripletHandlingProps?.isHostingTriplet) {
            setTripletUntouched(false);
        }
        const onlyNums = event.target.value.replace(/[^a-gmA-G#:\s\/0-9\*]/g, '');
        event.target.value = onlyNums;

        parseInputToTheNotes(onlyNums)
    }


    const parseInputToTheNotes = (input: string) => {
        if (input.length === 0) {
            setNotes([])
            if (tripletHandlingProps?.isHostingTriplet) {
                tripletHandlingProps.handleTripletRemoval(nodeIndex)
                setTripletUntouched(true);
            }
            return
        }
        //Will return array of 2 if there're 16th notes, or array of 1 if 8th.
        const is16thNotes = input.includes(SIXTEENS_NOTE_SEPARATOR)
        const isTripletNotes = input.includes(TRIPLET_NOTE_SEPARATOR)
        const partialNoteChars = input.split(/[\/:]/);
        const notesObjects = partialNoteChars.flatMap((maybeSixtheenthNotes, tripletOr16thIndex) => {
            const noteChars = maybeSixtheenthNotes.trim().split(CHORD_NOTE_SEPARATOR);

            const noteObjectArray = noteChars.map(char => {
                if (char === DEFAULT_NODE_SYMBOL) {
                    char = handType === NoteHand.LEFT ? settings.simpleModeLeftHandNote : settings.simpleModeRightHandNote;
                }

                const octaveMatches = char.match(/[0-9]{1}/g);
                const defaultOctave = handType == NoteHand.LEFT ? 3 : 4;

                const octave = octaveMatches && octaveMatches.length > 0 ? Number(octaveMatches[0]) : defaultOctave;
                const noteText = char.replace(/\d/g, '');

                if (is16thNotes) {
                    return new Note({
                        id: uuid(),
                        note: noteText,
                        octave: octave,
                        duration: PlaybackDuration.HALF,
                        playbackOffset: tripletOr16thIndex * PlaybackOffset.HALF
                    })
                } else if (isTripletNotes && tripletHandlingProps?.isHostingTriplet) {
                    const idealDuration = tripletHandlingProps?.tripletLength / 3 >= 1 ? PlaybackDuration.FULL : PlaybackDuration.HALF;
                    const lastNodeOffset = tripletHandlingProps?.tripletLength / 3 >= 1 ? Math.ceil(tripletOr16thIndex * tripletHandlingProps.tripletLength! / 3) : Math.floor(tripletOr16thIndex * tripletHandlingProps.tripletLength! / 3)
                    return new Note({
                        id: uuid(),
                        note: noteText,
                        octave: octave,
                        duration: idealDuration,
                        playbackOffset: tripletOr16thIndex === 0 ? 0 :
                            tripletOr16thIndex === 2 ? lastNodeOffset :
                                (tripletHandlingProps.tripletLength / 2 - idealDuration / 2)
                    })
                } else {
                    return new Note({
                        id: uuid(),
                        note: noteText,
                        octave: octave,
                        duration: PlaybackDuration.FULL,
                        playbackOffset: PlaybackOffset.NONE
                    })
                }

            });
            return noteObjectArray.filter(brokenNote => brokenNote.note !== "");
        })
        console.log('noteObjects', notesObjects);
        setContains16th(is16thNotes)
        setNotes(notesObjects)

        return notesObjects;
    }

    const writeNodeState = (updatedNotes?: Note[]) => {
        const notesToWrite = updatedNotes ? updatedNotes : notes;

        const updatedData = new SkeletonNodeData({
            id: data.id,
            isPresent: notesToWrite.length > 0,
            color: data.calculateColor(handType),
            notes: [...notesToWrite] || []
        });

        setData(updatedData);
    }

    const getSubtitlesElement = () => {
        const notesArray = notes ? [...notes] : [];

        const updateNoteStateBasedOnSubtitle = (updatedObject: Note, index: number) => {
            const updatedNotesArray = [...notes];
            updatedNotesArray[index] = updatedObject;
            updatedNotesArray.sort(Note.compareByMidiNumbers);
            updatedNotesArray.forEach(note => note.noteType = updatedObject.noteType)
            setNotes(updatedNotesArray);

            writeNodeState(updatedNotesArray)


            const inputValueSeparator = contains16th ? SIXTEENS_NOTE_SEPARATOR :
                tripletHandlingProps?.isHostingTriplet ? TRIPLET_NOTE_SEPARATOR
                    : CHORD_NOTE_SEPARATOR;
            const updatedInputValue = updatedNotesArray.map(noteObject => noteObject.note).join(inputValueSeparator)
            updateInternalInputRefValue(updatedInputValue);
        }

        const isChord = notesArray.length > 1 && notesArray.every(note => note.playbackOffset === PlaybackOffset.NONE);

        return notesArray.map((noteObject, index) => {
            return <SubtitleNote externalNoteObject={noteObject}
                                 key={data.id + noteObject.note + noteObject.octave + index}
                                 setExternalNoteObject={(data) => {
                                     updateNoteStateBasedOnSubtitle(data, index)
                                 }} index={index} handType={handType}
                                 chord={isChord ? notesArray : undefined}></SubtitleNote>
        })
    }

    const prepare16DotArray = () => {
        const result: JSX.Element[] = []
        const isFirst16thPresent = notes.filter(noteObj =>
            noteObj.duration === PlaybackDuration.HALF
            && noteObj.playbackOffset === PlaybackOffset.NONE).length > 0;

        const isSecond16thPresent = notes.filter(noteObj =>
            noteObj.duration === PlaybackDuration.HALF
            && noteObj.playbackOffset === PlaybackOffset.HALF).length > 0;

        if (isFirst16thPresent) {
            result.push((<span style={
                {
                    height: DOT_WIDTH / 2,
                    width: DOT_WIDTH / 2,
                    backgroundColor: data.calculateColor(handType),
                    borderRadius: "50%",
                    opacity: data.isPresent && !isEditState ? 100 : 0,
                    position: "absolute",
                    top: 5,
                    left: 5,
                    zIndex: 1,
                }
            } onClick={() => setIsEditState(true)}></span>))
        }
        if (isSecond16thPresent) {
            result.push((<span style={
                {
                    height: DOT_WIDTH / 2,
                    width: 15,
                    backgroundColor: data.calculateColor(handType),
                    borderRadius: "50%",
                    opacity: data.isPresent && !isEditState ? 100 : 0,
                    position: "absolute",
                    zIndex: 1,
                    top: 20,
                    left: 20
                }
            } onClick={() => setIsEditState(true)}></span>))
        }
        return result;
    }

    const prepareTripletDotArray = () => {
        if (tripletHandlingProps) {
            return notes.map((note, index) => {
                let offsetLeft = note.playbackOffset * QUADRAT_WIDTH + note.duration * (QUADRAT_WIDTH - DOT_WIDTH * note.duration) / 2 + index * 3 * note.duration;
                return (<span style={
                    {
                        height: DOT_WIDTH * note.duration,
                        width: DOT_WIDTH * note.duration,
                        backgroundColor: data.calculateColor(handType),
                        borderRadius: "50%",
                        opacity: data.isPresent && !isEditState ? 100 : 0,
                        position: "absolute",
                        zIndex: 1,
                        top: (QUADRAT_WIDTH - (DOT_WIDTH * note.duration)) / 2,
                        left: offsetLeft
                    }
                } onClick={() => setIsEditState(true)}></span>)
            })
        }
    }

    return (
        <div style={{justifyContent: "flex-end", pointerEvents: tripletHandlingProps?.isDisabled ? "none" : "auto"}}>
            {handType === NoteHand.RIGHT &&
            <div style={{
                minHeight: NOTE_SUBTITLES_PLACEHOLDER_HEIGHT,
                justifyContent: "flex-end",
                position: "relative"
            }}>
                {!isEditState && getSubtitlesElement()}
            </div>}
            <div style={{
                width: QUADRAT_WIDTH,
                height: QUADRAT_WIDTH,
                borderStyle: 'solid',
                borderColor: 'black',
                borderWidth: '1px',
                alignContent: 'center',
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                background: contains16th && !isEditState && data.isPresent ? `
                    linear-gradient(to top left,
                    rgba(0,0,0,0) 0%,
                    rgba(0,0,0,0) calc(50% - 0.8px),
                    rgba(0,0,0,1) 50%,
                    rgba(0,0,0,0) calc(50% + 0.8px),
                    rgba(0,0,0,0) 100%)` : "none"
            }} tabIndex={0}
                 onClick={handleSelection}
                 onContextMenu={handleRightClick}
                 onFocus={handleFocus}
                 onBlur={() => setIsEditState(false)}
            >
                <div
                    id="selection-highlight"
                    style={{
                        position: "absolute",
                        width: QUADRAT_WIDTH,
                        height: QUADRAT_WIDTH,
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        background: isSelected ? "#bfe4f0" : "transparent"
                    }}/>
                <div
                    id="triplet-background"
                    style={{
                        position: "absolute",
                        width: (QUADRAT_WIDTH + 2) * (tripletHandlingProps ? tripletHandlingProps.tripletLength : 0) - 1,//including borders
                        height: QUADRAT_WIDTH,
                        top: 0,
                        left: 0,
                        zIndex: isEditState ? 2 : -1,
                        background: tripletHandlingProps?.isHostingTriplet ? "yellow" : "transparent"
                    }}/>
                <TextField
                    style={{
                        width: tripletHandlingProps?.isHostingTriplet ? QUADRAT_WIDTH * tripletHandlingProps.tripletLength : "auto",
                        height: '100%',
                        left: tripletHandlingProps?.isHostingTriplet ? 0 : "auto",
                        opacity: isEditState ? 100 : 0,
                        position: "absolute",
                        zIndex: 2,
                        padding: 5
                    }}
                    onChange={(e) => {
                        handleNoteInput(e)
                        console.log(notes)
                    }}
                    onBlur={() => {
                        writeNodeState()
                    }}
                    inputRef={internalInputRef}
                />
                {
                    //TODO: fix duplication
                    contains16th ? prepare16DotArray() :
                        tripletHandlingProps?.isHostingTriplet ? prepareTripletDotArray() :
                            (<span style={
                                {
                                    height: DOT_WIDTH,
                                    width: DOT_WIDTH,
                                    backgroundColor: data.calculateColor(handType),
                                    borderRadius: "50%",
                                    opacity: data.isPresent && !isEditState ? 100 : 0,
                                    position: "absolute",
                                    zIndex: 1,
                                }
                            } onClick={() => setIsEditState(true)}></span>)
                }
            </div>
            {handType === NoteHand.LEFT &&
            <div style={{
                minHeight: NOTE_SUBTITLES_PLACEHOLDER_HEIGHT,
                justifyContent: "flex-start",
                position: "relative"
            }}>
                {!isEditState && getSubtitlesElement()}
            </div>}
        </div>
    )
}
