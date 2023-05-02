import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { getInfo } from './getInfo';

export const TimeLineItem = ({ item, expediente }) => {
  const { fecha, nombre, descripcion, usuario, info } = item;

  const blur =
    '0px calc((1.5rem + 15px)*-1) 12px -18px var(--falcon-100) inset';

  const [showMore, setShowMore] = useState(false);

  const ref = useRef();
  const refTitle = useRef();

  const [height, setHeight] = useState(0);
  const [heightTitle, setHeightTitle] = useState('1.2rem');

  useEffect(() => {
    let resizeObserver;
    if (ref.current) {
      resizeObserver = new ResizeObserver(() => {
        setHeight(ref.current?.clientHeight);
      });
      resizeObserver.observe(ref.current);
    }
    return () => {
      resizeObserver?.disconnect();
    };
  }, [ref]);

  useEffect(() => {
    let resizeObserver;
    if (refTitle.current) {
      resizeObserver = new ResizeObserver(() => {
        setHeightTitle(refTitle.current?.clientHeight);
      });
      resizeObserver.observe(refTitle.current);
    }
    return () => {
      resizeObserver?.disconnect();
    };
  }, [refTitle]);

  return (
    <div className="timeline-item timeline-item-end">
      <div className="timeline-icon icon-item icon-item-lg text-primary border-300">
        <FontAwesomeIcon icon="clock" className="fs-1" />
      </div>
      <div className="timeline-item-end">
        <div
          className="timeline-item-content"
          style={{
            overflow: 'hidden'
          }}
        >
          <div
            className="timeline-item-card"
            style={{
              transition: 'max-height .5s ease-in-out',
              maxHeight: showMore
                ? `calc(${height}px + 1.5rem * 2)`
                : `calc(${heightTitle}px + 1.5rem * 2)`
            }}
          >
            <div ref={ref}>
              <div ref={refTitle}>
                <div className="d-flex justify-content-between align-items-end w-100">
                  <span className="fs--1 text-dark fw-semi-bold">
                    {dayjs(fecha).format('DD/MM/YYYY - HH:mm [hs]')}
                  </span>
                  <span className="mb-0 fw-semi-bold text-dark">
                    {usuario
                      ? usuario.nombre + ' ' + usuario.apellido
                      : 'Sistema'}
                  </span>
                </div>
                <h5 className="m-0">
                  {nombre}{' '}
                  {info &&
                    info.tipo !== 'procesoLegal' &&
                    info.tipo !== 'fiscalizacion' && (
                      <FontAwesomeIcon icon="paperclip" />
                    )}
                </h5>
              </div>

              <p className="fs--1 mb-0 mt-2">{descripcion}</p>

              {info && getInfo(info, expediente)}
            </div>
          </div>
          <div
            style={{
              boxShadow: blur,
              WebkitBoxShadow: blur,
              MozBoxShadow: blur,
              width: '100%',
              bottom: 0
            }}
            className="position-absolute d-flex justify-content-end align-items-end"
          >
            <div>
              {descripcion && (
                <a
                  onClick={() => setShowMore(!showMore)}
                  className="p-0 m-0 fw-bold cursor-pointer fs--1 px-2"
                >
                  {showMore ? 'Ver menos...' : 'Ver más...'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
TimeLineItem.propTypes = {
  item: PropTypes.object,
  expediente: PropTypes.object
};
