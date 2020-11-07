import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Thumbnail } from 'native-base';
import { TouchableOpacity } from 'react-native';

import NavigationService from '../services/NavigationService';

const HeaderActions = ({ chat }) => {
  onPress = () => NavigationService.push('ChatRoomSettingsScreen', { chat: chat });

  return <TouchableOpacity onPress={onPress}>
    <Thumbnail style={styles.carPhoto} source={{ uri: chat.photo }} />
  </TouchableOpacity>
}

function mapStateToProps(state, ownProps) {
  return {
    chat: state.currentChat.chatMetaData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderActions);

const styles = StyleSheet.create({
  carPhoto: {
    width: 32,
    height: 32,
    marginRight: 16,
  }
})
