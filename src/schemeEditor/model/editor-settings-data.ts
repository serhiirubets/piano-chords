import {HandType} from "./deprecated/skeleton-data";

export interface EditorSettings {
    playbackTempo: number;
    quadratSize: number;
    displayApplicature? : boolean;
    alterGainForFeather:boolean;

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
