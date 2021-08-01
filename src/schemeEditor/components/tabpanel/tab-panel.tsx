import React, {useContext} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import {BarContext} from "../../context/bar-context";
import {SheetData} from "../../model/deprecated/sheet-data";
import {TabElement} from "./tab-element";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%'
    },
}));

export const ScrollableTabs = () => {
    const styles = useStyles();
    const {sheets, updateSheets, activeSheet, updateActiveSheet} = useContext(BarContext);
    const [value, setValue] = React.useState(0);

    const sheetNames = Array.from(sheets.entries())
        .sort(([k1, v1], [k2, v2]) => {
            return v1.index - v2.index;
        })
        .map(([k,v]) => k);

    const handleChange = (event: React.ChangeEvent<{}> | null, newValue: number) => {
        setValue(newValue);
        if (newValue < sheetNames.length) {
            updateActiveSheet(sheetNames[newValue])
        }
    };


    const handleAdditionOfSheet = () => {
        const newSheet = new SheetData();
        newSheet.index = sheetNames.length;
        newSheet.name = "Часть " + (newSheet.index + 1);

        const updatedSheets = new Map(sheets);
        updatedSheets.set(newSheet.name, newSheet);
        updateSheets(updatedSheets)
        updateActiveSheet(newSheet.name)
    }

    const handleRemovalOfSheet = (sheetName:string) => {
        const updatedSheets = new Map(sheets);
        if(Array.from(updatedSheets.entries()).length === 1){
            alert("Минимальное количество листов в блок-схеме = 1")
            return;
        }
        updatedSheets.delete(sheetName);
        updateSheets(updatedSheets);
        updateActiveSheet(Array.from(updatedSheets.keys())[0])
    }

    const handleNameChange = (newName: string) => {

        const sheetData = sheets.get(activeSheet);
        if (sheetData) {
            const updatedSheets = new Map(sheets)
                .set(newName, sheetData);

            updatedSheets.delete(activeSheet);
            updateSheets(updatedSheets);
            updateActiveSheet(newName);
        }

    }

    return (
        // <div>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
            >
                {sheetNames
                    .map((sheetName, idx) => <TabElement
                        label={sheetName}
                        onNameChange={handleNameChange}
                        onTabSelect={() => {
                            handleChange(null, idx)
                        }}
                        onRemoveTriggered={handleRemovalOfSheet}
                    />)}
                <Tab icon={<AddRoundedIcon/>} onClick={handleAdditionOfSheet}/>
            </Tabs>

        // </div>
    );
}
