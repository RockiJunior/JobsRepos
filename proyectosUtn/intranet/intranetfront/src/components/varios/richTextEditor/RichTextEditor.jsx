import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import EmojiPicker from './EmojiPicker';
import './richText.css';
import PropTypes from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const RichTextEditor = ({ value, onChange }) => (
  <Editor
    editorState={value}
    wrapperClassName="border"
    editorStyle={{
      minHeight: 100,
      paddingLeft: 8,
      paddingRight: 8,
      cursor: 'text',
      maxHeight: 'calc(100vh - 400px)'
    }}
    toolbarClassName="d-flex justify-content-between flex-wrap border-top-0 border-start-0 border-end-0"
    toolbar={{
      options: [
        'inline',
        'blockType',
        'fontSize',
        'fontFamily',
        'list',
        'textAlign',
        'colorPicker',
        'link',
        'emoji',
        'history'
      ],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough']
      },
      blockType: {
        inDropdown: true,
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
      },
      emoji: {
        component: EmojiPicker
      }
    }}
    onEditorStateChange={onChange}
    localization={{
      locale: 'es'
    }}
  />
);

RichTextEditor.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

export default RichTextEditor;
