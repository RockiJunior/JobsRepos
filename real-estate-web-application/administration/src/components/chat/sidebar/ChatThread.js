import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import Avatar from 'components/common/Avatar';
import { Nav } from 'react-bootstrap';
import LastMessage from './LastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatSidebarDropdownAction from './ChatSidebarDropdownAction';
import { ChatContext } from 'context/Context';

const ChatThread = ({ thread, index, messages }) => {
  const { props } = useContext(ChatContext);
  const user = thread;
  const currentMessages = messages?.find(({ id }) => id === thread.messagesId);
  const lastMessage = currentMessages?.content[currentMessages.content.length - 1];
  const time = lastMessage && new Date(lastMessage?.created_at).toLocaleDateString('es-ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const day = time && time.split(',')[0][0].toUpperCase() + time.split(',')[0].split('').slice(1).join('')
  const date = time && time.split(',')[1]
  const actualProp = props.find(({ _id }) => _id === thread.propertyId)
  const direction = `${actualProp.location.street} ${actualProp.location.number}`
  
  return (
    
    <Nav.Link
      eventKey={index}
      className={classNames(`chat-contact hover-actions-trigger px-3 py-2`, {
        'unread-message': !thread.read,
        'read-message': thread.read
      })}
    >{/* 
      <div className="d-md-none d-lg-block">
        <ChatSidebarDropdownAction />
      </div> */}
      {date && <Flex>
        <Avatar name={user.name} size="xl" />
        <div className="flex-1 chat-contact-body ms-2 justify-content-start align-items-start">
          <Flex justifyContent="between">
            <label className="mb-0 chat-contact-title">{user.name}</label>
            <span className="message-time fs--2">
              {' '}
              {!!lastMessage && day}{' '}{date && date.split(' ')[1]}
            </span>
          </Flex>
          <h6 className="p-0 m-0" style={{ fontSize: 12 }}>{direction}</h6>
          <div className="min-w-0">
            <div className="chat-contact-content pe-3">
              <LastMessage lastMessage={lastMessage} thread={thread} />
              <div className="position-absolute bottom-0 end-0 hover-hide">
                {(!!user?.status && lastMessage.user) && (
                  <FontAwesomeIcon
                    icon={classNames({
                      check: true
                    })}
                    transform="shrink-5 down-4"
                    className={classNames({
                      'text-success': lastMessage.read_at !== null,
                      'text-400':
                        lastMessage.read_at === null ||
                        lastMessage.read_at === null
                    })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Flex>}
    </Nav.Link>
  );
};

ChatThread.propTypes = {
  thread: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default ChatThread;
