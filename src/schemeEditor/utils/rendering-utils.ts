import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {EditorSettings} from "../model/editor-settings-data";

export const getFlexBasisValue = (barSize: number, isExporting: boolean) => {
    if (isExporting) {
        switch (barSize) {
            case 6:
                return "35%";
            case 8:
                return "35%";
            case 12:
                return "35%"
        }
    }
    return barSize < 8 ? "" : "40%"
}

export const getPaddingValue = (barSize: number, isExporting: boolean) => {
    if (isExporting) {
        switch (barSize) {
            case 6:
                return "0 3em 0 3em"
            case 8:
                return "0 3em 0 3em"
            case 12:
                return "0 0.5em 0 0.5em"
        }
    }
    return barSize < 8 ? "0" : " 0 3em 0 3em"
}

export const getScaleSize = (barSize: number) => {
        switch (barSize) {
            case 6:
                return 4
            case 8:
                return 3.8
            case 12:
                return 3
        }

    return 3.8;
}

export const renderToPdf = async (settings:EditorSettings, toPdf?) => {
        // toPdf()
        html2canvas(settings.editorElementRef.current, {
            logging: true,
            useCORS: true,
            allowTaint: true,
            scale: getScaleSize(settings.quadratSize),
        }).then((canvas) => {
            const data = canvas.toDataURL('image/jpeg', 1);
            const pdf = new jsPDF({unit: 'mm', format: 'a4', orientation: 'portrait'});

           // https://github.com/niklasvh/html2canvas/pull/1087#issuecomment-534593208
            pdf.addImage(data, 'JPEG', 0, 0, canvas.width / 16, canvas.height / 16);
            pdf.save('block-scheme.pdf');

            settings.editorElementRef.current.classList.remove('exporting');
        });

    // updateSettings({...settings, isExportingInProgress:true}, renderPdfDocument())
    // updateSettings({...settings,isExportingInProgress:false})

}
