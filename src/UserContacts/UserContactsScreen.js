import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Item, Icon, Input, Text, Fab } from 'native-base';
import { StyleSheet, Platform } from 'react-native';

import UserContactsList from './UserContactsList';

import { loadMoreUserContacts, getAll, updateQuery } from './userContactsActions';

import { filterByContact } from '../Feed/feedActions';
import PermissionsBox from '../Feed/PermissionsBox';

import { darkColor, mainColor } from '../Colors';

class UserContactsScreen extends React.PureComponent {
  typingTimer = null;
  static navigationOptions = ({ navigation }) => {
    return({ header: () => null });
  }

  resetQuery = () => this.props.updateQuery('')

  render() {
    const { userContacts, isLoading, query, updateQuery, loadMoreUserContacts, onRefresh, filterByContact } = this.props;
    const onUpdateQuery = (query) => {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => updateQuery(query), 200);
    }

    return (
      <Container>
        <Header style={styles.mainHeader} iosBarStyle='light-content' searchBar>
          <Item style={styles.searchBar}>
            <Icon name='ios-search' style={styles.searchIcon}/>
            <Input placeholder='Поиск' style={styles.inputTextColor} onChangeText={onUpdateQuery} defaultValue={query}/>
            {query.length > 0 && <Icon name='close-circle' style={styles.inputTextColor} onPress={this.resetQuery}/>}
          </Item>
        </Header>
        <PermissionsBox />
        <UserContactsList
          userContacts={userContacts}
          filterByContact={filterByContact}
          isLoading={isLoading}
          loadMoreUserContacts={loadMoreUserContacts}
          onRefresh={onRefresh}/>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    userContacts: state.userContacts.list,
    query: state.userContacts.query,
    isLoading: state.userContacts.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMoreUserContacts: () => dispatch(loadMoreUserContacts()),
    onRefresh: () => dispatch(getAll()),
    filterByContact: (name) => dispatch(filterByContact(name)),
    updateQuery: (query) => dispatch(updateQuery(query))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContactsScreen);

UserContactsScreen.propTypes = {
};

const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: darkColor,
    borderBottomWidth: 0,
    paddingBottom: 16,
    paddingLeft: 12
  },
  searchBar: {
    borderRadius: 8,
    backgroundColor: mainColor,
    marginTop: (Platform.OS === 'android' ? 32 : 0)
  },
  searchIcon: {
    color: '#666'
  },
  inputTextColor: {
    color: '#c9c9c9'
  }
});
