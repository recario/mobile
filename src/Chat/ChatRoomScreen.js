import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Container, Content, Spinner } from 'native-base';

import { SET_CURRENT_CHAT, RESET_CURRENT_CHAT } from '../actions/actionTypes';
import { postMessage, getMessages, deleteMessage, onMessageLongPress } from '../Chat/chatActions';
import { activeColor, darkColor, mainColor, lightColor } from '../Colors';
import { serverChannel } from '../services/ServerChannel';

import { commonGiftedChatOptions } from './commonGiftedChatOptions';

import CurrentChatHeader from './CurrentChatHeader';
import CurrentChatActions from './CurrentChatActions';

function ChatRoomScreen({ user, currentChat, navigation, onSend, onDelete, getMessages, setCurrentChat, resetCurrentChat }) {
  const chatId = navigation.state.params.chatId;
  const chat = currentChat.chatMetaData;

  if (!chatId) { return <SpinnerScreen /> }

  useEffect( () => {
    const focusListener = navigation.addListener('didFocus', onConnect);
    const blurListener = navigation.addListener('didBlur', onDisconnect);

    return () => {
      focusListener.remove();
      blurListener.remove();
    }
  }, []);

  useEffect( () => {
    resetCurrentChat();
    onConnect();
    AppState.addEventListener('change', appStateHandle);
    getMessages(chatId);

    return () => {
      onDisconnect();
      AppState.removeEventListener('change', appStateHandle);
    }
  }, [chatId]);

  const onConnect = () => {
    setCurrentChat(chatId);
    serverChannel.connectToChatRoomChannel(chatId);
    getMessages(chatId);
  }
  const onDisconnect = () => {
    resetCurrentChat();
    serverChannel.disconnectChatRoomChannel();
  }

  const appStateHandle = () => {
    switch(AppState.currentState) {
      case 'inactive':
        onDisconnect();
        break;
      case 'active':
        onConnect();
        break;
    }
  }

  if (!chat.id) { return <SpinnerScreen /> }

  const userName = chat.chat_room_users.filter(cru => cru.user_id === user._id)[0].name;

  const giftedChatOptions = {
    user: {_id: user._id, name: userName},
    messages: currentChat.messages,
    onLoadEarlier: () => getMessages(chatId, currentChat.messages.length),
    loadEarlier: !currentChat.lastLoaded,
    onSend: (message) => onSend(message[0], chatId),
    onLongPress: (context, message) => onMessageLongPress(user, message, onDelete),
  }

  return (
    <Container style={styles.mainContainer}>
      <GiftedChat {...commonGiftedChatOptions} {...giftedChatOptions} />
    </Container>
  )
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    currentChat: state.currentChat,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSend: (message, chatId) => dispatch(postMessage(message, chatId)),
    onDelete: (message) => dispatch(deleteMessage(message)),
    getMessages: (chatId, offset) => dispatch(getMessages(chatId, offset)),
    setCurrentChat: (chatId) => dispatch({ type: SET_CURRENT_CHAT, chatRoomId: chatId }),
    resetCurrentChat: () => dispatch({ type: RESET_CURRENT_CHAT }),
  };
}

ChatRoomScreen.navigationOptions = ({ navigation }) => {
  return({
    headerStyle: {
      backgroundColor: darkColor,
      shadowColor: 'transparent'
    },
    headerTitle: () => <CurrentChatHeader />,
    headerTitleStyle: { color: lightColor },
    headerBackTitle: () => null,
    headerTruncatedBackTitle: () => null,
    headerBackTitleVisible: false,
    headerTintColor: lightColor,
    headerRight: () => <CurrentChatActions />
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  spinnerContainer: {
    backgroundColor: mainColor,
  },
});

const SpinnerScreen = () => {
  return <Container style={styles.spinnerContainer}>
    <Content>
      <Spinner color={activeColor} />
    </Content>
  </Container>
}
