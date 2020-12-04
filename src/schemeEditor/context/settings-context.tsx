import React, {useState} from "react";
import {EditorSettings} from "../model/settings-data";

// export const SettingsContext = React.createContext({editorSettings: {playbackTempo:0.25, quadratSize:8},setEditorSettings:()=>{}});
export const SettingsContext = React.createContext({
    settings: {
        playbackTempo: 0.25,
        quadratSize: 8
    },
    updateSettings: (value) => {
    }
});

export const SettingsContextProvider = (props: any) => {
    const [settings, setSettings] = useState<EditorSettings>({
        playbackTempo: 0.25,
        quadratSize: 8
    });

    const setOneSetting = (nevValue) => {
        setSettings((prev) => ({ ...prev, nevValue}))
    }
    setOneSetting( {playbackTempo: 2.2})


    return (
        <SettingsContext.Provider value={{settings: settings, updateSettings: setSettings}}>
            {...props}
        </SettingsContext.Provider>
    )
}
