import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'native-base';
import { StyleSheet } from 'react-native';

export default class AskFriend extends React.PureComponent {
  render() {
    if(!this.props.currentAdFriends) { return(null) }

    const currentAdFriends = this.props.currentAdFriends;
    const notHand1FriendsOfFriends = currentAdFriends.filter(friend => friend.idx > 1);
    const direct_friend = currentAdFriends.filter(friend => friend.idx === 1)[0];
    const hasMutualFriends = (currentAdFriends.length > 1 && direct_friend) || (!direct_friend && currentAdFriends.length > 0);

    return (
      <View>
        {direct_friend && <Text>Разместил(а) {direct_friend.name}</Text>}

        {hasMutualFriends && notHand1FriendsOfFriends &&
          <Text style={styles.mutualFriendsTextBlock}>
            Общие друзья: {notHand1FriendsOfFriends.map(f => f.name).join(', ')}
          </Text>
        }
      </View>
    );
  }
}

AskFriend.propTypes = {
  ad: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  mutualFriendsTextBlock: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 12
  }
});
