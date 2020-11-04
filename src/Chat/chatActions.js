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

export function postMessage(message, chat) {
  message.pending = true;
  message.chat_id = chat.id;
  chat.messages = [message, ...chat.messages];

  return function(dispatch) {
    dispatch({ type: ActionTypes.POST_MESSAGE, chat: chat });
    serverChannel.chatRoomChannel.send({ message: message });
  }
}

export function getMessages(chat, offset=0) {
  return function(dispatch) {
    // dispatch({ type: ActionTypes.SYNC_MESSAGES_STARTED, chat: chat });
    API.getMessages(chat.id, offset).then(payload => {
      dispatch({ type: ActionTypes.SYNC_MESSAGES_SUCCESS, chat: payload.data });
    });
  }
}

export function initiateChatRoom(adId, userId, name) {
  return function(dispatch) {
    NavigationService.navigate('ChatRoomScreen', { chat: {} });
    API.initiateChatRoom(adId, userId, name).then(payload => {
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
    const currentChatId = getState().user.currentChatId;
    const currentUserId = getState().user._id;
    if (currentChatId === chat.id) {
      if (chat.messages[0].user._id !== currentUserId) {
        serverChannel.chatRoomChannel.perform('read');
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
