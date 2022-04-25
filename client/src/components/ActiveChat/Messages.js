import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';
import { SocketContext } from '../../context/socket';
import axios from 'axios';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  // const [recentMessage, setRecentMessage] = useState(null);
  // const [showSeen, setShowSeen] = useState(false);

  const socket = useContext(SocketContext);

  // we know they clicked on the messages of the otherUser
  // we can then emit that they have opened this and send they have read it
  console.log('in messages');

  console.log(messages);
  console.log(otherUser);

  const updateMessage = useCallback(async (body) => {
    const { data } = await axios.put('/api/messages', body);
    return data;
  }, []);

  useEffect(() => {
    const bruhMoment = messages.filter(
      (message) => message.senderId === otherUser.id
    );

    console.log('BRUH MOMENT: ', bruhMoment);

    const arrLength = bruhMoment.length;
    if (arrLength > 0) {
      const message = bruhMoment[arrLength - 1];
      message.seen = true;

      updateMessage(message)
        .then((data) => {
          console.log(data);
          console.log('Emitting read-message!!!!!', {
            message: data,
            reader: userId,
            sender: otherUser.id,
          });

          socket.emit('read-message', {
            message: data,
            reader: userId,
            sender: otherUser.id,
          });
        })
        .catch(console.error);
    }
  }, [messages, otherUser, socket, userId, updateMessage]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            showSeen={message.seen}
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
