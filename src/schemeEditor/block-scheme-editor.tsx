import React, {useContext} from "react"
import {Card, CardContent, Typography} from "@material-ui/core";
import {useGlobalStyles} from "../App";
import {SkeletonData} from "./model/skeleton-data";
// @ts-ignore
import {BlockSchemeGrid} from "./components/editor/block-scheme-grid";
import {HelpDialog} from "./components/help-screen";
import {EditorSettingsPanel} from "./components/menu/editor-settings-panel";
import {SettingsContextProvider} from "./context/settings-context";
import {QuadratsContext, QuadratsContextProvider} from "./context/quadrats-context";
import {ScrollableTabs} from "./components/tabpanel/tab-panel";

export interface BlockSchemeEditorProps {
}

export const BlockSchemeEditor = (props: BlockSchemeEditorProps) => {
    const classes = useGlobalStyles();
    const {quads, updateQuads} = useContext(QuadratsContext);

    return (
        <div style={{flexDirection: "row", display: "flex"}}>
            <SettingsContextProvider>
                <QuadratsContextProvider>
                    <Card className={classes.thickCard}>
                        <CardContent>
                            <Typography className={classes.title} color="textPrimary" gutterBottom>
                                Редактор блок схем
                            </Typography><HelpDialog/>
                            {/*<ScrollableTabs/>*/}
                            <BlockSchemeGrid></BlockSchemeGrid>
                        </CardContent>
                    </Card>
                    <EditorSettingsPanel quadrats={quads} setQuadrats={updateQuads}/>
                </QuadratsContextProvider>
            </SettingsContextProvider>
        </div>
    )
}
