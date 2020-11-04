import * as ActionTypes from './actionTypes.js';
import API from '../services/API';
import { displayError } from '../actions/errorsActions';

import NavigationService from '../services/NavigationService';

export function loadAd(id) {
  return function(dispatch, getState) {
    const shouldReset = getState().feedAd.currentAd.id !== id;

    dispatch({ type: ActionTypes.GET_AD_STARTED, reset: shouldReset });
    dispatch(getAdFriends(id));
    return API.getAd(id)
      .then(adPayload => {
        dispatch({ type: ActionTypes.GET_AD_SUCCESS, ad: adPayload.data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_AD_FAILED });
        displayError(error);
        NavigationService.popToTop();
      });
  };
}

export function loadAdToStarred(id) {
  return function(dispatch, getState) {
    const shouldReset = getState().starredAd.currentAd.id !== id;

    dispatch({ type: ActionTypes.GET_STARRED_AD_STARTED, reset: shouldReset });
    dispatch(getAdFriendsToStarred(id));
    return API.getAd(id)
      .then(adPayload => {
        dispatch({ type: ActionTypes.GET_STARRED_AD_SUCCESS, ad: adPayload.data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_STARRED_AD_FAILED });
        displayError(error);
        NavigationService.popToTop();
      });
  };
}

export function getAdFriends(adId) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.GET_AD_FRIENDS_STARTED });

    return API.getAdFriends(adId)
      .then(adFriendsPayload => {
        dispatch({ type: ActionTypes.GET_AD_FRIENDS_SUCCESS, adFriends: adFriendsPayload.data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_AD_FRIENDS_FAILED });
        displayError(error);
      });
  }
}

export function getAdFriendsToStarred(adId) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.GET_STARRED_AD_FRIENDS_STARTED });

    return API.getAdFriends(adId)
      .then(adFriendsPayload => {
        dispatch({ type: ActionTypes.GET_STARRED_AD_FRIENDS_SUCCESS, adFriends: adFriendsPayload.data });
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_STARRED_AD_FRIENDS_FAILED });
        displayError(error);
      });
  }
}
