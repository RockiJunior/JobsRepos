import React, { useRef, useState } from 'react';
import { Overlay } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';

const EmojiPicker = props => {
  const { onChange } = props;

  const [show, setShow] = useState(false);

  const target = useRef(null);

  return (
    <div className="position-relative">
      <Overlay
        placement="bottom"
        trigger={['click', 'focus']}
        show={show}
        target={target.current}
        onHide={() => setShow(false)}
        rootClose
      >
        {
          // eslint-disable-next-line no-unused-vars
          ({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                // eslint-disable-next-line react/prop-types
                ...props.style,
                position: 'absolute',
                borderRadius: 3,
                zIndex: 9999,
                width: 300
              }}
            >
              <Picker
                width="100%"
                height="300px"
                onEmojiClick={({ emoji }) => {
                  onChange(emoji);
                  setShow(false);
                }}
                searchDisabled
                previewConfig={{
                  showPreview: false
                }}
                categories={[
                  {
                    category: 'suggested',
                    name: 'Frecuentes'
                  },
                  {
                    category: 'smileys_people',
                    name: 'Caritas y Personas'
                  },
                  {
                    category: 'animals_nature',
                    name: 'Animales y Naturaleza'
                  },
                  {
                    category: 'food_drink',
                    name: 'Comida y Bebida'
                  },
                  {
                    category: 'travel_places',
                    name: 'Viajes y Lugares'
                  },
                  {
                    category: 'activities',
                    name: 'Actividades'
                  },
                  {
                    category: 'objects',
                    name: 'Objetos'
                  },
                  {
                    category: 'symbols',
                    name: 'Símbolos'
                  },
                  {
                    category: 'flags',
                    name: 'Banderas'
                  }
                ]}
                lazyLoadEmojis
              />
            </div>
          )
        }
      </Overlay>

      <FontAwesomeIcon
        ref={target}
        icon={['far', 'laugh-beam']}
        style={{ cursor: 'pointer' }}
        onClick={() => setShow(!show)}
      />
    </div>
  );
};

EmojiPicker.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default EmojiPicker;
