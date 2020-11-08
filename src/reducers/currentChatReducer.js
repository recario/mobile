import * as ActionTypes from '../actions/actionTypes';

import { mergeArraysKeepNew } from '../Utils';

const initialState = {
  friends: [],
  isLoadingSettings: false,
  messages: [],
  lastLoaded: false,
  chatMetaData: {
    chat_room_users: []
  }
}

export default function currentChatReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.GET_CHAT_AD_FRIENDS_STARTED:
      return {
        ...state,
        isLoadingSettings: true
      }
    case ActionTypes.GET_CHAT_AD_FRIENDS_FAILED:
      return {
        ...state,
        isLoadingSettings: false
      }
    case ActionTypes.GET_CHAT_AD_FRIENDS_SUCCESS:
      return {
        ...state,
        friends: action.friends,
        isLoadingSettings: false
      }
    case ActionTypes.CLOSE_FRIEND_PREPARE:
      return {
        ...state,
        friendToInvite: {},
        inviteModalOpened: false,
        isInvitingFriendLoading: false,
      }
    case ActionTypes.OPEN_FRIEND_PREPARE:
      return {
        ...state,
        friendToInvite: action.friend,
        inviteModalOpened: true,
        isInvitingFriendLoading: false
      }
    case ActionTypes.SET_CURRENT_CHAT:
      return {
        ...state,
        id: action.chatRoomId
      }
    case ActionTypes.ADD_MESSAGES:
      return {
        ...state,
        messages: action.messages
      }
    case ActionTypes.POST_MESSAGE:
      return {
        ...state,
        messages: mergeArraysKeepNew([...state.messages, action.message], it => it._id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
    case ActionTypes.POST_MESSAGE_SUCCESS:
      if (action.chat.id !== state.id) {
        return state;
      }
      return {
        ...state,
        messages: mergeArraysKeepNew([...state.messages, ...action.chat.messages], it => it._id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
    case ActionTypes.SYNC_MESSAGES_SUCCESS:
      return {
        ...state,
        lastLoaded: (action.messages.length < 20),
        chatMetaData: action.chat,
        messages: mergeArraysKeepNew([...state.messages, ...action.messages], it => it._id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
    case ActionTypes.MESSAGE_WAS_DELETED:
      if (state.id !== action.chat_room_id) {
        return state;
      } else {
        return {
          ...state,
          messages: state.messages.filter(m => m._id !== action.id)
        }
      }
    case ActionTypes.MESSAGE_IS_DELETING:

      if (action.message.chat_id !== state.id) {
        return state;
      } else {
        return {
          ...state,
          messages: state.messages.map(m => m._id === action.message._id ? {...m, pending: true} : m)
        }
      }
    case ActionTypes.RESET_CURRENT_CHAT:
      return {
        ...state,
        messages: [],
        chatMetaData: {
          chat_room_users: []
        }
      }
    default:
      return state;
  }
}
