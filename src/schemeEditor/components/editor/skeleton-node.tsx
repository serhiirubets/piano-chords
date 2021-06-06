/** @jsx jsx */
import React, {useContext, useState} from "react";
import {jsx} from "@emotion/react/macro";
import {QUADRAT_WIDTH} from "../../model/global-constants";
import {SkeletonNodeData} from "../../model/deprecated/skeleton-node-data";
import {TextField} from "@material-ui/core";
import {HandType} from "../../model/deprecated/skeleton-data";
import {Note, PlaybackDuration, PlaybackOffset} from "../../model/note-data";
import {SettingsContext} from "../../context/settings-context";
import {getEffectiveNodeColor} from "../../utils/skeleton-node-utils";

const DISALLOWED_KEYS_PATTERN = /[^a-gmA-G#:\s\/0-9\*]/g
const SIXTEENS_SEPARATOR = '/'
const CHORD_SEPARATOR = ' '

export interface BlockSchemeNodeProps {
    data: SkeletonNodeData;
    setData: any;
    handType: HandType;
    onSelect?: any;
    onDeselect?: any;
    isSelected?: boolean;
    nodeIndex: number;
    skeletonIndex: number;
}

const parseInputToTheNotes = (stringValue: string, defaultOctave: number) :Note[]=> {
    if(stringValue.length == 0){
        return []
    }
    if(stringValue.includes(SIXTEENS_SEPARATOR)){
        const getOffset = index => index % 2 == 0 ? PlaybackOffset.NONE : PlaybackOffset.HALF;
        const sixteensParts = stringValue.split(SIXTEENS_SEPARATOR);
        return sixteensParts
            .flatMap((sixteens,index) => parseNoteOrChord(sixteens,defaultOctave,PlaybackDuration.HALF, getOffset(index)));
    }

    return parseNoteOrChord(stringValue, defaultOctave, PlaybackDuration.FULL, PlaybackOffset.NONE);
}

const parseNoteOrChord = (stringValue: string, defaultOctave: number, duration:PlaybackDuration, offset:PlaybackOffset ): Note[]=> {
    return stringValue.split(CHORD_SEPARATOR)
        .map(s => parseNote(s, defaultOctave))
        .filter(note => note.note !== '')
        .map(note => {
            note.duration = duration;
            note.playbackOffset = offset;
            return note;
        });
}

const parseNote = (stringValue: string, defaultOctave: number) : Note => {

    const octaveMatches = stringValue.match(/[0-9]{1}/g);

    const octave = octaveMatches && octaveMatches.length > 0 ? Number(octaveMatches[0]) : defaultOctave;
    const noteText = stringValue.replace(/\d/g, '');
    return new Note({note:noteText, octave})
}

const getBackgroundValue = (noteData:SkeletonNodeData, isEditMode: boolean) =>{
    //No note at all
    if(!noteData.isPresent || isEditMode){
        return "none";
    }

    //Sixteens note
    if(noteData.notes.filter(note => note.duration === PlaybackDuration.HALF).length > 0){
        const getGradientDirection =  (noteData:Note) =>  noteData.playbackOffset === PlaybackOffset.NONE ? 'to top left' : 'to bottom right';

        const sixteensSeparator = `
           linear-gradient(to top left,
           rgba(0,0,0,0) 0%,
           rgba(0,0,0,0) calc(50% - 1px),
           rgba(0,0,0,1) 50%,
           rgba(0,0,0,0) calc(50% + 1px),
           rgba(0,0,0,0) 100%)
            `
         return [sixteensSeparator, ...noteData.notes.map(note => {
             return `
             linear-gradient(${getGradientDirection(note)},
             rgba(0,0,0,0) 0%,
             rgba(0,0,0,0) 50%,
             ${getEffectiveNodeColor(noteData)} 50%,
             ${getEffectiveNodeColor(noteData)} 100%)
             `
         })].join(',');
    }

    //Regular note
    return getEffectiveNodeColor(noteData);
}


export const SkeletonNode = ({ data, setData, nodeIndex, handType, skeletonIndex}: BlockSchemeNodeProps) => {
    const {settings} = useContext(SettingsContext);
    const [isEditMode, setEditMode] = useState(false);
    const [inputText, setInputText] = useState<string>('');

    const handeSelection = () => setEditMode(true);
    const handeDeselection = () => {
        setEditMode(false);
    }

    const handleNoteInput = (event) => {
        console.log(event.target.value)
        const filteredValues = event.target.value.replace(DISALLOWED_KEYS_PATTERN, '');
        event.target.value = filteredValues;
        setInputText(filteredValues.trim());
    }

    const handleSave = () => {
        const updatedNote = parseInputToTheNotes(inputText, settings.defaultOctaves.get(handType)!);
        setData(updatedNote)
    }


    return (
        <div css={{justifyContent: "flex-end", display: "flex"}}>
            <div css={{
                width: QUADRAT_WIDTH,
                height: QUADRAT_WIDTH,
                flex: 1,
                display: 'flex',
                borderStyle: 'solid',
                borderColor: 'black',
                borderWidth: '1px',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                paddingLeft: '3px',
                paddingRight: '3px',
                background: getBackgroundValue(data, isEditMode)
            }}
                onClick={handeSelection}
                // onContextMenu={handleRightClick}
                // onFocus={handleFocuss}
                 onBlur={handeDeselection}
            >
                {/*<div*/}
                {/*    id="selection-highlight"*/}
                {/*    style={{*/}
                {/*        position: "absolute",*/}
                {/*        width: QUADRAT_WIDTH,*/}
                {/*        height: QUADRAT_WIDTH,*/}
                {/*        top: 0,*/}
                {/*        left: 0,*/}
                {/*        zIndex: 2,*/}
                {/*        // background: isSelected ? "#bfe4f0" : "transparent"*/}
                {/*    }}/>*/}
                {/*<div*/}
                {/*    id="triplet-background"*/}
                {/*    style={{*/}
                {/*        position: "absolute",*/}
                {/*        width: (QUADRAT_WIDTH + 2),*/}
                {/*        height: QUADRAT_WIDTH,*/}
                {/*        top: 0,*/}
                {/*        left: 0,*/}
                {/*    }}/>*/}
                <TextField
                    css={{
                        width: QUADRAT_WIDTH - 4,
                        height: '100%',
                        opacity: isEditMode ? 100 : 0,
                        position: "absolute",
                        zIndex: 2
                    }}
                    // inputProps={{
                    //     css: css`
                    //     border-color: red
                    //     `
                    // }}
                    // css={
                    //     css`
                    //     width: ${QUADRAT_WIDTH - 4},
                    //     height: '100%';
                    //     position: 'absolute';
                    //     outline: none;
                    //     border: none;
                    //     :focus {
                    //       opacity: 0;
                    //     }
                    //     `
                    // }
                    tabIndex={0}
                    onChange={handleNoteInput}
                    onKeyDown={handleNoteInput}
                    onBlur={() => {
                        handleSave()
                    }}
                    // inputRef={internalInputRef}
                />

            </div>
            {/*{handType === NoteHand.LEFT &&*/}
            {/*<div style={{*/}
            {/*    minHeight: NOTE_SUBTITLES_PLACEHOLDER_HEIGHT,*/}
            {/*    justifyContent: "flex-start",*/}
            {/*    position: "relative"*/}
            {/*}}>*/}
            {/*    {!isEditState && getSubtitlesElement()}*/}
            {/*</div>}*/}
        </div>
    )
}
