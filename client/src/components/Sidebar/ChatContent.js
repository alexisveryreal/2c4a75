import React from 'react';
import { Badge, Box, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

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
  previewTextBold: {
    fontSize: 12,
    color: 'black',
    letterSpacing: -0.17,
    fontWeight: 'bold',
  },
}));

const StyledBadge = withStyles(() => ({
  badge: {
    right: 30,
    top: '50%',
  },
}))(Badge);

const ChatContent = ({ conversation, numberUnread }) => {
  const classes = useStyles();

  const { otherUser } = conversation;

  const hasUnread = numberUnread > 0;

  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={hasUnread ? classes.previewTextBold : classes.previewText}
        >
          {latestMessageText}
        </Typography>
      </Box>
      {hasUnread && <StyledBadge badgeContent={numberUnread} color="primary" />}
    </Box>
  );
};

export default ChatContent;
