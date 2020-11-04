import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
  Text,
  View,
  Container,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body,
  Icon,
  ActionSheet,
  Button,
  Spinner,
} from 'native-base';

import { activeColor, mainColor } from '../Colors';

import {
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';

import {
  getAdFriendsToChat,
  addUserToChat,
  leaveChat,
  openFriendPrepare,
  closeFriendPrepare,
} from './chatActions';

import { mergeArraysKeepNew } from '../Utils';

import NavigationService from '../services/NavigationService';

import InvitationModal from './InvitationModal';
import AdFriend from './AdFriend';

function ChatRoomsSettingsScreen({ chat, currentChat, navigation, addUserToChat, leaveChat, closeFriendPrepare, openFriendPrepare, getAdFriendsToChat }) {
  if (!chat) { return null }

  const initializeChat = () => {
    getAdFriendsToChat(chat.ad_id);
    const onShow = () => navigation.navigate('VisitedAdScreen', { id: chat.ad_id });
    const onLeave = () => {

      ActionSheet.show({
        options: ['Покинуть чат', 'Отменить'],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        title: `Покинув чат вы потеряете доступ ко всем его сообщениям, пока вас не пригласят обратно оставшиеся участники`
      }, (buttonIndex) => buttonIndex === 0 && leaveChat(chat.id));

    };
    navigation.setParams({ onLeave: onLeave, onShow: onShow });
  };

  useEffect( initializeChat, [chat.id]);

  const { friends, isLoadingSettings } = currentChat;
  const [friendToInvite, setFriendToInvite] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  const openInviteFriendModal = (friend) => {
    setFriendToInvite(friend);
    setModalVisible(true);
  }

  const toDisplay = mergeArraysKeepNew([...friends, ...chat.chat_room_users], it => it.user_id);
  const keyExtractor = (item) => item.user_id.toString();
  const renderItem = ({ item }) => <AdFriend friend={item} chat={chat} openInviteFriendModal={openInviteFriendModal} />
  const addUser = (userId, name) => addUserToChat(chat.id, userId, name);

  return(
    <Container>
      <Image source={{uri: chat.photo}} style={styles.adPhoto}/>
      {isLoadingSettings ? <Spinner color={activeColor} />
                         : <FlatList data={toDisplay}
                                     refreshing={isLoadingSettings}
                                     keyExtractor={keyExtractor}
                                     renderItem={renderItem} />}
      {modalVisible && <InvitationModal friend={friendToInvite} onClose={closeModal} onSubmit={addUser}/>}
    </Container>
  );
}

function mapStateToProps(state, ownProps) {
  const chat = state.chats.list.filter(chat => chat.id === ownProps.navigation.state.params.chat.id)[0];

  return {
    currentChat: state.currentChat,
    chat: chat,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAdFriendsToChat: (adId) => dispatch(getAdFriendsToChat(adId)),
    addUserToChat: (chatId, userId, name) => dispatch(addUserToChat(chatId, userId, name)),
    leaveChat: (chatRoomId) => dispatch(leaveChat(chatRoomId)),
    openFriendPrepare: (friend) => dispatch(openFriendPrepare(friend)),
    closeFriendPrepare: () => dispatch(closeFriendPrepare()),
  };
}

ChatRoomsSettingsScreen.navigationOptions = ({ navigation }) => {
  const { onShow, onLeave } = navigation.state.params;

  return({
    title: '',
    headerTitleStyle: { color: '#fff' },
    headerBackTitle: () => null,
    headerTruncatedBackTitle: () => null,
    headerBackTitleVisible: false,
    headerTintColor: '#fff',
    headerShown: true,
    headerTransparent: true,
    headerRight: () => <View style={styles.actionButtons}>
      <Icon name='car-sport' style={styles.adActionButton} onPress={onShow}/>
      <Icon name='log-out-outline' style={styles.leaveActionButton} onPress={onLeave}/>
    </View>
  });
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingTop: 0,
    padding: 0,
    margin: 0,
  },
  headerBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    color: '#fff',
    position: 'absolute',
    zIndex: 10,
    margin: 0,
  },
  adPhoto: {
    width: '100%',
    height: 350,
    opacity: 0.75,
  },
  actionButtons: {
    flexDirection: 'row'
  },
  adActionButton: {
    paddingRight: 16,
    color: '#fff'
  },
  leaveActionButton: {
    paddingRight: 16,
    color: activeColor
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomsSettingsScreen);
