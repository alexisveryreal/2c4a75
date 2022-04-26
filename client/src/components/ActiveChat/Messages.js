import React, { useCallback, useContext, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import { SocketContext } from '../../context/socket';
import axios from 'axios';

const Messages = (props) => {
  const { messages, otherUser, userId, messagesLength, filteredSeen } = props;

  console.log(filteredSeen);

  const socket = useContext(SocketContext);

  /**
   * Function that takes in a Message
   * then updates that message to seen in the backend
   * @param {T} body
   * @param {boolean} updateAll
   * @returns {Promise<T>}
   */
  const updateMessage = useCallback(async (body, updateAll) => {
    if (updateAll) {
      const newBody = { ...body };
      newBody.updateAll = true;
      const { data } = await axios.put('/api/messages', newBody);
      console.log('data????: ', data);
      return data;
    }
    const { data } = await axios.put('/api/messages', body);
    return data;
  }, []);

  useEffect(() => {
    const otherUserMessages = messages.filter(
      (message) => message.senderId === otherUser.id
    );

    // Grabbing the messages from the other user
    // grabbing their latest message, setting it to seen
    // then updating that message in our DB
    // aftewards then emits that message in case both users are on the page at the same time

    const arrLength = otherUserMessages.length;
    if (arrLength > 0) {
      const check = otherUserMessages[0].seen;
      const message = otherUserMessages[arrLength - 1];
      message.seen = true;

      updateMessage(message, !check)
        .then((data) => {
          socket.emit('read-message', {
            message: data,
            reader: userId,
            sender: otherUser.id,
          });
        })
        .catch(console.error);
    }
  }, [messages, otherUser, socket, userId, updateMessage, messagesLength]);

  /**
   * Function that grabs the passed in message
   * Checks if that message is the same as the last seen message
   * If it is then we return true otherwise false
   * returning true will show the avatar bubble under that message
   * @param {T} message
   * @param {boolean} seen
   * @returns {boolean}
   */
  const setSeen = (message, seen = false) => {
    if (filteredSeen.length > 0) {
      const mostRecentMessage = filteredSeen[filteredSeen.length - 1];
      const thisMessage = mostRecentMessage.id === message.id;
      if (thisMessage) {
        seen = true;
      }
    }
    return seen;
  };

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        // variable to indicate if avatar bubble of other user shows under this message
        // see logic above
        let seen = setSeen(message);

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            showSeen={seen}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
