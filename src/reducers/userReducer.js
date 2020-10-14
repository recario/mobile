import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  name: '',
  avatar: '',
  contactsProcessed: true
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
        name: action.name,
        avatar: action.avatar,
        phoneNumber: action.phone_number,
        userContactsCount: action.user_contacts_count,
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
    default:
      return state;
  }
}