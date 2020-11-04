import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  name: '',
  avatar: '',
  contactsProcessed: true,
  unreadMessagesCount: 0
}

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.GET_PROFILE_STARTED:
      return {
        ...state,
        isLoading: true
      }
    case ActionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        _id: action.user.id,
        name: action.user.name,
        avatar: action.user.avatar,
        phoneNumber: action.user.phone_number,
        userContactsCount: action.user.user_contacts_count,
        unreadMessagesCount: action.user.unread_messages_count,
        isLoading: false
      }
    case ActionTypes.GET_PROFILE_FAILED:
      return {
        ...state,
        isLoading: false
      }
    case ActionTypes.DELETE_CONTACTS_SUCCESS:
      return {
        ...state,
        userContactsCount: 0,
        contactsProcessed: true
      }
    case ActionTypes.UPDATE_CONTACTS_STARTED:
      return {
        ...state,
        contactsProcessed: false
      }
    case ActionTypes.UPDATE_CONTACTS_FINISHED:
      return {
        ...state,
        contactsProcessed: true
      }
    case ActionTypes.UPDATE_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        unreadMessagesCount: action.count,
      }
    default:
      return state;
  }
}
