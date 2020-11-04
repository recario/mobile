import React, { useCallback } from 'react';

import NavigationService from '../services/NavigationService';

import {
  Text,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Badge
} from 'native-base';

import dayjs from 'dayjs';

import { activeColor } from '../Colors';

export default function ChatRoomListItem({ chat }) {
  const lastMessage = chat.messages[0];
  const onPress = () => NavigationService.navigate('ChatRoomScreen', { chatId: chat.id, title: chat.title })

  const lastMessageDateString = dayjs(chat.updated_at).isBefore(dayjs()) ? dayjs(chat.updated_at).locale('ru').format('HH:mm') : dayjs(chat.updated_at).locale('ru').format('DD MMM');
  // TODO: something weird on Android when adding new member to chat
  // console.warn(chat.updated_at, dayjs(chat.updated_at), dayjs(chat.updated_at).isBefore(dayjs())) // leads to false
  let messagePreview = lastMessage ? lastMessage.text.replace(/\n/g, ' '): '';
  messagePreview = messagePreview.length > 20 ? `${messagePreview.substring(0,20)}...`: messagePreview

  return <ListItem noIndent thumbnail activeOpacity={1} underlayColor='transparent'  onPress={onPress}>
          <Left>
            <Thumbnail source={{ uri: chat.photo }} style={{borderColor: activeColor, borderWidth: 1}} />
          </Left>
          <Body style={{backgroundColor: 'transparent'}}>
            <Text>{chat.title}</Text>
            {lastMessage?.user?._id && <Text>{lastMessage.user.name}</Text>}

            <Text note>{messagePreview}</Text>
          </Body>
          <Right>
            <Text note>{lastMessageDateString}</Text>
            {chat.new_messages_count > 0 && <Badge style={{backgroundColor: activeColor }}>
              <Text>{chat.new_messages_count}</Text>
            </Badge>}
          </Right>
        </ListItem>
}
