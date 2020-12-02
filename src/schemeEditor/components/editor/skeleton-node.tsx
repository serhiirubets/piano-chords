import {useGlobalStyles} from "../../../App";
import React, {useEffect, useState} from "react";
import {TextField} from "@material-ui/core";
import {IBlockSchemeNodeData, SkeletonNodeData} from "../../model/skeleton-node-data";
import {NoteHand} from "../../model/skeleton-data";
import {SubtitleNote} from "./subtitle-note";
import {Note, PlaybackDuration, PlaybackOffset} from "../../model/note-data";
import {DOT_WIDTH, QUADRAT_WIDTH} from "../../model/global-constants";

export interface BlockSchemeNodeProps {
    data: IBlockSchemeNodeData;
    setData: any;
    isEditable?: boolean;
    handType: NoteHand
}

export const SkeletonNode = ({data, setData, handType}: BlockSchemeNodeProps) => {
    const NOTE_SUBTITLES_PLACEHOLDER_HEIGHT = 80;
    const NOTE_SEPARATOR_TEXT = ' ';
    const classes = useGlobalStyles();
    const [isEditState, setIsEditState] = useState<boolean>(false)
    const [notes, setNotes] = useState<Array<Note>>(new Array<Note>())
    const [contains16th, setContains16th] = useState<boolean>(false)

    useEffect(() => {
        setNotes(data.notes || new Array())
    }, [data])

    const internalInputRef = React.createRef<HTMLInputElement>();
    const focusInternalInputRef = () => {
        if (internalInputRef.current) {
            internalInputRef.current.focus();
            internalInputRef.current.select();
        }
    }

    const handleNoteInput = (event) => {
        const onlyNums = event.target.value.replace(/[^a-gA-G#\s\/0-9]/g, '');
        parseInputToTheNotes(onlyNums)
    }


    const parseInputToTheNotes = (input: string) => {
        if (input.length === 0) {
            return
        }
        //Will return array of 2 if there're 16th notes, or array of 1 if 8th.
        const partialNoteChars = input.split('/');
        console.log(partialNoteChars)
        const notesObjects = partialNoteChars.flatMap((maybeSixtheenthNotes, sixteenthIndex) => {
            const noteChars = maybeSixtheenthNotes.trim().split(NOTE_SEPARATOR_TEXT);

            const noteObjectArray = noteChars.map(char => {
                const octaveMathches = char.match(/[0-9]{1}/g);
                const defaultOctave = handType == NoteHand.LEFT ? 3 : 4;

                const octave = octaveMathches && octaveMathches.length > 0 ? Number(octaveMathches[0]) : defaultOctave;
                const noteText = char.replace(/\d/g, '');
                return new Note({
                    note: noteText,
                    octave: octave,
                    duration: partialNoteChars.length === 1 ? PlaybackDuration.FULL : PlaybackDuration.HALF,
                    playbackOffset: sixteenthIndex === 0 ? PlaybackOffset.NONE : PlaybackOffset.HALF
                })
            });
            return noteObjectArray.filter(brokenNote => brokenNote.note !== "");
        })
        console.log('noteObjects', notesObjects);
        setContains16th(partialNoteChars.length > 1)
        setNotes(notesObjects)
    }

    const writeNodeState = () => {
        const updatedData = new SkeletonNodeData({
            isPresent: notes.length > 0,
            color: data.color,
            notes: [...notes].flat() || []
        });
        setData(updatedData);
    }

    const getSubtitlesElement = () => {
        const notesArray = notes ? [...notes] : [];

        const updateNoteStateBasedOnSubtitle = (updatedObject: Note, index: number) => {
            const updatedNotesArray = [...notes];
            updatedNotesArray[index][0] = updatedObject;
            updatedNotesArray.sort(Note.compareByMidiNumbers);
            setNotes(updatedNotesArray);

            const updatedData = new SkeletonNodeData({
                isPresent: updatedNotesArray.length > 0,
                color: data.color,
                notes: [...updatedNotesArray].flat() || []
            });
            setData(updatedData);
        }
        return notesArray.map((noteObject, index) => {
            // return (<span>{noteObject.map(noteObject => noteObject.note).join(' / ')}</span>)
            return <SubtitleNote externalNoteObject={noteObject} setExternalNoteObject={(data) => {
                updateNoteStateBasedOnSubtitle(data, index)
            }} index={index} handType={handType}></SubtitleNote>
        })
    }

    const prepareDotArray = () => {
        const result:JSX.Element[] = []
        const isFirst16thPresent = notes.filter(noteObj =>
            noteObj.duration === PlaybackDuration.HALF
            && noteObj.playbackOffset === PlaybackOffset.NONE).length > 0;

        const isSecond16thPresent = notes.filter(noteObj =>
            noteObj.duration === PlaybackDuration.HALF
            && noteObj.playbackOffset === PlaybackOffset.HALF).length > 0;

        if(isFirst16thPresent){
            result.push((<span style={
                {
                    height: DOT_WIDTH / 2,
                    width: DOT_WIDTH / 2,
                    backgroundColor: data.color,
                    borderRadius: "50%",
                    opacity: data.isPresent && !isEditState ? 100 : 0,
                    position: "absolute",
                    top: 5,
                    left: 5,
                    zIndex: 1,
                }
            } onClick={() => setIsEditState(true)}></span>))
        }
        if(isSecond16thPresent){
            result.push((<span style={
                {
                    height: DOT_WIDTH / 2,
                    width: 15,
                    backgroundColor: data.color,
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
    return (
        <div>
            <div style={{justifyContent: "flex-end"}}>
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
                     onClick={() => setIsEditState(true)}
                     onFocus={() => {
                         setIsEditState(true);
                         focusInternalInputRef();
                     }}
                     onBlur={() => setIsEditState(false)}
                >
                    <TextField
                        defaultValue={data.notes.map(noteObject => noteObject.note).join(' ')}
                        style={{
                            maxWidth: QUADRAT_WIDTH,
                            height: '100%',
                            opacity: isEditState ? 100 : 0,
                            position: "absolute",
                            zIndex: 2,
                            padding: 5
                        }}
                        onChange={(e) => {
                            handleNoteInput(e)
                            console.log(notes)
                        }}
                        onBlur={writeNodeState}
                        inputRef={internalInputRef}
                    />{
                    //TODO: fix duplication
                    contains16th ? prepareDotArray() :
                        (<span style={
                            {
                                height: DOT_WIDTH,
                                width: DOT_WIDTH,
                                backgroundColor: data.color,
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
        </div>
    )
}
