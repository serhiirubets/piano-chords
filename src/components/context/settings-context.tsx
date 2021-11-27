import React, {useState} from "react";
import {SettingContextData} from "../../model/context-data-models/settings-context-data";
import {HandType} from "../../model/skeleton-entities-data/skeleton-data";
import {OctaveNotation, Octaves} from "../../model/skeleton-entities-data/octave-data";

const defaultSettings: SettingContextData = {
    playbackTempo: 0.25,
    bmpValue: 100,
    barSize: 8,
    fontSize: 23,
    displayApplicature: false,
    displayLyrics:false,
    alterGainForFeather: true,
    octaveNotation:Octaves.SCIENTIFIC,
    isMenuOpen:false,

    defaultOctaves: new Map<HandType, number>([[HandType.RIGHT, 4], [HandType.LEFT, 3]]),
    editorElementRef: React.createRef<HTMLDivElement | null>(),
    isExportingInProgress: false,
    fileName: "Новая блок-схема",
    isMasteringMode:false
}


export const SettingsContext = React.createContext({
    settings: defaultSettings,
    updateSettings: (value, cb?) => {
    },
    partialUpdateSettings: (partialSettings: Partial<SettingContextData>) => {
    }
});

export const SettingsContextProvider = (props: any) => {
    const [settings, setSettings] = useState<SettingContextData>(defaultSettings);
    const partialUpdateSettings = (value: Partial<SettingContextData>) => {
        setSettings({...settings, ...value})
    }

    return (
        <SettingsContext.Provider
            value={{settings: settings, updateSettings: setSettings, partialUpdateSettings: partialUpdateSettings}}>
            {props.children}
        </SettingsContext.Provider>
    )
}
