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

  handleNameChange = ({ nativeEvent: {text} }) => this.props.onUserNameChanged(text)

  handleAvatarChange = () => {
    const { onUserAvatarChanged } = this.props;
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
      onUserAvatarChanged(source);
    });
  }

  onAvatarPress = () => {
    const avatarPresent = this.props.user.avatar && this.props.user.avatar.length > 0;

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
    const { onUserAvatarChanged } = this.props;

    onUserAvatarChanged('');
  }

  render() {
    const { onSignOut, deleteContacts, onRefresh, user } = this.props;
    const refreshControl = <RefreshControl refreshing={false} tintColor={activeColor} onRefresh={onRefresh} />;

    return (
      <Container>
        <Content refreshControl={refreshControl} contentContainerStyle={styles.contentStyle}>
          <View>
            <List>
              <ListItem noBorder>
                <Body style={styles.avatarContainer}>
                  <TouchableOpacity onPress={this.onAvatarPress}>
                    {user.avatar ? <Thumbnail source={{ uri: user.avatar }} /> : <Image style={styles.noAvatar} source={require('../assets/default_avatar.png')} />}
                  </TouchableOpacity>
                  <Text style={styles.phoneNumberText}>{user.phoneNumber}</Text>
                </Body>
              </ListItem>
              <ListItem noIndent>
                <Left>
                  <Input textAlign='center' placeholder='Имя' defaultValue={user.name} onEndEditing={this.handleNameChange} />
                </Left>
              </ListItem>
            </List>

            <List>
              <ListItem style={styles.itemContainer} noIndent onPress={deleteContacts} activeOpacity={1} underlayColor='transparent'>
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
              <ListItem noIndent onPress={onSignOut} activeOpacity={1} underlayColor='transparent'>
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
    user: state.user,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUserNameChanged: (name) => dispatch(updateUserName(name)),
    onUserAvatarChanged: (base64ImageData) => dispatch(updateUserAvatar(base64ImageData)),
    onSignOut: () => dispatch(signOut(false)),
    deleteContacts: () => dispatch(deleteContacts()),
    onRefresh: () => dispatch(getProfile())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

ProfileScreen.propTypes = {
};


styles = StyleSheet.create({
  noAvatar: {
    width: 56,
    height: 56,
    borderRadius: 32
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
