import React, {useContext} from "react"
import {Divider, Typography} from "@mui/material";
// @ts-ignore
import {BlockSchemeGrid} from "./components/editor/block-scheme-grid";
import {SettingsContext} from "./context/settings-context";
import {BarContext} from "./context/bar-context";
import {ScrollableTabs} from "./components/tabpanel/tab-panel";
import {PlaybackModule} from "./components/menu/playback-module";
import IconButton from "@mui/material/IconButton";
import {PrintRounded} from "@mui/icons-material";
import {getScaleSize} from "./utils/rendering-utils";
import PdfExporter from "../core/pdf-exporter-class";
import {EditorHeaderPanel} from "./components/menu/editor-header-panel";
import {BlockSchemeGridNew} from "./components/editor/block-scheme-grid-new";
import {MasteringModeGrid} from "./components/editor/mastering-mode-grid";


export const BlockSchemeWhitePage = () => {

    const {settings, updateSettings} = useContext(SettingsContext);
    return (
        <div style={{flexDirection: "column", display: "flex", height: "100vh"}}>
            <div style={{alignSelf: "flex-start", position: "sticky", top: 0, left: 0, width: "100%"}}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <ScrollableTabs></ScrollableTabs>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <Divider orientation="vertical" flexItem/>
                            <PdfExporter targetRef={settings.editorElementRef}
                                         filename="block-scheme.pdf"
                                         scale={getScaleSize(settings.quadratSize)}
                                         onComplete={() => updateSettings({...settings, isExportingInProgress: false})}>
                                {/*beforeExport={() => updateSettings({...settings, isExportingInProgress: true})}*/}
                                {/*afterExport={() => updateSettings({...settings, isExportingInProgress: false})}>*/}

                                {({toPdf}) =>
                                    <IconButton
                                        onClick={() => {
                                            updateSettings({...settings, isExportingInProgress: true})
                                            toPdf()
                                        }}
                                        size="large">
                                        <PrintRounded fontSize="large" style={{fill: "#4b4a4a"}}/>
                                    </IconButton>
                                }

                            </PdfExporter>
                            <Divider orientation="vertical" flexItem/>
                            <PlaybackModule/>
                        </div>
                    </div>
                    <Divider orientation="horizontal" flexItem/>
                    <EditorHeaderPanel/>
                </div>
                <hr/>
            </div>


            <div style={{overflow: "scroll", height: "100%", width: "100%", position: "relative"}}>
                <div style={{
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "#b4b4b4",
                    display: settings.isExportingInProgress ? "inherit" : "none",
                    zIndex: 100,
                    alignItems: "center",
                    alignContent: "center",
                    padding: "100px",
                    position: "absolute"
                }}>
                    <Typography variant="h3" style={{color: "white", fontFamily: "Trebuchet MS"}}> Подождите,
                        пожалуйста,</Typography>
                    <Typography variant="h3" style={{color: "white", fontFamily: "Trebuchet MS"}}> Идет
                        экспорт...</Typography>
                </div>

                <div style={{height: "100%", width: "100%"}}>
                    {settings.isMasteringMode? <MasteringModeGrid/> :  <BlockSchemeGridNew/>}
                </div>

            </div>
        </div>
    );
}
