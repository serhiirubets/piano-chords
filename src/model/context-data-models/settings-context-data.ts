import {HandType} from "../skeleton-entities-data/skeleton-data";
import {OctaveNotation} from "../skeleton-entities-data/octave-data";

export interface SettingContextData {
    playbackTempo: number;
    barSize: number;
    fontSize: number;
    displayApplicature? : boolean;
    displayLyrics:boolean,
    alterGainForFeather:boolean;
    octaveNotation:OctaveNotation;

    isMenuOpen: boolean;

    defaultOctaves: Map<HandType, number>;

    editorElementRef:any;
    isExportingInProgress:boolean;
    fileName:string;

    isMasteringMode:boolean;

}
