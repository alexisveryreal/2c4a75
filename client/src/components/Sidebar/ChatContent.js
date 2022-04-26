import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: '#9CADC8',
    letterSpacing: -0.17,
  },
  unreadNotifContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  unreadNotif: {
    display: 'inline-block',
    minWidth: '2em',
    padding: '.1em',
    borderRadius: '50%',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: '#3F92FF',
    color: 'white',
  },
}));

const ChatContent = ({ conversation, hasSeenUnread }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const filterUnread = conversation.messages.filter(
    (message) => message.seen === false && message.senderId === otherUser.id
  );

  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>

      {filterUnread.length > 0 && !hasSeenUnread && (
        <Box className={classes.unreadNotifContainer}>
          <Typography className={classes.unreadNotif}>
            {filterUnread.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
