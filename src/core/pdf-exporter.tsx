import React, {useEffect, useRef} from 'react';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";

export const PdfExporter = ({targetRef, filename, beforeExport, afterExport,children, scale}) => {
    const ownTargetRef = useRef();

    const toPdf = () => {
        const source = targetRef || ownTargetRef;
        const targetComponent = source.current || source;

        if (beforeExport) beforeExport();

        if (!targetComponent) {
            throw new Error(
                'Target ref must be used or informed. See https://github.com/ivmarcos/react-to-pdf#usage.'
            );
        }

        html2canvas(targetComponent, {
            logging: true,
            useCORS: true,
            allowTaint: true,
            scale: scale
        }).then(canvas => {
            const data = canvas.toDataURL('image/jpeg', 1);
            const pdf = new jsPDF({unit: 'mm', format: 'a4', orientation: 'portrait'});

            // https://github.com/niklasvh/html2canvas/pull/1087#issuecomment-534593208
            pdf.addImage(data, 'JPEG', 0, 0, canvas.width / 16, canvas.height / 16)
            pdf.save(filename);
            if (afterExport) afterExport();
        });
    }

    return children({ toPdf: toPdf, targetRef: targetRef })
}
