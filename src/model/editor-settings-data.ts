import {HandType} from "./deprecated/skeleton-data";
import {OctaveNotation} from "./deprecated/octave";

export interface EditorSettings {
    playbackTempo: number;
    quadratSize: number;
    displayApplicature? : boolean;
    alterGainForFeather:boolean;
    octaveNotation:OctaveNotation;

    autosave:boolean;
    isMenuOpen: boolean;

    defaultOctaves: Map<HandType, number>;

    editorElementRef:any;
    isExportingInProgress:boolean;
    fileName:string;

    isMasteringMode:boolean;

}

interface Dictionary<V> {
    [Key: string]: V;
}
