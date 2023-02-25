import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import classNames from 'classnames';
import socket from 'Socket';
/* import { Picker } from 'emoji-mart'; */
import AppContext, { ChatContext } from 'context/Context';
/* import 'emoji-mart/css/emoji-mart.css'; */
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch } from 'react-redux';
import { createMessage } from 'redux/conversationsSlice';
import { useSelector } from 'react-redux';

const formatDate = date => {
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  const now = date
    .toLocaleString('en-US', options)
    .split(',')
    .map(item => item.trim());

  return {
    day: now[0],
    hour: now[3],
    date: now[1] + ', ' + now[2]
  };
};

const MessageTextArea = () => {
  const {
    messages,
    currentThread,
    setScrollToBottom,
    scrollToBottom,
    isOpenThreadInfo
  } = useContext(ChatContext);
  const dispatch = useDispatch()
  const [previewEmoji, setPreviewEmoji] = useState(false);
  const [message, setMessage] = useState('');

  const {
    config: { isDark, isRTL }
  } = useContext(AppContext);

  const addEmoji = e => {
    let emoji = e.native;
    setMessage(message + emoji);
    setPreviewEmoji(false);
  };

  const conversation = messages?.find(({ id }) => id === currentThread?.id);
  const userLogged = useSelector((state) => state.login.currentUser)
  const content = conversation?.content
  const id = conversation?.id
  const branchOffice = conversation?.branchOffice

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let newMessage = {
        propertyId: content[0].conversation.propertyId,
        userId: userLogged.id,
        branchOfficeId: branchOffice,
        conversationId: id,
        message: message,
      };
      socket.emit('send_message', newMessage)
      setMessage('');
      setTimeout(() => {
        setScrollToBottom(true);
      }, 1000);
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    if (isOpenThreadInfo) {
      setPreviewEmoji(false);
    }
  }, [isOpenThreadInfo]);

  return (
    <Form className="chat-editor-area" onSubmit={handleSubmit}>
      <TextareaAutosize
        minRows={1}
        maxRows={6}
        value={message}
        placeholder="Escribí tu mensaje"
        onChange={({ target }) => setMessage(target.value)}
        className="form-control outline-none resize-none rounded-0 border-0 emojiarea-editor"
      />
      {/* 
      <Form.Group controlId="chatFileUpload">
        <Form.Label className="chat-file-upload cursor-pointer">
          <FontAwesomeIcon icon="paperclip" />
        </Form.Label>
        <Form.Control type="file" className="d-none" />
      </Form.Group> */}
      {/* 
      <Button
        variant="link"
        className="emoji-icon"
        onClick={() => setPreviewEmoji(!previewEmoji)}
      >
        <FontAwesomeIcon
          icon={['far', 'laugh-beam']}
          onClick={() => setPreviewEmoji(!previewEmoji)}
        />
      </Button>

      {previewEmoji && (
        <Picker
          set="google"
          onSelect={addEmoji}
          sheetSize={20}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: isRTL ? '2%' : 'auto',
            right: isRTL ? 'auto' : '2%',
            padding: 0,
            zIndex: 1,
            backgroundColor: getColor('100')
          }}
          theme={isDark ? 'dark' : 'light'}
          showPreview={false}
          showSkinTones={false}
        />
      )} */}

      <Button
        variant={message.length > 0 ? "success" : "secondary"}
        size="sm"
        className={classNames({
          'text-light': message.length > 0,
        })}
        style={{ marginLeft: 3 }}
        type="submit"
        disabled={message.length === 0}
      >
        Enviar
      </Button>
    </Form>
  );
};

MessageTextArea.propTypes = {
  thread: PropTypes.object
};

export default MessageTextArea;
