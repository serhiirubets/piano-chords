import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import AddToDriveRoundedIcon from "@mui/icons-material/AddToDriveRounded";
import React, {useEffect} from "react";
import {REACT_APP_GOOGLE_DRIVE_API_KEY, REACT_APP_GOOGLE_DRIVE_CLIENT_ID} from "../../../env";
import {useDrivePicker} from "../reusable/google-api/google-api-picker";
import {readFromGoogleApi} from "../reusable/google-api/google-api-requests";

export const LoadFromGoogleDrive = ({onFileRead}) => {
    const {openPicker, data, authResponse} = useDrivePicker();

    useEffect(() => {
        if(data){
            const itemMetadata = data.docs[0]
            readFromGoogleApi(itemMetadata.id, onFileRead)
        }
    }, [data])

    const handleOpenPicker = () => {
        openPicker({

            clientId: REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
            developerKey: REACT_APP_GOOGLE_DRIVE_API_KEY,
            viewId: "DOCS",
            viewMimeTypes:'application/pianotab,application/vnd.google-apps.folder',
            showUploadView: true,
            setIncludeFolders:true,
            setSelectFolderEnabled:true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
        })
    }

    return (<ListItem button key={"LoadFromGoogleDrive"} onClick={handleOpenPicker}>
        <ListItemIcon>
            <AddToDriveRoundedIcon/>
        </ListItemIcon>
        <ListItemText primary="Google drive"/>
    </ListItem>)
}
