import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import JsPdf from 'jspdf';
import html2canvas from 'html2canvas';

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class PdfExporter extends PureComponent {
    constructor(props) {
        super(props);
        this.toPdf = this.toPdf.bind(this);
        this.targetRef = React.createRef();
    }

    toPdf() {
        const {targetRef, filename, x, y, options, onComplete, pageWidth, pageHeight} = this.props;
        const source = targetRef || this.targetRef;
        const targetComponent = source.current || source;
        if (!targetComponent) {
            throw new Error(
                'Target ref must be used or informed. See https://github.com/ivmarcos/react-to-pdf#usage.'
            );
        }
        sleep(100).then(
            _ => html2canvas(targetComponent, {
                logging: false,
                useCORS: true,
                scale: this.props.scale
            })
        )
            .then(canvas => {

                const pageLeftOffset = 10;
                let imgData = canvas.toDataURL('image/png');
                let imgHeight = canvas.height / 16;
                let heightLeft = imgHeight;
                let doc = new JsPdf(options);

                let position = 0;

                doc.addImage(imgData, 'PNG', pageLeftOffset, position, canvas.width / 16, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', pageLeftOffset, position, canvas.width / 16, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save(filename);
                if (onComplete) onComplete();
            });
    }

    render() {
        const {children} = this.props;
        return children({toPdf: this.toPdf, targetRef: this.targetRef});
    }
}

PdfExporter.propTypes = {
    filename: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    options: PropTypes.shape({}),
    scale: PropTypes.number,
    children: PropTypes.func.isRequired,
    onComplete: PropTypes.func,
    pageWidth: PropTypes.number,
    pageHeight: PropTypes.number,
    targetRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.instanceOf(Element)})
    ])
};

PdfExporter.defaultProps = {
    filename: 'download.pdf',
    options: undefined,
    x: 0,
    y: 0,
    scale: 1,
    pageWidth: 210,
    pageHeight: 295,
    onComplete: undefined,
    targetRef: undefined
};

export default PdfExporter;
