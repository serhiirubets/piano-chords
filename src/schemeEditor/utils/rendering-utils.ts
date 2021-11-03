import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {EditorSettings} from "../model/editor-settings-data";

export const getFlexBasisValue = (barSize: number, isExporting: boolean, isMenuOpen: boolean) => {
    if (isExporting) {
        switch (barSize) {
            case 6:
                return "33%";
            case 8:
                return "35%";
            case 12:
                return "35%"
        }
    }
    if (barSize === 12) {
        return "40%"
    }
    return isMenuOpen ? "40%" : "22%"
}

export const getPaddingValue = (barSize: number, isExporting: boolean) => {
    if (isExporting) {
        switch (barSize) {
            case 6:
                return "0 0em 0 0em"
            case 8:
                return "0 0em 0 0em"
            case 12:
                return "0 4em 0 4em"
        }
    }
    return barSize < 8 ? "0" : " 0 0em 0 0em"
}

export const getScaleSize = (barSize: number) => {
    switch (barSize) {
        case 6:
            return 4
        case 8:
            return 3.5
        case 12:
            return 2.9
    }

    return 3.8;
}

export const getExportViewportWidth = (barSize: number, isExporting: boolean) => {
    if (isExporting) {
        switch (barSize) {
            case 6:
                return "80%"
            case 8:
                return "70%"
            case 12:
                return "90%"
        }
    }

    return "100%";
}

export const getQuadratNodeDimension = (isMasteringMode: boolean) => {
    return {
        quadratWidth: isMasteringMode ? 32 : 40,
        quadratDotWidth: isMasteringMode ? 16 : 20,
        quadratSmallDotWidth: isMasteringMode ? 8 : 10
    }
}


export const renderToPdf = async (settings: EditorSettings, toPdf?) => {
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


}
