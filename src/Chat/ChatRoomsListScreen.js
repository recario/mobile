import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { FlatList, SafeAreaView, RefreshControl } from 'react-native';

import { Text, Container, List } from 'native-base';

import ChatRoomListItem from './ChatRoomListItem';

import { activeColor } from '../Colors';

import { getChatRooms } from './chatActions';

import ListNotFound from '../ListNotFound';

function ChatRoomsListScreen({ chats, isLoading, getChatRoomsWithOffset }) {
  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const onEndReached = useCallback( () => {
    getChatRoomsWithOffset(chats.length);
  }, []);


  const renderItem = ({ item, index }) => <ChatRoomListItem chat={item} />

  if (chats.length === 0) { return <ListNotFound refreshControl={<RefreshControl refreshing={isLoading} tintColor={activeColor} onRefresh={onEndReached} />} /> }

  return(
    <Container>
      <SafeAreaView style={{flex: 1}}>
        <FlatList data={chats}
                  refreshing={isLoading}
                  keyExtractor={keyExtractor}
                  onEndReached={onEndReached}
                  renderItem={renderItem} />
      </SafeAreaView>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    chats: state.chats.list,
    isLoading: state.chats.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getChatRoomsWithOffset: (offset) => dispatch(getChatRooms(offset))
  };
}

ChatRoomsListScreen.navigationOptions = ({ navigation }) => {
    return({ title: 'Чаты', headerShown: false });
  }

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomsListScreen);

