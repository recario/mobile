import PushNotification from 'react-native-push-notification';
import * as ActionTypes from '../actions/actionTypes.js';
import API from '../services/API';
import { displayError } from '../actions/errorsActions';

export function getProfile () {
  return function (dispatch) {
    dispatch({ type: ActionTypes.GET_PROFILE_STARTED });
    return API.getProfile()
      .then(payload => {
        PushNotification.setApplicationIconBadgeNumber(payload.data.unread_messages_count);
        dispatch({ type: ActionTypes.GET_PROFILE_SUCCESS, user: payload.data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_PROFILE_FAILED });
        displayError(error);
      });
  }
}

export function updateUserName(name) {
  return function (dispatch) {
    dispatch({ type: ActionTypes.UPDATE_PROFILE_STARTED });
    return API.updateProfile({ name: name })
      .then(payload => {
        dispatch({ type: ActionTypes.GET_PROFILE_SUCCESS, user: payload.data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.UPDATE_PROFILE_FAILED });
        displayError(error);
      });
  }
}

export function updateUserAvatar(base64ImageData) {
  return function (dispatch) {
    const params = base64ImageData.length ? { avatar: base64ImageData } : { remove_avatar: true }

    dispatch({ type: ActionTypes.UPDATE_PROFILE_STARTED });

    return API.updateProfile(params)
      .then(payload => {
        dispatch({ type: ActionTypes.GET_PROFILE_SUCCESS, user: payload.data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.UPDATE_PROFILE_FAILED });
        displayError(error);
      });
  }
}
