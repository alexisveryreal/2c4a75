import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
}));

const Chat = ({ conversation, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const [numberUnread, setNumberUnread] = useState(0);

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        // gets the count of messages that have not been seen from the other user
        const { data } = await axios.get(
          `/api/messages/${conversation.id}/${otherUser.id}/${false}`
        );
        setNumberUnread(data.count);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNumber();
  }, [conversation.id, otherUser.id, conversation.messages.length]);

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);

    // once they click on the chat set the unread to 0
    setNumberUnread(0);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} numberUnread={numberUnread} />
    </Box>
  );
};

export default Chat;
