import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Platform, TouchableOpacity, AppState, Clipboard } from 'react-native';
import {
  GiftedChat,
  InputToolbar,
  Send,
  LoadEarlier
} from 'react-native-gifted-chat';
import {
  View,
  Container,
  Content,
  Text,
  Spinner,
  Icon,
  Thumbnail,
  ActionSheet,
} from 'native-base';

import { SET_CURRENT_CHAT } from '../actions/actionTypes';
import { postMessage, getMessages, deleteMessage } from '../Chat/chatActions';
import { activeColor, darkColor, mainColor, lightColor } from '../Colors';
import { decOfNum } from '../Utils';
import { serverChannel } from '../services/ServerChannel';

import ru from 'dayjs/locale/ru';

function ChatRoomScreen({ user, chat, messages, onSend, onDelete, navigation, getMessages, setCurrentChat, removeCurrentChat }) {
  if (!chat?.id) { return <SpinnerScreen /> }

  useEffect( () => {
    const focusListener = navigation.addListener('didFocus', onConnect);
    const blurListener = navigation.addListener('didBlur', onDisconnect);

    return () => {
      focusListener.remove();
      blurListener.remove();
    }
  }, []);

  useEffect( () => {
    onConnect();
    AppState.addEventListener('change', appStateHandle);
    getMessages(chat);
    navigation.setParams({ chat: chat, friends: navigation.state.params.friends });

    return () => {
      onDisconnect();
      AppState.removeEventListener('change', appStateHandle);
    }
  }, [chat.id]);

  useEffect( () => {
    navigation.setParams({ chat });
  }, [chat]);

  const onConnect = () => {
    setCurrentChat(chat.id);
    serverChannel.connectToChatRoomChannel(chat.id);
    getMessages(chat);
  }
  const onDisconnect = () => {
    removeCurrentChat();
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

  const userName = chat.chat_room_users.filter(cru => cru.user_id === user._id)[0].name;

  return (
    <Container style={styles.mainContainer}>
      <GiftedChat
        messages={messages}
        onLoadEarlier={() => getMessages(chat, chat.messages.length)}
        infiniteScroll
        loadEarlier={chat.synced && !chat.lastLoaded}
        renderLoading={() => <SpinnerScreen />}
        renderLoadEarlier={(props) => <LoadEarlier label='Загрузить еще...' {...props}/>}
        onSend={(message) => onSend(message[0], chat)}
        user={{_id: user._id, name: userName}}
        maxInputLength={200}
        placeholder={'Сообщение...'}
        renderUsernameOnMessage={true}
        renderInputToolbar={(props) => <InputToolbar {...props} textInputStyle={styles.textInput} containerStyle={styles.inputToolbarContainer}/>}
        renderSend={(props) => <CustomSendButton {...props} />}
        listViewProps={listViewProps}
        locale={ru}
        bottomOffset={Platform.OS === "ios" && 31.5}
        onLongPress={(context, message) => messageActions(user, message, onDelete)}
      />
    </Container>
  )
}

function mapStateToProps(state, ownProps) {
  const chat = state.chats.list.filter(chat => chat.id === ownProps.navigation.state.params.chatId)[0];
  return {
    chat: chat,
    user: state.user,
    messages: state.currentChat.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSend: (message, chat) => dispatch(postMessage(message, chat)),
    onDelete: (message) => dispatch(deleteMessage(message)),
    getMessages: (chat, offset) => dispatch(getMessages(chat, offset)),
    setCurrentChat: (chatRoomId) => dispatch({ type: SET_CURRENT_CHAT, chatRoomId: chatRoomId }),
    removeCurrentChat: () => dispatch({ type: SET_CURRENT_CHAT, chatRoomId: undefined })
  };
}

ChatRoomScreen.navigationOptions = ({ navigation }) => {
  const chat = navigation.state.params.chat;
  const friends = navigation.state.params.friends;

  const onPress = () => navigation.push('ChatRoomSettingsScreen', { chat: chat, friends: friends });

  return({
    title: chat?.title,
    headerStyle: {
      backgroundColor: darkColor,
      borderColor: 'red',
      shadowColor: 'transparent'
    },
    headerTitle: () => chat && <HeaderTitle chat={chat} onPress={onPress}/>,
    headerTitleStyle: { color: lightColor },
    headerBackTitle: () => null,
    headerTruncatedBackTitle: () => null,
    headerBackTitleVisible: false,
    headerTintColor: lightColor,
    headerRight: () => chat && <HeaderRight chat={chat} onPress={onPress}/>
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
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
  spinnerContainer: {
    backgroundColor: mainColor
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingRight: 12
  },
  chatUser: {
    backgroundColor: 'red',
    marginRight: 16,
    padding: 8,
    height: 48
  },
  sendButton: {
    color: activeColor,
    fontWeight: 'bold',
  },
  centered: {
    alignItems: 'center'
  },
  carPhoto: {
    width: 32,
    height: 32,
    marginRight: 16
  }
});

const HeaderTitle = ({ chat, onPress }) => {
  const chatRoomUsersCount = chat.chat_room_users?.length || 0;
  const membersWord = decOfNum(chatRoomUsersCount, ['участник', 'участника', 'участников']);

  return <TouchableOpacity onPress={onPress}>
    <View style={styles.centered}>
      <Text>{chat.title}</Text>
      {chatRoomUsersCount > 0 && <Text>{chatRoomUsersCount} {membersWord}</Text>}
    </View>
  </TouchableOpacity>
}

const HeaderRight = ({ chat, onPress }) => {
  return <TouchableOpacity onPress={onPress}>
    <Thumbnail style={styles.carPhoto} source={{ uri: chat.photo }} />
  </TouchableOpacity>
}

const SpinnerScreen = () => {
  return <Container style={styles.spinnerContainer}>
    <Content>
      <Spinner color={activeColor} />
    </Content>
  </Container>
}

const CustomSendButton = (props) => {
  return <Send {...props} containerStyle={styles.sendContainer}>
    <Icon name='paper-plane' style={styles.sendButton} />
  </Send>
}

const messageActions = (user, message, onDelete) => {
  const actions = [{ title: 'Скопировать текст', callback: () => Clipboard.setString(message.text)}];
  let destructiveButtonIndex = null;
  if (user._id === message.user._id) {
    actions.push({title: 'Удалить сообщение', callback: onDelete});
    destructiveButtonIndex = 1;
  }

  const actionSheetOptions = {
    options: [...actions.map(a => a.title), 'Отменить'],
    cancelButtonIndex: (actions.length + 1),
    destructiveButtonIndex: destructiveButtonIndex,
  };



  return ActionSheet.show(actionSheetOptions, (buttonIndex) => actions[buttonIndex]?.callback(message))
}

const listViewProps = {
  style: {
    backgroundColor: mainColor
  },
  keyboardDismissMode: 'on-drag',
}
