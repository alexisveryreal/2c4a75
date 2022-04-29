import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Input, Header, Messages } from './index';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexGrow: 8,
    flexDirection: 'column',
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}));

const ActiveChat = ({
  user,
  conversations,
  activeConversation,
  postMessage,
  setReadMessage,
}) => {
  const classes = useStyles();
  const [seenMessages, setSeenMessages] = useState([]);

  const conversation = useMemo(
    () =>
      conversations
        ? conversations.find(
            (conversation) =>
              conversation.otherUser.username === activeConversation
          )
        : {},
    [activeConversation, conversations]
  );

  useEffect(() => {
    // Function that grabs all messages send by the current user that have been seen
    // this is so that we can add the avatar bubble on the last message seen
    const fetchSeenMessages = async () => {
      try {
        if (conversation !== undefined) {
          const { data } = await axios.get(
            `/api/messages/${conversation?.id}/${user.id}/${true}`
          );
          setSeenMessages(data.rows);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSeenMessages();
  }, [conversation?.messages?.length, conversation?.id, user.id, conversation]);

  const isConversation = (obj) => {
    return obj !== {} && obj !== undefined;
  };

  return (
    <Box className={classes.root}>
      {isConversation(conversation) && conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            {user && (
              <>
                <Messages
                  messages={conversation.messages}
                  messagesLength={conversation.messages.length}
                  otherUser={conversation.otherUser}
                  userId={user.id}
                  filteredSeen={seenMessages}
                  setReadMessage={setReadMessage}
                  conversationId={conversation.id}
                />
                <Input
                  otherUser={conversation.otherUser}
                  conversationId={conversation.id || null}
                  user={user}
                  postMessage={postMessage}
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
