import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import SimpleBarReact from 'simplebar-react';
import { ChatContext } from 'context/Context';

const ChatContentBody = ({ thread }) => {
  const messagesEndRef = useRef();

  const { messages, scrollToBottom, setScrollToBottom } =
    useContext(ChatContext);
  const client = thread;
  const messagesFinded = messages?.find(({ id }) => id === thread.messagesId);
  const content = messagesFinded?.content
  
  useEffect(() => {
    if (scrollToBottom) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [scrollToBottom]);

  return (
    <div className="chat-content-body" style={{ display: 'inherit' }}>
      <SimpleBarReact style={{ height: '100%' }}>
        <div className="chat-content-scroll-area">
          {content?.map(({ message, user, read_at, created_at }, index) => (
            <div key={index}>
              <Message
                message={message}
                client={client}
                senderUserId={user === null ? thread.clientId : user.id}
                time={created_at}
                status={read_at === null ? 'delivered' : 'seen'}
                isGroup={false}
              />
            </div>
          ))}
        </div>
        <div id='ref' ref={messagesEndRef} />
      </SimpleBarReact>
    </div>
  );
};

ChatContentBody.propTypes = {
  thread: PropTypes.object.isRequired
};

export default ChatContentBody;
