import {gapi} from "gapi-script";
import {CallbackDoc} from "./typeDefs";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let google: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any
export const uploadNewFileToGoogleDrive = (content:string, filename:string, parentfolderId? :string,) => {
    var file = new Blob([content], {type: 'application/json'});
    var metadata = {
        'name': filename,
        'mimeType': 'application/pianotab',
    };
    if(parentfolderId){
        metadata['parents'] = [parentfolderId]
    }

    const accessToken = window.gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
        console.log(xhr.response.id); // Retrieve uploaded file ID.
    };
    xhr.send(form);
}

export const updateExistingFileInGoogleDrive = (content:string, pickerMetadata :CallbackDoc) => {
    var file = new Blob([content], {type: 'application/json'});
    const accessToken = window.gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

    var xhr = new XMLHttpRequest();
    xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/' + pickerMetadata.id + '?uploadType=media');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
        console.log('File '+pickerMetadata.id+' updated'); // Retrieve uploaded file ID.
    };
    xhr.send(file);
}

export const readFromGoogleApi = (fileId:string, readyCallback) => {

    const accessToken = window.gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

    var xhr = new XMLHttpRequest();
    xhr.open('get', 'https://www.googleapis.com/drive/v3/files/'+fileId+'?alt=media');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            readyCallback(JSON.stringify(xhr.response))
        }
    }
    xhr.send(null);
}
