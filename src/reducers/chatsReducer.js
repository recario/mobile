import * as ActionTypes from '../actions/actionTypes';
import equal from 'react-fast-compare';
import { mergeArraysKeepNew } from '../Utils';

const initialState = { list: [], isLoading: false };

export default function chatsReducer(state = initialState, action = {}) {
  switch(action.type) {
    case ActionTypes.GET_CHAT_ROOMS_STARTED:
      return {
        ...state,
        isLoading: true
      }
    case ActionTypes.GET_CHAT_ROOMS_FAILED:
      return {
        ...state,
        isLoading: false
      }
    case ActionTypes.GET_CHAT_ROOMS_SUCCESS:
      const newList = mergeArraysKeepNew([...state.list, ...action.list], it => it.id).sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));

      return {
        ...state,
        list: (equal(state.list, newList) ? state.list : newList),
        isLoading: false
      };
    case ActionTypes.POST_MESSAGE_SUCCESS:
      return {
        ...state,
        list: newChatList(state.list, action.chat)
      }
    case ActionTypes.LEAVE_CHAT_SUCCESS:
      return {
        ...state,
        list: state.list.filter(c => c.id !== action.chatRoomId)
      }
    case ActionTypes.MESSAGE_WAS_READ:
      return {
        ...state,
        list: newChatList(state.list, action.chat)
      }
    case ActionTypes.MESSAGE_IS_DELETING:
      const chat = state.list.filter(c => c.id === action.message.chat_id)[0];
      chat.messages = chat.messages.map(m => m._id === action.message._id ? {...m, pending: true} : m);

      return {
        ...state,
        list: newChatList(state.list, chat)
      }
    case ActionTypes.MESSAGE_WAS_DELETED:
      const ccc = state.list.filter(c => c.id === action.chat_room_id)[0];
      ccc.messages = ccc.messages.filter(m => m._id !== action.id);
      ccc.updated_at = action.updated_at;

      return {
        ...state,
        list: newChatList(state.list, ccc)
      }
    case ActionTypes.SYNC_MESSAGES_SUCCESS:
      return {
        ...state,
        list: newChatList(state.list, action.chat)
      }
    default:
      return state
  }
}

function newChatList(oldChatList, newChat) {
  return mergeArraysKeepNew([...oldChatList, newChat], it => it.id).sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))
}
