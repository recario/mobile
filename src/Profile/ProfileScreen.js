import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Text,
  Container,
  Content,
  Button,
  List,
  ListItem,
  Input,
  Form,
  Thumbnail,
  Left,
  Right,
  Body,
  Icon,
  View,
  ActionSheet
} from 'native-base';

import { TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import { updateUserName, updateUserAvatar, getProfile } from './profileActions';

import { signOut } from '../actions/sessionsActions';

import { deleteContacts } from '../UserContacts/userContactsActions';

import { onTosPress, onPrivacyPress } from '../Utils';

import { activeColor, lightColor, mainColor } from '../Colors';

class ProfileScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return({ header: () => null });
  }

  handleNameChange = ({ nativeEvent: {text} }) => this.props.onUserNameChangedDispatched(text)

  handleAvatarChange = () => {
    const { onUserAvatarChangedDispatched } = this.props;
    const options = {
      width: 256,
      height: 256,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.8,
      writeTempFile: false,
      mediaType: 'photo',
      forceJpg: true
    };

    ImagePicker.openPicker(options).then(image => {
      const source = `data:${image.mime};base64,${image.data}`;
      onUserAvatarChangedDispatched(source);
    });
  }

  onAvatarPress = () => {
    const avatarPresent = this.props.userAvatar && this.props.userAvatar.length > 0;

    ActionSheet.show(
      {
        options: avatarPresent ? ['Выбрать из галереи...', 'Удалить', 'Отменить'] : ['Выбрать из галереи...', 'Отменить'],
        cancelButtonIndex: avatarPresent ? 2 : 1,
        destructiveButtonIndex: avatarPresent ? 1 : null
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0: return this.handleAvatarChange()
          case 1: return avatarPresent ? this.handleAvatarRemove() : null
        }
      }
    )
  }

  handleAvatarRemove = () => {
    const { onUserAvatarChangedDispatched } = this.props;

    onUserAvatarChangedDispatched('');
  }

  render() {
    const { onSignOutDispatched, deleteContactsDispatched, userName, userAvatar, phoneNumber, onRefreshDispatched } = this.props;
    const refreshControl = <RefreshControl refreshing={false} tintColor={activeColor} onRefresh={onRefreshDispatched} />;

    return (
      <Container>
        <Content refreshControl={refreshControl} contentContainerStyle={styles.contentStyle}>
          <View>
            <List>
              <ListItem noBorder>
                <Body style={styles.avatarContainer}>
                  <TouchableOpacity onPress={this.onAvatarPress}>
                    {userAvatar ? <Thumbnail source={{ uri: userAvatar }} /> : <Image style={styles.noAvatar} source={require('../assets/default_avatar.png')} />}
                  </TouchableOpacity>
                  <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
                </Body>
              </ListItem>
              <ListItem noIndent>
                <Left>
                  <Input textAlign='center' placeholder='Имя' defaultValue={userName} onEndEditing={this.handleNameChange} />
                </Left>
              </ListItem>
            </List>

            <List>
              <ListItem style={styles.itemContainer} noIndent onPress={deleteContactsDispatched} activeOpacity={1} underlayColor='transparent'>
                <Left><Text>Книга контактов</Text></Left>
                <Right><Text style={styles.activeColor}>Удалить</Text></Right>
              </ListItem>
            </List>
            <Text style={styles.noteText}>Не забудьте отключить доступ к контактам в настройках телефона, если хотите чтобы контакты не были синхронизированы повторно после удаления.</Text>
          </View>


          <View style={styles.bottomItemsContainer}>
            <List style={styles.bottomList}>
              <ListItem noIndent onPress={onPrivacyPress} activeOpacity={1} underlayColor='transparent'>
                <Left><Text style={styles.bottomLinks}>О конфиденциальности</Text></Left>
                <Right>
                  <Icon name='open-outline' />
                </Right>
              </ListItem>
              <ListItem noIndent onPress={onTosPress} activeOpacity={1} underlayColor='transparent'>
                <Left><Text style={styles.bottomLinks}>Условия использования</Text></Left>
                <Right>
                  <Icon name='open-outline' />
                </Right>
              </ListItem>
              <ListItem noIndent onPress={onSignOutDispatched} activeOpacity={1} underlayColor='transparent'>
                <Left><Text style={styles.activeColor}>Выход</Text></Left>
                <Right>
                  <Icon name='log-out-outline' style={styles.activeColor} />
                </Right>
              </ListItem>
            </List>
          </View>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    userName: state.user.name,
    userAvatar: state.user.avatar,
    phoneNumber: state.user.phoneNumber
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUserNameChangedDispatched: (name) => dispatch(updateUserName(name)),
    onUserAvatarChangedDispatched: (base64ImageData) => dispatch(updateUserAvatar(base64ImageData)),
    onSignOutDispatched: () => dispatch(signOut(false)),
    deleteContactsDispatched: () => dispatch(deleteContacts()),
    onRefreshDispatched: () => dispatch(getProfile())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

ProfileScreen.propTypes = {
};


styles = StyleSheet.create({
  noAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: '#555',
    borderWidth: 2
  },
  contentStyle:{
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 32
  },
  avatarContainer: {
    alignItems: 'center'
  },
  phoneNumberText: {
    color: '#666',
    fontSize: 14,
    marginTop: 12
  },
  noteText: {
    fontSize: 12,
    color: lightColor,
    padding: 16
  },
  itemContainer: {
    backgroundColor: mainColor
  },
  activeColor: {
    color: activeColor
  },
  bottomItemsContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 48
  },
  bottomList: {
    backgroundColor: '#222',
    borderTopWidth: 0.5,
    borderTopColor: '#c9c9c9'
  }
});
