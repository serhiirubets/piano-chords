import React, {useState} from "react";
import {EditorSettings} from "../model/editor-settings-data";
import {HandType} from "../model/deprecated/skeleton-data";

const defaultSettings :EditorSettings= {
    playbackTempo: 0.25,
    quadratSize: 8,
    displayApplicature:false,
    alterGainForFeather: true,
    autosave:true,
    simpleMode:true,
    simpleModeLeftHandNote:"c3",
    simpleModeRightHandNote:"c4",
    defaultOctaves: new Map<HandType, number>([[HandType.RIGHT,4],[HandType.LEFT,3]]),
    editorElementRef:React.createRef<HTMLDivElement|null>(),
    isExportingInProgress:false,
    fileName:"Новая блок-схема"
}

export const SettingsContext = React.createContext({
    settings: defaultSettings,
    updateSettings: (value, cb?) => {
    }
});

export const SettingsContextProvider = (props: any) => {
    const [settings, setSettings] = useState<EditorSettings>(defaultSettings);

    return (
        <SettingsContext.Provider value={{settings: settings, updateSettings: setSettings}}>
            {props.children}
        </SettingsContext.Provider>
    )
}
