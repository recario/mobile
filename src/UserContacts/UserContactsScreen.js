import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Item, Icon, Input, Text, Fab } from 'native-base';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';

import UserContactsList from './UserContactsList';

import { loadMoreUserContacts, getAll, updateQuery } from './userContactsActions';

import { filterByContact } from '../Feed/feedActions';

import ContactsUploading from '../Feed/ContactsUploading';

import CSS from '../Styles';

class UserContactsScreen extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    return({ header: () => null });
  }

  resetQuery = () => this.props.updateQueryDispatched('')

  render() {
    let typingTimer = null;
    const { userContacts, isLoading, query, updateQueryDispatched, loadMoreUserContactsDispatched, onRefreshDispatched, filterByContactDispatched, userContactsAreUploading, userContactsMissing } = this.props;
    // TODO: Ugly
    const showInitialProcessing = !isLoading &&
                                  userContactsMissing &&
                                  userContactsAreUploading;
    const onUpdateQuery = (query) => {
      clearTimeout(this.typingTimer);
      setTimeout(() => updateQueryDispatched(query), 500);
    }

    return (
      <Container>
        <Header style={styles.mainHeader} iosBarStyle={'light-content'} searchBar rounded>
          <Item>
            <Icon name='ios-search' />
            <Input placeholder='Имя...' style={styles.activeColor} onChangeText={onUpdateQuery} defaultValue={query}/>
            {Platform.OS === 'ios' && query.length > 0 && <Icon name='close-circle-outline' style={styles.activeColor} onPress={this.resetQuery}/>}
          </Item>
          {Platform.OS === 'android' && query.length > 0 &&
            <Fab direction="right" position="topRight" style={{zIndex: 100, backgroundColor: CSS.activeColor}}>
              <Icon name='close-outline' onPress={this.resetQuery} />
            </Fab>
          }
        </Header>
        {showInitialProcessing ?
          <ContactsUploading />
          :
          <UserContactsList
            userContacts={userContacts}
            filterByContactDispatched={filterByContactDispatched}
            isLoading={isLoading}
            loadMoreUserContactsDispatched={loadMoreUserContactsDispatched}
            onRefresh={onRefreshDispatched}/>
        }
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    userContacts: state.userContacts.list,
    userContactsAreUploading: state.userContacts.isUploading,
    userContactsMissing: (state.userContacts.list.length === 0 && state.userContacts.query.length === 0),
    query: state.userContacts.query,
    isLoading: state.userContacts.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMoreUserContactsDispatched: () => dispatch(loadMoreUserContacts()),
    onRefreshDispatched: () => dispatch(getAll()),
    filterByContactDispatched: (name) => dispatch(filterByContact(name)),
    updateQueryDispatched: (query) => dispatch(updateQuery(query))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContactsScreen);

UserContactsScreen.propTypes = {
};

const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: CSS.mainColor,
    borderBottomWidth: 0,
    paddingBottom: 16
  },
  activeColor: {
    color: CSS.activeColor
  },
});
