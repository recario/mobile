import React from 'react';

import {
  Text,
  Icon,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';

import { activeColor } from '../Colors';

export default function AdFriend({ friend, chat, openInviteFriendModal }) {
  const membersIds = chat.chat_room_users.map(cru => cru.user_id);
  const addUserToChatRoom = (userId) => {
    if (!userId || membersIds.includes(userId)) { return; }

    openInviteFriendModal(friend);
  };

  return <ListItem thumbnail activeOpacity={1} underlayColor='transparent' onPress={() => addUserToChatRoom(friend.user_id)}>
    {friend.user_id && <Left>
      {friend.avatar ? <Thumbnail source={{ uri: friend.avatar }} /> : <DefaultAvatar />}
    </Left>}
    <Body>
      <Text style={friend.user_id && membersIds.includes(friend.user_id) ? {color: activeColor} : {}}>{friend.name}</Text>
      <Text note>{friend.phone_number}</Text>
    </Body>
    {friend.user_id && !membersIds.includes(friend.user_id) && <Right>
      <Icon name='add-circle-outline' />
    </Right>}
  </ListItem>
};

const DefaultAvatar = () => <Thumbnail source={require('../assets/default_avatar.png')} />;
