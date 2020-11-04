import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import { View, Text, Button } from 'native-base';

import ContactsUploading from './ContactsUploading';

import { checkContactsPermissions, requestContactsPermissions } from '../actions/userContactsActions';

import * as ActionTypes from '../actions/actionTypes.js';

import { goToSettings } from '../Utils';

import { activeColor, mainColor } from '../Colors';

class PermissionsBox extends React.PureComponent {
  onPress = () => this.props.permissionsRequested ? goToSettings() : this.props.requestContactsPermissions()

  componentDidMount() {
    this.props.checkContactsPermissions();
  }
  render() {
    const { permissionsGiven, permissionsRequested, checkContactsPermissions, userContactsCount, userContactsProcessed } = this.props;

    if (permissionsGiven && permissionsRequested) {
      if (userContactsCount === 0 && !userContactsProcessed) {
        return <ContactsUploading />;
      } else {
        return null;
      }
    }

    return (
      <View style={styles.mainContainer}>
        <Text>
          Приложению нужен доступ к вашему списку контактов для того, чтобы вы могли найти друзей и знакомых, продающих
          машину
        </Text>
        {
          <Button block style={styles.button} onPress={this.onPress}>
            <Text>Предоставить</Text>
          </Button>
        }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    permissionsGiven: state.userContacts.permissionsGiven,
    permissionsRequested: state.userContacts.permissionsRequested,
    userContactsCount: state.user.userContactsCount,
    userContactsProcessed: state.user.contactsProcessed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkContactsPermissions: () => dispatch(checkContactsPermissions()),
    requestContactsPermissions: () => dispatch(requestContactsPermissions()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsBox);

PermissionsBox.propTypes = {};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: mainColor,
    margin: 12,
    padding: 12,
    borderColor: activeColor,
    borderWidth: 2,
    borderRadius: 4
  },
  button: {
    marginTop: 12,
    backgroundColor: activeColor
  }
})