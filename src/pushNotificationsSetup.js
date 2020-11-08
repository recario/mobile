import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import NavigationService from './services/NavigationService';
import API from './services/API';
import { setPushToken } from './AsyncStorage';

export default function () {
  PushNotification.createChannel({ channelId: 'messages', channelName: 'Messages Channel'});

  PushNotification.configure({
    onRegister: setPushToken,
    onNotification: function(notification) {
      if(notification.foreground) { return }

      if (Platform.OS === 'ios') {
        NavigationService.navigate('ChatRoomScreen', { chatId: notification.data.chat_room_id });
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      } else {
        if(!notification.userInteraction) {
          PushNotification.localNotification(notification.data);
        } else {
          NavigationService.navigate('ChatRoomScreen', { chatId: notification.chat_room_id });
        }
      }
    },
  });
}