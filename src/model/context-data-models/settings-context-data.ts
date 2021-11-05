import {HandType} from "../skeleton-entities-data/skeleton-data";
import {OctaveNotation} from "../skeleton-entities-data/octave-data";

export interface SettingContextData {
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
