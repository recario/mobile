import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Button,
  Thumbnail,
  Left,
  Right,
  Body,
  Item,
  ActionSheet,
} from 'native-base';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { mainColor, activeColor } from '../Colors';
import NavigationService from '../services/NavigationService';

import { initiateChatRoom } from '../Chat/chatActions';
import InvitationModal from '../Chat/InvitationModal';

class AskFriend extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      friendToInvite: {}
    }
  }

  onAsk = (userId, name) => this.props.initiateChat(this.props.ad.id, userId, name);

  render() {
    const { currentAdFriends } = this.props;
    const { modalVisible, friendToInvite } = this.state;
    const closeModal = () => this.setState({ modalVisible: false });

    const friends = currentAdFriends.friends;
    const chats = currentAdFriends.chats;

    const notHand1FriendsOfFriends = friends.filter(friend => friend.idx > 1);
    const direct_friend = friends.filter(friend => friend.idx === 1)[0];
    const hasMutualFriends = (friends.length > 1 && direct_friend) || (!direct_friend && friends.length > 0);

    return (
      <View>
        {direct_friend && <Text>Разместил(а) {direct_friend.name}</Text>}

        {hasMutualFriends && notHand1FriendsOfFriends && <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.mutualFriendsContainer}>
          {chats.map(c => <View style={styles.mutualFriendBox} key={c.id}>
              <Thumbnail source={{uri: (c.chat_room_users[1] || c.chat_room_users[0]).avatar}} />
              <Text note style={{fontSize: 10}}>{c.chat_room_users.map(cru => cru.name).join(', ')}</Text>
              <Text note style={{fontSize: 10}}>
                {!c.messages[0].system && `${c.messages[0].user.name}: `}
                {c.messages[0].text.replace(/\n/g, ' ').substring(0,15)}{c.messages[0].text.length > 15 && '...'}
              </Text>
              <Button small block dark style={styles.button} onPress={() => NavigationService.navigate('ChatRoomScreen', { chatId: c.id, title: c.title, friends: friends }) }><Text>Продолжить</Text></Button>
            </View>)}
          {notHand1FriendsOfFriends.map(f =>
            <View style={styles.mutualFriendBox} key={f.id}>
              {f.avatar ? <Thumbnail source={{uri: f.avatar}} /> : <Image style={styles.noAvatar} source={require('../assets/default_avatar.png')} />}
              <Text note style={{fontSize: 10}}>{f.name}</Text>
              <Text note style={{fontSize: 10}}>{f.phone_number}</Text>
              <Button small block dark style={styles.button} onPress={() => this.setState({friendToInvite: f, modalVisible: true}) }><Text>Спросить</Text></Button>
            </View>)}
        </ScrollView>}

        {modalVisible && <InvitationModal friend={friendToInvite} onClose={closeModal} onSubmit={this.onAsk}/>}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initiateChat: (adId, userId, name) => dispatch(initiateChatRoom(adId, userId, name))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AskFriend);

AskFriend.propTypes = {
  ad: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  noAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28
  },
  mutualFriendsTextBlock: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 12
  },
  mutualFriendsContainer: {
    marginTop: 6,
    marginBottom: 6,
    flexDirection: 'row',
  },
  mutualFriendBox: {
    padding: 6,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: mainColor,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 0,
    padding: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hand: {
    fontSize: 12,
    color: activeColor,
  },
  button: {
    backgroundColor: activeColor,
    marginTop: 16,
    alignSelf: 'center'
  }
});
