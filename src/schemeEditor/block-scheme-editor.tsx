import React, {useContext} from "react"
import {Card, CardContent} from "@material-ui/core";
import {useGlobalStyles} from "../App";
// @ts-ignore
import {BlockSchemeGrid} from "./components/editor/block-scheme-grid";
import {EditorSettingsPanel} from "./components/menu/editor-settings-panel";
import {SettingsContextProvider} from "./context/settings-context";
import {BarContext, BarContextProvider} from "./context/bar-context";
import {EditorHeader} from "./components/menu/editor-header";


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
                            overflowY: "scroll",
                            scrollPadding:200

                        }}>

                            {/*<ScrollableTabs/>*/}
                            <BlockSchemeGrid></BlockSchemeGrid>
                        </CardContent>
                    </Card>f
                    <EditorSettingsPanel/>
                </BarContextProvider>
            </SettingsContextProvider>
        </div>
    )
}
