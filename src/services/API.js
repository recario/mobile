import axios from 'axios';
import Qs from 'qs';
import { getUniqueId } from 'react-native-device-info';
import { store } from '../store';
import * as ActionTypes from '../actions/actionTypes';
import { clearAccessToken } from '../AsyncStorage';

let baseURL = '';

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://recar.io/api';
} else {
  baseURL = 'http://192.168.0.100:3000/api';
}

const apiService = axios.create({
  baseURL: baseURL,
  headers: {},
});

apiService.defaults.headers.common['X-User-Access-Token'] = null;

apiService.interceptors.request.use(config => {
  config.paramsSerializer = params => {
    return Qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false
    });
  };

  return config;
});

apiService.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (401 === error.response.status) {
      clearAccessToken();
      API.clearAccessToken();
      store.dispatch({ type: ActionTypes.SIGN_OUT_SUCCESS });
    } else {
      return Promise.reject(error);
    }
  },
);

export default class API {
  static setAccessToken(accessToken) {
    apiService.defaults.headers.common['X-User-Access-Token'] = accessToken;
  }

  static clearAccessToken() {
    apiService.defaults.headers.common['X-User-Access-Token'] = null;
  }

  static getAd(id) {
    return apiService.get(`/v1/ads/${id}`);
  }

  static getAdFriends(id) {
    return apiService.get(`/v2/friendly_ads/${id}`);
  }

  static signIn(phone, code) {
    return apiService.put('/v1/sessions', {
      phone_number: phone,
      verification_code: code,
      device_id: getUniqueId(),
    });
  }

  static requestCode(phone) {
    return apiService.post('/v1/sessions', { phone_number: phone });
  }

  static signOut(all) {
    return apiService.delete('/v1/sessions', { all: !!all });
  }

  static deleteContacts() {
    return apiService.delete('/v1/contact_book');
  }

  static forgot(phone) {
    return apiService.post('/v1/sessions', { phone_number: phone, reset: 1 });
  }

  static updateContacts(contacts) {
    return apiService.put('/v1/contact_book', { contacts: contacts });
  }

  static getFeed(offset=0, filters={}) {
    return apiService.get('/v1/feed_ads', { params: {
        offset: offset,
        filters: filters
      }
    });
  }

  static getVisitedAds(offset=0) {
    return apiService.get(`/v1/visited_ads?offset=${offset}`);
  }

  static getFavoriteAds(offset=0) {
    return apiService.get(`/v1/favorite_ads?offset=${offset}`);
  }

  static getMyAds(offset=0) {
    return apiService.get(`/v1/my_ads?offset=${offset}`);
  }

  static getUserContacts(offset=0, query='') {
    return apiService.get(`/v1/user_contacts?offset=${offset}&query=${query}`);
  }

  static createFeedbackMessage(messageBody) {
    return apiService.post('/v1/messages', { message: messageBody });
  }

  static getProfile() {
    return apiService.get('/v1/user');
  }

  static getFilters() {
    return apiService.get('/filters');
  }

  static updateProfile(userParams={}, deviceParams={}) {
    return apiService.put('/v1/user', { user: userParams, device: deviceParams });
  }

  static likeAd(adId) {
    return apiService.post('/v1/favorite_ads', { id: adId });
  }

  static unlikeAd(adId) {
    return apiService.delete(`/v1/favorite_ads/${adId}`);
  }

  static getChatRooms(offset=0) {
    return apiService.get(`/v1/chat_rooms?offset=${offset}`);
  }

  static initiateChatRoom(adId, userId, name) {
    return apiService.post('/v1/chat_rooms', { ad_id: adId, user_id: userId, name: name });
  }

  static addUserToChat(chatRoomId, userId, name) {
    return apiService.post('/v1/chat_room_users', { chat_room_id: chatRoomId, user_id: userId, name: name });
  }

  static leaveChat(chatRoomId) {
    return apiService.delete(`/v1/chat_room_users/${chatRoomId}`);
  }

  static getMessages(chatId, offset) {
    return apiService.get(`/v1/messages?chat_id=${chatId}&offset=${offset}`)
  }
}
