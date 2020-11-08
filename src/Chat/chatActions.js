import PushNotification from 'react-native-push-notification';
import { Clipboard } from 'react-native';
import { ActionSheet } from 'native-base';
import * as ActionTypes from '../actions/actionTypes.js';
import API from '../services/API';
import { notification as UINotification } from '../Utils';
import NavigationService from '../services/NavigationService';
import { serverChannel } from '../services/ServerChannel';
import { displayError } from '../actions/errorsActions';

export function getChatRooms(offset=0) {
  return function(dispatch) {
    dispatch({ type: ActionTypes.GET_CHAT_ROOMS_STARTED });
    API.getChatRooms(offset).then(payload => {
      dispatch({ type: ActionTypes.GET_CHAT_ROOMS_SUCCESS, list: payload.data });
    }).catch(error => {
      displayError(error);
      dispatch({ type: ActionTypes.GET_CHAT_ROOMS_FAILED });
    });
  }
}

export function postMessage(message, chatId) {
  return function(dispatch) {
    message.pending = true;
    message.chat_id = chatId;
    // chat.messages = [message, ...chat.messages];

    dispatch({ type: ActionTypes.POST_MESSAGE, chatId: chatId, message: message });
    serverChannel.chatRoomChannel.send({ message });
  }
}

export function getMessages(chatId, offset=0) {
  return function(dispatch) {
    // dispatch({ type: ActionTypes.SYNC_MESSAGES_STARTED, chat: chat });
    API.getMessages(chatId, offset).then(({ data }) => {
      dispatch({ type: ActionTypes.SYNC_MESSAGES_SUCCESS, chat: data.chat, messages: data.messages });
    });
  }
}

export function initiateChatRoom(adId, userId, name) {
  return function(dispatch) {
    NavigationService.navigate('ChatRoomScreen', { chat: {} });
    API.initiateChatRoom(adId, userId, name).then(({ data }) => {
      dispatch({ type: ActionTypes.GET_AD_FRIENDS_SUCCESS, adFriends: data });
      dispatch({ type: ActionTypes.GET_STARRED_AD_FRIENDS_SUCCESS, adFriends: data });
    });
  }
}

export function getAdFriendsToChat(adId) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.GET_CHAT_AD_FRIENDS_STARTED });

    return API.getAdFriends(adId)
      .then(({data}) => {
        dispatch({ type: ActionTypes.GET_CHAT_AD_FRIENDS_SUCCESS, friends: data.friends });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_CHAT_AD_FRIENDS_FAILED });
        displayError(error);
      });
  }
}

export function addUserToChat(chatId, userId, name) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.GET_CHAT_AD_FRIENDS_STARTED });

    return API.addUserToChat(chatId, userId, name)
      .then(({data}) => {
        dispatch({ type: ActionTypes.GET_CHAT_AD_FRIENDS_SUCCESS, friends: data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_CHAT_AD_FRIENDS_FAILED });
        displayError(error);
      });
  }
}

export function leaveChat(chatRoomId) {
  return (dispatch) => {
    return API.leaveChat(chatRoomId).then(() => {
      NavigationService.popToTop();
      dispatch({ type: ActionTypes.LEAVE_CHAT_SUCCESS, chatRoomId: chatRoomId });
    });
  }
}

export function newMessage(chat, myMessage = false) {
  return (dispatch, getState) => {
    const currentChatId = getState().currentChat.id;
    const currentUserId = getState().user._id;
    if (currentChatId === chat.id) {
      if (chat.messages[0].user._id !== currentUserId) {
        // serverChannel.chatRoomChannel.perform('read');
      }
    } else {
      if (!myMessage && chat.messages[0].user._id !== currentUserId) {
        UINotification.ref.show({ message: { message: chat.messages[0].text, photo: chat.photo, name: chat.messages[0].user?.name }, onPress: () => NavigationService.navigate('ChatRoomScreen', { chat: chat, chatId: chat.id }) });
      }
    }

    dispatch({ type: ActionTypes.POST_MESSAGE_SUCCESS, chat: chat });
  }
}

export function readUpdate(chat) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.MESSAGE_WAS_READ, chat: chat });
  }
}

export function deleteMessage(message) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.MESSAGE_IS_DELETING, message: message });
    serverChannel.chatRoomChannel.perform('destroy', { message: { id: message._id } });
  }
}

export function deleteMessageFinished(id, chat_room_id, updated_at) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.MESSAGE_WAS_DELETED, id: id, chat_room_id: chat_room_id, updated_at: updated_at });
  }
}

export function openFriendPrepare(friend) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.OPEN_FRIEND_PREPARE, friend: friend});
  }
}

export function closeFriendPrepare() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLOSE_FRIEND_PREPARE });
  }
}

export function updateUnread(count) {
  return (dispatch) => {
    PushNotification.setApplicationIconBadgeNumber(count);
    dispatch({ type: ActionTypes.UPDATE_UNREAD_MESSAGES_COUNT, count: count });
  }
}


export function onMessageLongPress(user, message, onDelete) {
  const actions = [{ title: 'Скопировать текст', callback: () => Clipboard.setString(message.text)}];
  let destructiveButtonIndex = null;
  if (user._id === message.user._id) {
    actions.push({title: 'Удалить сообщение', callback: onDelete});
    destructiveButtonIndex = 1;
  }

  const actionSheetOptions = {
    options: [...actions.map(a => a.title), 'Отменить'],
    cancelButtonIndex: (actions.length + 1),
    destructiveButtonIndex: destructiveButtonIndex,
  };

  return ActionSheet.show(actionSheetOptions, (buttonIndex) => actions[buttonIndex]?.callback(message))
}
