import {HandType} from "./deprecated/skeleton-data";
import {OctaveNotation} from "./deprecated/octave";

export interface EditorSettings {
    playbackTempo: number;
    quadratSize: number;
    displayApplicature? : boolean;
    alterGainForFeather:boolean;
    octaveNotation:OctaveNotation;

    autosave:boolean;
    simpleMode:boolean;
    simpleModeLeftHandNote:string;
    simpleModeRightHandNote:string;

    defaultOctaves: Map<HandType, number>;

    editorElementRef:any;
    isExportingInProgress:boolean;
    fileName:string;

}

interface Dictionary<V> {
    [Key: string]: V;
}
