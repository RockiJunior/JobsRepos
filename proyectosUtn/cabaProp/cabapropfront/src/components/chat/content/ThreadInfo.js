import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import users from 'data/people';
import SimpleBarReact from 'simplebar-react';
import { ChatContext } from 'context/Context';

const ThreadInfo = ({ thread }) => {
  const { isOpenThreadInfo, groups } = useContext(ChatContext);
  const user = thread;

  const [conversationOptions] = useState([
    {
      title: 'Search in Conversation',
      icon: 'search',
      link: '#!'
    },
    {
      title: 'Edit Nicknames',
      icon: 'pencil-alt',
      link: '#!'
    },
    {
      title: 'Change Color',
      icon: 'palette',
      link: '#!'
    },
    {
      title: 'Change Emoji',
      icon: 'thumbs-up',
      link: '#!'
    },
    {
      title: 'Notifications',
      icon: 'bell',
      link: '#!'
    }
  ]);

  return (
    <div
      className={classNames('conversation-info', { show: isOpenThreadInfo })}
    >
      <div className="h-100 overflow-auto">
        <SimpleBarReact
          style={{
            height: '100%',
            minWidth: '75px'
          }}
        >
          <Flex
            alignItems="center"
            className="position-relative p-3 border-bottom hover-actions-trigger"
          >
            <Avatar className={user.status} size="xl" src={user.avatarSrc} />
            <Flex className="ms-2 flex-between-center flex-1">
              <h6 className="mb-0">
                <Link
                  to="/user/profile"
                  className="text-decoration-none stretched-link text-700"
                >
                  {user.name}
                </Link>
              </h6>
              <Dropdown className="z-index-1">
                <Dropdown.Toggle
                  id="dropdown-button"
                  className="text-400 dropdown-caret-none me-n3"
                  variant="link"
                  size="sm"
                >
                  <FontAwesomeIcon icon="cog" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="py-2 border">
                  <Dropdown.Item className="cursor-pointer">Mute</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="cursor-pointer">
                    Archive
                  </Dropdown.Item>
                  <Dropdown.Item className="cursor-pointer text-danger">
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Flex>
          </Flex>
          <div className="px-3 pt-2">
            <Nav className="flex-column font-sans-serif fw-medium">
              {conversationOptions.map((item, index) => (
                <Nav.Link
                  className="py-1 px-0 text-600 d-flex align-items-center"
                  href={item.link}
                  key={item.title}
                >
                  <span className="conversation-info-icon">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="me-1"
                      transform={classNames('shrink-1', {
                        'down-3': index === 0
                      })}
                    />
                  </span>{' '}
                  {item.title}
                </Nav.Link>
              ))}
            </Nav>
          </div>
        </SimpleBarReact>
      </div>
    </div>
  );
};

ThreadInfo.propTypes = {
  thread: PropTypes.object.isRequired
};

export default ThreadInfo;
