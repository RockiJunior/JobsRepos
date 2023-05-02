import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SizeMe } from 'react-sizeme';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewerComponent = ({ file, isSmall }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      className={classNames('w-100', {
        'p-2': !isSmall,
        border: !isSmall
      })}
    >
      <div
        onClick={() => window.open(file)}
        style={{
          cursor: 'pointer',
          aspectRatio: isSmall ? '1/1' : '',
          overflow: isSmall ? 'hidden' : ''
        }}
      >
        <SizeMe monitorHeight>
          {({ size }) => (
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              externalLinkTarget="_blank"
            >
              <Page
                renderTextLayer={!isSmall}
                renderAnnotationLayer={!isSmall}
                pageNumber={pageNumber}
                width={size.width ? size.width : 1}
                height={size.height ? size.height : 1}
              />
            </Document>
          )}
        </SizeMe>
      </div>

      {!isSmall && (
        <div className="d-flex justify-content-around align-items-center mt-2">
          <Button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(page => page - 1)}
            size="sm"
          >
            <FontAwesomeIcon icon="arrow-left" />
          </Button>
          <p className="m-0 p-0">{`${pageNumber}/${numPages}`}</p>
          <Button
            disabled={pageNumber === numPages}
            onClick={() => setPageNumber(page => page + 1)}
            sx={{ p: 0 }}
            size="sm"
          >
            <FontAwesomeIcon icon="arrow-right" />
          </Button>
        </div>
      )}
    </div>
  );
};

PDFViewerComponent.propTypes = {
  file: PropTypes.string.isRequired,
  isSmall: PropTypes.bool
};

export default PDFViewerComponent;
