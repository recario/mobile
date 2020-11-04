import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { 
  Text,
  View,
  Icon,
  Thumbnail,
  Item,
  Input,
  Button,
} from 'native-base';

import { updateUserName } from '../Profile/profileActions';

import { lightColor, activeColor, mainColor } from '../Colors';

function InvitationModal({user, updateUserName, friend, onClose, onSubmit}) {
  const [name, setName] = useState(friend.name);
  const [userName, setUserName] = useState();
  const possibleIntroNames = [friend.user_name, friend.name].filter(n => n && n.length);
  const onFinish = () => {
    onSubmit(friend.user_id, name);
    onClose();
  }
  const userNamePresent = !!user.name?.length;
  useEffect(() => setName(friend.name), [friend.name]);
  return <Modal animationType='slide' transparent={true} visible={true}>
    <KeyboardAwareScrollView contentContainerStyle={styles.modalWrapper}>
      <TouchableOpacity style={styles.emptyArea} onPress={onClose}></TouchableOpacity>
      <View style={styles.wrp}>
        <View style={styles.modalControlsContainer}>
          <Icon name='close-outline' onPress={onClose} style={styles.closeIcon}/>
        </View>

        <View style={{paddingHorizontal: 12, flexDirection: 'column'}}>
          <Thumbnail source={{ uri: friend.avatar }} style={{alignSelf: 'center'}}/>
          <Text style={{color: lightColor, alignSelf: 'center', textAlign: 'center'}}>
            {friend.name}
            {"\n"}
            {friend.phone_number}
          </Text>
          {!userNamePresent && <View style={{backgroundColor: '#8D021F', padding: 8, borderRadius: 8, marginTop: 16 }}>
            <Text>Чтобы начать чать, пожалуйста, укажите, как другие участники могут к вам обращаться:</Text>
            <Item>
              <Input value={userName} onChangeText={setUserName} placeholder='Ваше имя' placeholderTextColor="#aaaaaa"/>
            </Item>
            <Button disabled={!userName || !userName.length} block light onPress={() => updateUserName(userName)} style={{marginTop: 16}}>
              <Text>Готово</Text>
            </Button>
          </View>}
          <Text style={{marginVertical: 16}}>
            Имя для других участников чата:
          </Text>

          {possibleIntroNames.map(n => <TouchableOpacity key={n} onPress={() => setName(n)}>
            <View style={{flexDirection: 'row', paddingVertical: 8}}>
              <Icon name={name === n ? 'ellipse' : 'ellipse-outline'} style={{fontSize: 18, marginRight: 8}} />
              <Text>{n}</Text>
            </View>
          </TouchableOpacity>)}

          <Item>
            <Input defaultValue={name || friend.user_name || friend.name} name={name} onChangeText={setName} placeholder='Представьте друга...' />
          </Item>

          <Button disabled={!userNamePresent} block dark style={{backgroundColor: (userNamePresent ? activeColor : 'grey'), marginVertical: 36}} onPress={onFinish}>
            <Text>Добавить</Text>
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  </Modal>
}

const styles = StyleSheet.create({
  modalControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  closeIcon: {
    alignSelf: 'flex-start',
    color: '#c9c9c9',
    fontSize: 48,
    fontWeight: 'bold',
  },
  modalWrapper: {
    backgroundColor: 'transparent',

    flex: 1,
    justifyContent: 'flex-end',
  },
  wrp: {
    backgroundColor: mainColor,
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },emptyArea: {
    height: '100%'
  }
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUserName: (name) => dispatch(updateUserName(name)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitationModal);