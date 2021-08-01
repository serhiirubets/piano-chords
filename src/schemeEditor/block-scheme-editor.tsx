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
import {BlockSchemeWhitePage} from "./block-scheme-page";


export const BlockSchemeEditor = () => {
    const classes = useGlobalStyles();
    const {bars, updateBars} = useContext(BarContext);

    return (
        <div style={{flexDirection: "row", display: "flex"}}>
            <SettingsContextProvider>
                <BarContextProvider>
                    <Card className={classes.thickCard}>
                        <EditorHeader/>

                        <CardContent style={{
                            width: "inherit",
                            alignItems: "flex-start",

                        }}>
                            <BlockSchemeWhitePage></BlockSchemeWhitePage>
                        </CardContent>
                    </Card>
                    { true &&<EditorSettingsPanel/>}
                </BarContextProvider>
            </SettingsContextProvider>
        </div>
    )
}
