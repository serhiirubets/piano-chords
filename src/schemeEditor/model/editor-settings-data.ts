import {HandType} from "./deprecated/skeleton-data";

export interface EditorSettings {
    playbackTempo: number;
    quadratSize: number;
    displayApplicature? : boolean;
    alterGainForFeather:boolean;

    simpleMode:boolean;
    simpleModeLeftHandNote:string,
    simpleModeRightHandNote:string,

    defaultOctaves: Map<HandType, number>

}

interface Dictionary<V> {
    [Key: string]: V;
}
