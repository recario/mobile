import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

import { InputToolbar, Send, LoadEarlier } from 'react-native-gifted-chat';

import ru from 'dayjs/locale/ru';

import { activeColor, darkColor, mainColor, lightColor } from '../Colors';


const renderLoadEarlier = (props) => <LoadEarlier label='Загрузить еще...' {...props}/>

const renderInputToolbar = (props) => <InputToolbar {...props} textInputStyle={styles.textInput} containerStyle={styles.inputToolbarContainer}/>

const renderSend = (props) => <Send {...props} containerStyle={styles.sendContainer}>
    <Icon name='paper-plane' style={styles.sendButton} />
  </Send>


export const commonGiftedChatOptions = {
    ...(Platform.OS === 'ios' && { bottomOffset: 31.5 }),
    infiniteScroll: true,
    maxInputLength: 200,
    placeholder: 'Сообщение...',
    renderUsernameOnMessage: true,
    locale: ru,
    listViewProps: {
      style: {
        backgroundColor: mainColor
      },
      keyboardDismissMode: 'on-drag',
    },
    renderLoadEarlier,
    renderInputToolbar,
    renderSend,
}


const styles = StyleSheet.create({
  inputToolbarContainer: {
    backgroundColor: darkColor,
    borderBottomWidth: 1,
    borderTopWidth: 0.2,
    borderBottomColor: mainColor,
    borderTopColor: lightColor
  },
  textInput: {
    color: lightColor
  },
    sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingRight: 12
  },
    sendButton: {
    color: activeColor,
    fontWeight: 'bold',
  },
})
