import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField
} from "@mui/material";
import AddToDriveRoundedIcon from "@mui/icons-material/AddToDriveRounded";
import React, {useContext, useEffect, useState} from "react";
import {REACT_APP_GOOGLE_DRIVE_API_KEY, REACT_APP_GOOGLE_DRIVE_CLIENT_ID} from "../../../env";
import {useDrivePicker} from "../reusable/google-api/google-api-picker";
import {updateExistingFileInGoogleDrive, uploadNewFileToGoogleDrive} from "../reusable/google-api/google-api-requests";
import {CallbackDoc} from "../reusable/google-api/typeDefs";
import {SettingsContext} from "../../context/settings-context";


export const SaveGoogleDrive = ({content}) => {
    const {settings} = useContext(SettingsContext)
    const [token, setToken] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [fileName, setFileName] = useState('')
    const [pickerMetadata, setPickerMetadata] = useState<CallbackDoc | null>(null)
    const {openPicker, data, authResponse} = useDrivePicker();

    useEffect(() => {
        if (data) {
            setPickerMetadata(data.docs[0])
            setDialogOpen(true)
        }
    }, [data])

    useEffect(() => {
        console.log('authResponse', authResponse)
        if (authResponse && authResponse.access_token)
            setToken(authResponse.access_token)
    }, [authResponse])
    const auth_to_use = token === '' ? {developerKey: REACT_APP_GOOGLE_DRIVE_API_KEY} : {token: token}

    const handleOpenPicker = () => {
        openPicker({

            clientId: REACT_APP_GOOGLE_DRIVE_CLIENT_ID!,
            developerKey: REACT_APP_GOOGLE_DRIVE_API_KEY!,
            viewId: "DOCS",
            viewMimeTypes: 'application/pianotab,application/vnd.google-apps.folder',
            ...auth_to_use,
            showUploadView: true,
            setIncludeFolders: true,
            setSelectFolderEnabled: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
        })
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    const handleFileUpload = () => {
        if (!pickerMetadata) {
            return
        }
        if (pickerMetadata.type === 'folder') {
            uploadNewFileToGoogleDrive(content, fileName, pickerMetadata.id)
        } else {
            updateExistingFileInGoogleDrive(content, pickerMetadata)
        }
        setDialogOpen(false)
    }


    return (
        <div>
            <ListItem button key={"SaveGoogleDrive"} onClick={handleOpenPicker}>
                <ListItemIcon>
                    <AddToDriveRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Google drive"/>
            </ListItem>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>????????????????????</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {pickerMetadata && pickerMetadata.type === 'folder' ? "??????????????, ????????????????????, ?????? ??????????" : "???? ??????????????, ?????? ???????????? ???????????????????????? ????????? ???????????????? ?????? ???????????????? ?????????? ????????????????????"}
                    </DialogContentText>
                    {pickerMetadata && pickerMetadata.type === 'folder' && <TextField
                        autoFocus
                        margin="dense"
                        label="?????? ??????????"
                        defaultValue={settings.fileName}
                        fullWidth
                        variant="standard"
                        onChange={(e) => setFileName(e.target.value)}
                    />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setPickerMetadata(null)
                        handleDialogClose()
                    }}>????????????</Button>
                    <Button onClick={handleFileUpload}>??????????????????????</Button>
                </DialogActions>
            </Dialog>
        </div>)
}
