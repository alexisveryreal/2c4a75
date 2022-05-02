import React, { useCallback, useContext, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import { SocketContext } from '../../context/socket';
import axios from 'axios';

const Messages = (props) => {
  const {
    messages,
    otherUser,
    userId,
    messagesLength,
    filteredSeen,
    setReadMessage,
    conversationId,
  } = props;

  const socket = useContext(SocketContext);

  /**
   * Function that takes in a Message
   * then updates that message to seen in the backend
   * @param {T} body
   * @returns {Promise<T>}
   */
  const updateMessage = useCallback(async (body) => {
    const { data } = await axios.put('/api/messages', body);
    return data;
  }, []);

  useEffect(() => {
    const fetchUnseenOther = async () => {
      try {
        const { data } = await axios.get(
          `/api/messages/${conversationId}/${otherUser.id}/${false}`
        );
        const otherUserMessages = data.rows;
        // Grabbing the messages from the other user
        // grabbing their latest message, setting it to seen
        // then updating that message in our DB
        // aftewards then emits that message in case both users are on the page at the same time

        const arrLength = otherUserMessages.length;
        if (arrLength > 0) {
          const message = otherUserMessages[arrLength - 1];
          message.seen = true;
          message.recipientId = userId;

          const data = await updateMessage(message);

          // neccessary for this current user, the socket emit handles the other user
          setReadMessage({
            message: data,
            reader: userId,
            sender: otherUser.id,
          });
          socket.emit('read-message', {
            message: data,
            reader: userId,
            sender: otherUser.id,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnseenOther();
  }, [
    conversationId,
    otherUser.id,
    setReadMessage,
    socket,
    updateMessage,
    userId,
    messagesLength,
  ]);

  /**
   * Function that grabs the passed in message
   * Checks if that message is the same as the last seen message
   * If it is then we return true otherwise false
   * returning true will show the avatar bubble under that message
   * @param {T} message
   * @returns {boolean}
   */
  const setSeen = (message) => {
    let seen = false;
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
