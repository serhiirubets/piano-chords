import {useGlobalStyles} from "../../../App";
import React, {useEffect, useState} from "react";
import {TextField} from "@material-ui/core";
import {SkeletonNodeData, IBlockSchemeNodeData} from "../../model/skeleton-node-data";
import {NoteHand} from "../../model/skeleton-data";
import {SubtitleNote} from "./subtitle-note";
import {INote, Note} from "../../model/note-data";
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
    const [subtitleNotes, setSubtitleNotes] = useState<Array<Note>>(new Array<Note>())

    useEffect(() => {
        setNotes(data.notes || new Array())
        setSubtitleNotes(notes.reverse())
    }, [data])

    const internalInputRef = React.createRef<HTMLInputElement>();
    const focusInternalInputRef = () => {
        if (internalInputRef.current) {
            internalInputRef.current.focus();
            internalInputRef.current.select();
        }
    }

    const handleNoteInput = (event) => {
        const onlyNums = event.target.value.replace(/[^a-gA-G#\s]/g, '');
        parseInputToTheNotes(onlyNums)
    }


    const parseInputToTheNotes = (input: string) => {
        if (input.length > 0) {
            const noteChars = input.trim().split(NOTE_SEPARATOR_TEXT);
            const noteObjectArray = noteChars.map(char => {
                return new Note({
                    note: char,
                    octave: handType == NoteHand.LEFT ? 3 : 4
                })
            });
            setNotes(noteObjectArray)
        }
    }

    const writeNodeState = () => {
        const updatedData = new SkeletonNodeData({
            isPresent: notes.length > 0,
            color: data.color,
            notes: [...notes] || []
        });
        setData(updatedData);
    }

    const getSubtitlesElement = () => {
        const notesArray = notes ? [...notes] : [];

        const updateNoteStateBasedOnSubtitle = (updatedObject: Note, index: number) => {
            const updatedNotesArray = [...notes];
            updatedNotesArray[index] = updatedObject;
            updatedNotesArray.sort(Note.compareByMidiNumbers);
            setNotes(updatedNotesArray);

            const updatedData = new SkeletonNodeData({
                isPresent: updatedNotesArray.length > 0,
                color: data.color,
                notes: [...updatedNotesArray] || []
            });
            setData(updatedData);
        }

        return notesArray.map((noteObject, index) => {
            return <SubtitleNote externalNoteObject={noteObject} setExternalNoteObject={(data) => {
                updateNoteStateBasedOnSubtitle(data, index)
            }} index={index} handType={handType}></SubtitleNote>

        })
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
                        onChange={handleNoteInput}
                        // InputProps={{disableUnderline: true}}
                        onBlur={writeNodeState}
                        inputRef={internalInputRef}
                    />
                    <span style={
                        {
                            height: DOT_WIDTH,
                            width: DOT_WIDTH,
                            backgroundColor: data.color,
                            borderRadius: "50%",
                            opacity: data.isPresent && !isEditState ? 100 : 0,
                            position: "absolute",
                            zIndex: 1,
                        }
                    } onClick={() => setIsEditState(true)}></span>
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
