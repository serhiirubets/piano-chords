import React, {useState} from "react";
import {EditorSettings} from "../model/editor-settings-data";

const defaultSettings :EditorSettings= {
    playbackTempo: 0.25,
    quadratSize: 8,
    displayApplicature:false,
    alterGainForFeather: true,
    simpleMode:true,
    simpleModeLeftHandNote:"c3",
    simpleModeRightHandNote:"c4"
}

// export const SettingsContext = React.createContext({editorSettings: {playbackTempo:0.25, quadratSize:8},setEditorSettings:()=>{}});
export const SettingsContext = React.createContext({
    settings: defaultSettings,
    updateSettings: (value) => {
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
