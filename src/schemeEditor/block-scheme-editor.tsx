import React, {useContext} from "react"
import {Card, CardContent} from "@material-ui/core";
import {useGlobalStyles} from "../App";
// @ts-ignore
import {BlockSchemeGrid} from "./components/editor/block-scheme-grid";
import {EditorSettingsPanel} from "./components/menu/editor-settings-panel";
import {SettingsContextProvider} from "./context/settings-context";
import {QuadratsContext, QuadratsContextProvider} from "./context/quadrats-context";
import {EditorHeader} from "./components/menu/editor-header";


export const BlockSchemeEditor = () => {
    const classes = useGlobalStyles();
    const {quads, updateQuads} = useContext(QuadratsContext);

    return (
        <div style={{flexDirection: "row", display: "flex"}}>
            <SettingsContextProvider>
                <QuadratsContextProvider>
                    <Card className={classes.thickCard}>
                            <EditorHeader/>
                        <CardContent style={{width: "100%", alignItems: "flex-start", overflowY:"scroll", scrollPadding:"250"}}>

                            {/*<ScrollableTabs/>*/}
                            <BlockSchemeGrid></BlockSchemeGrid>
                        </CardContent>
                    </Card>
                    <EditorSettingsPanel/>
                </QuadratsContextProvider>
            </SettingsContextProvider>
        </div>
    )
}
