import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  friends: [],
  isLoadingSettings: false,
  inviteModalOpened: false,
  isInvitingFriendLoading: false,
  friendToInvite: {},
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
    default:
      return state;
  }
}
