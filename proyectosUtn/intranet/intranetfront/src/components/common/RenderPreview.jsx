import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PDFViewerComponent from 'components/common/PDFViewer/PDFViewerComponent';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import FileViewer from 'react-file-viewer';

const icons = {
  '.pdf': 'file-pdf',
  '.doc': 'file-word',
  '.docx': 'file-word',
  '.xls': 'file-excel',
  '.xlsx': 'file-excel',
  '.ppt': 'file-powerpoint',
  '.pptx': 'file-powerpoint',
  '.txt': 'file-text'
};

const RenderPreview = ({ preview, alt, isSmall }) => {
  const [error, setError] = React.useState(false);
  const [showDocument, setShowDocument] = useState(false);

  const [audioPaused, setAudioPaused] = useState(true);

  const audioRef = useRef();

  const extension = preview.substring(preview.lastIndexOf('.'));
  const file = preview.includes('blob')
    ? preview.replace(extension, '')
    : preview;
  switch (extension.toLowerCase()) {
    case '.pdf':
      return <PDFViewerComponent isSmall={isSmall} file={file} />;

    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.bmp':
    case '.svg':
    case '.webp':
    case '.jfif':
      return isSmall ? (
        <div
          className="w-100"
          onClick={() => window.open(file)}
          style={{
            cursor: 'pointer',
            aspectRatio: '1/1',
            overflow: 'hidden'
          }}
        >
          <img
            src={file}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
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
      return isSmall ? (
        <div
          className="w-100"
          onClick={() => window.open(file)}
          style={{
            cursor: 'pointer',
            aspectRatio: '1/1',
            overflow: 'hidden'
          }}
        >
          <video
            src={file}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            controls={!isSmall}
          />
        </div>
      ) : (
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
      return isSmall ? (
        <div
          className="w-100 d-flex justify-content-center align-items-center"
          style={{
            cursor: 'pointer',
            aspectRatio: '1/1',
            overflow: 'hidden'
          }}
        >
          {audioPaused ? (
            <FontAwesomeIcon
              icon="play"
              size="3x"
              onClick={() => {
                audioRef.current?.play();
                setAudioPaused(false);
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon="pause"
              size="3x"
              onClick={() => {
                audioRef.current?.pause();
                setAudioPaused(true);
              }}
            />
          )}
          <audio
            src={file}
            alt={alt}
            style={{ width: '100%' }}
            ref={audioRef}
            onPause={() => setAudioPaused(true)}
          />
        </div>
      ) : (
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
        <>
          {isSmall ? (
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              style={{
                cursor: 'pointer',
                aspectRatio: '1/1',
                overflow: 'hidden'
              }}
              onClick={e => {
                e.preventDefault();
                setShowDocument(true);
              }}
            >
              <FontAwesomeIcon icon={icons[extension]} size="3x" />
            </div>
          ) : (
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
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    setShowDocument(true);
                  }}
                >
                  Ver archivo {extension}{' '}
                  <FontAwesomeIcon icon={icons[extension]} size="3x" />
                </a>
              )}
            </div>
          )}

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
      );

    default:
      return isSmall ? (
        <div
          className="w-100 d-flex justify-content-center align-items-center"
          style={{
            cursor: 'pointer',
            aspectRatio: '1/1',
            overflow: 'hidden'
          }}
          onClick={() => window.open(file)}
        >
          <FontAwesomeIcon icon={icons[extension] || 'file'} size="3x" />
        </div>
      ) : (
        <div className="w-100 border p-5 text-center">
          <a href={file} target="_blank" rel="noreferrer">
            Abrir archivo en una nueva pestaña{' '}
            <FontAwesomeIcon icon="file" size="3x" />
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
