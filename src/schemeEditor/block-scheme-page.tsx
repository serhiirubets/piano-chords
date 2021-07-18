import React, {useContext} from "react"
import {Card, CardContent} from "@material-ui/core";
import {useGlobalStyles} from "../App";
// @ts-ignore
import {BlockSchemeGrid} from "./components/editor/block-scheme-grid";
import {EditorSettingsPanel} from "./components/menu/editor-settings-panel";
import {SettingsContextProvider} from "./context/settings-context";
import {BarContext, BarContextProvider} from "./context/bar-context";
import {EditorHeader} from "./components/menu/editor-header";
import {ScrollableTabs} from "./components/tabpanel/tab-panel";
import {ScrollableTabsButtonAuto} from "./components/tabpanel/scrollable-tabs";


export const BlockSchemeWhitePage = () => {
    return (
        <div style={{flexDirection: "column", display: "flex", height:"100vh"}}>
            <div style={{alignSelf:"flex-start", marginTop:85, position:"sticky", top:0, left:0}}>
                <ScrollableTabs></ScrollableTabs>

            </div>
            <div style={{overflow:"scroll", height:"100%", width:"100%"}}>
                <hr/>
                <BlockSchemeGrid></BlockSchemeGrid>
            </div>
        </div>
    )
}
