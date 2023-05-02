import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { ChatContext } from 'context/Context';
import Avatar from 'components/common/Avatar';

const ChatContentHeader = ({ thread, setHideSidebar }) => {
  const { props } = useContext(ChatContext);
  const user = thread;
  const actualProp = props.find(({ _id }) => _id === thread.propertyId);
  const direction =
    actualProp ? `${actualProp.location.street} ${actualProp.location.number}` : undefined

  return (
    <div className="chat-content-header">
      <Row className="flex-between-center">
        { actualProp &&
          <Col xs={6} md={8} as={Flex} alignItems="center">
            <div className="me-3">
              <Avatar size="2xl" name={user.name} />
            </div>
            <div
              className="pe-3 text-700 d-md-none contacts-list-show cursor-pointer"
              onClick={() => setHideSidebar(true)}
            >
              <FontAwesomeIcon icon="chevron-left" />
            </div>
            <div className="min-w-0">
              <h5 className="mb-0 text-truncate fs-0">{user?.name}</h5>
              <label>
                Consultó por la propiedad de <a href={`${process.env.REACT_APP_CLIENT}/propiedad/${actualProp._id}`} rel="noreferrer" target="_blank">{direction}</a>
              </label>
            </div>
          </Col>
        }
      </Row>
    </div>
  );
};

ChatContentHeader.propTypes = {
  thread: PropTypes.object.isRequired,
  setHideSidebar: PropTypes.func.isRequired
};

export default ChatContentHeader;
