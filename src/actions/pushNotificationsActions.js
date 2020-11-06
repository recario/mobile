import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import API from '../services/API';
import NavigationService from '../services/NavigationService';
import * as ActionTypes from './actionTypes.js';
import { notification as UINotification } from '../Utils';

export function pushNotificationsSetup() {
  // PushNotificationIOS.addEventListener('registrationError', console.warn)
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(pushToken) {
      API.updateProfile({}, { push_token: pushToken.token, os: pushToken.os });
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {

      goNavigate = () => {
        NavigationService.navigate('ChatRoomScreen', { chatId: notification.data.chat_room_id });
      };

      if (notification.foreground) {
      } else {
        goNavigate();
      }

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: '560444610829',

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true,
  });
}

export function checkPermissions() {
  return function(dispatch) {
    dispatch({ type: ActionTypes.NOTIFICATIONS_PERMISSIONS_STARTED });
    PushNotification.checkPermissions(permissions => {
      if (permissions.alert || permissions.badge || permissions.sound) {
        dispatch({ type: ActionTypes.NOTIFICATIONS_PERMISSIONS_GIVEN });
      } else {
        dispatch({ type: ActionTypes.NOTIFICATIONS_PERMISSIONS_DENIED });
      }
    });
  };
}
