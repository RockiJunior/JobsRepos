import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PDFViewerComponent from 'components/common/PDFViewer/PDFViewerComponent';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import FileViewer from 'react-file-viewer';

const RenderPreview = ({ preview, alt, isSmall }) => {
  const [error, setError] = React.useState(false);
  const [showDocument, setShowDocument] = useState(false);

  const extension = preview.substring(preview.lastIndexOf('.'));
  const file = preview.includes('blob')
    ? preview.replace(extension, '')
    : preview;
  switch (extension) {
    case '.pdf':
      return <PDFViewerComponent isSmall={isSmall} file={file} />;

    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.bmp':
    case '.svg':
    case '.webp':
      return (
        <div
          className="w-100 border p-2"
          onClick={() => window.open(file)}
          style={{ cursor: 'pointer' }}
        >
          <img src={file} alt={alt} style={{ width: '100%' }} />
        </div>
      );

    case '.mp4':
    case '.webm':
    case '.ogv':
    case '.avi':
    case '.wmv':
    case '.mov':
      return (
        <div
          className="w-100 border p-2"
          onClick={() => window.open(file)}
          style={{ cursor: 'pointer' }}
        >
          <video src={file} alt={alt} style={{ width: '100%' }} controls />
        </div>
      );

    case '.mp3':
    case '.wav':
    case '.ogg':
    case '.oga':
    case '.flac':
    case '.m4a':
    case '.aac':
    case '.wma':
    case '.wv':
      return (
        <div
          className="w-100 border p-2"
          onClick={() => window.open(file)}
          style={{ cursor: 'pointer' }}
        >
          <audio src={file} alt={alt} style={{ width: '100%' }} controls />
        </div>
      );

    case '.doc':
    case '.docx':
    case '.xls':
    case '.xlsx':
    case '.ppt':
    case '.pptx':
    case '.txt':
    case '.rtf':
    case '.odt':
    case '.ods':
    case '.odp':
    case '.odg':
    case '.odf':
    case '.odb':
    case '.csv':
    case '.tsv':
      return (
        <div className="w-100 border p-5 text-center">
          {error ? (
            <>
              <p>Error al cargar el archivo</p>
              <a href={file} target="_blank" rel="noreferrer">
                Abrir archivo en una nueva pestaña{' '}
                <FontAwesomeIcon icon="file" />
              </a>
            </>
          ) : (
            <>
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  setShowDocument(true);
                }}
              >
                Ver archivo {extension} <FontAwesomeIcon icon="file" />
              </a>

              <Modal show={showDocument} size="xl" centered>
                <Modal.Header closeButton onHide={() => setShowDocument(false)}>
                  <Modal.Title>Archivo</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-0">
                  <FileViewer
                    fileType={extension.substring(1)}
                    filePath={file}
                    onError={setError}
                  />
                </Modal.Body>
              </Modal>
            </>
          )}
        </div>
      );

    default:
      return (
        <div className="w-100 border p-5 text-center">
          <a href={file} target="_blank" rel="noreferrer">
            Abrir archivo en una nueva pestaña <FontAwesomeIcon icon="file" />
          </a>
        </div>
      );
  }
};

RenderPreview.propTypes = {
  preview: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  isSmall: PropTypes.bool
};

export default RenderPreview;
