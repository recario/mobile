import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  Modal,
  SafeAreaView,
  Switch,
  Platform
} from 'react-native';
import {
  View,
  Text,
  Header,
  Item,
  ListItem,
  Icon,
  Input,
  Button,
  H1,
  H2,
  Form,
  Label,
  Content,
  Left,
  Right,
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as ActionTypes from '../actions/actionTypes';

import { applyFilter, resetFilters } from './feedActions';

import { activeColor, darkColor, mainColor, trackColor } from '../Colors';

const FeedFilters = ({ filters, filtersValues, applyFilter, filterReset, modalVisible, switchModalVisible }) => {
  let typingTimer;

  const filterQueryReset = useCallback(() => applyFilter('query', ''), []);

  const filterBox = (filterValue, filterType) => {
    const isActive = filters[filterType].filter(f => f === filterValue).length;
    const maybeActiveStyle = { backgroundColor: (isActive ? activeColor : '#333') };
    const iconName = (filters[filterType].filter(f => f === filterValue)).length ? 'checkmark-circle-outline' : 'ellipse-outline'

    return <View key={filterValue} style={isActive ? styles.activeFilterBox : styles.filterBox}>
      <Text onPress={() => applyFilter(filterType, filterValue)}>
        {filterValue}
        &nbsp;
        <Icon name={iconName} style={styles.filterItem} />
      </Text>
    </View>
  }

  const filterBoxWheels = (filterValue) => filterBox(filterValue, 'wheels');
  const filterBoxGears = (filterValue) => filterBox(filterValue, 'gears');
  const filterBoxCarcasses = (filterValue) => filterBox(filterValue, 'carcasses');
  const filterBoxFuels = (filterValue) => filterBox(filterValue, 'fuels');

  const filtersPresent = Object.values(filters).filter(f => f.length > 0).length > 0;

  const onChangeQueryWithDelay = (text) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => applyFilter('query', text), 200);
  }

  const onContactsModeChange = () => {
    const valueToSet = filters.contacts_mode == 'directFriends' ? '' : 'directFriends';

    applyFilter('contacts_mode', valueToSet);
  }

  return (
    <View>
      <Header style={styles.mainHeader} iosBarStyle='light-content' searchBar rounded>
        <Item style={styles.searchBar}>
          <Icon name='ios-search' style={styles.searchIcon}/>
          <Input placeholder='Поиск' style={styles.inputTextColor} onChangeText={onChangeQueryWithDelay} defaultValue={filters.query}/>
          {filters.query.length > 0 && <Icon name='close-circle' style={styles.inputTextColor} onPress={filterQueryReset} />}
        </Item>

      </Header>

      <Modal animationType='slide' visible={modalVisible}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAwareScrollView>
            <View style={styles.modalContainer}>
              <Content>
                <View style={styles.modalControlsContainer}>
                  <Icon name='close-outline' onPress={switchModalVisible} style={styles.closeIcon}/>
                  {filtersPresent && <Text onPress={filterReset} style={styles.resetIcon}>Сбросить</Text>}
                </View>
                <Item style={styles.filtersHeader}>
                  <Left><H1>Фильтры</H1></Left>
                </Item>

                <Form style={styles.filtersForm}>
                 <H2 style={styles.filterTitle}>Цена, $</H2>
                 <View style={styles.rangeItemWrapper}>
                   <Item style={styles.rangeItem}>
                    <Label>от</Label>
                    <Input keyboardType='numeric' defaultValue={filters.min_price.toString()} onEndEditing={(event) => applyFilter('min_price', event.nativeEvent.text)}/>
                   </Item>
                   <Item style={styles.rangeItem}>
                    <Label>до</Label>
                    <Input keyboardType='numeric' defaultValue={filters.max_price.toString()} onEndEditing={(event) => applyFilter('max_price', event.nativeEvent.text)}/>
                   </Item>
                  </View>
                  <H2 style={styles.filterTitle}>Год</H2>
                  <View style={styles.rangeItemWrapper}>
                    <Item style={styles.rangeItem}>
                      <Label>от</Label>
                      <Input keyboardType='numeric' defaultValue={filters.min_year.toString()} onEndEditing={(event) => applyFilter('min_year', event.nativeEvent.text)}/>
                    </Item>
                    <Item style={styles.rangeItem}>
                      <Label>до</Label>
                      <Input keyboardType='numeric' defaultValue={filters.max_year.toString()} onEndEditing={(event) => applyFilter('max_year', event.nativeEvent.text)}/>
                    </Item>
                  </View>

                   <H2 style={styles.filterTitle}>Двигатель</H2>
                   <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                     {filtersValues.fuels.map(filterBoxFuels)}
                   </ScrollView>

                   <H2 style={styles.filterTitle}>Коробка передач</H2>
                   <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                     {filtersValues.gears.map(filterBoxGears)}
                   </ScrollView>

                   <H2 style={styles.filterTitle}>Привод</H2>
                   <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                     {filtersValues.wheels.map(filterBoxWheels)}
                   </ScrollView>

                   <H2 style={styles.filterTitle}>Кузов</H2>
                   <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                     {filtersValues.carcasses.map(filterBoxCarcasses)}
                   </ScrollView>

                   <View style={styles.switchFilter}>
                     <Left><H2 style={styles.filterTitle}>Только друзья</H2></Left>
                     <Right>
                       <Switch thumbColor='#fff' trackColor={trackColor} ios_backgroundColor={mainColor} onValueChange={onContactsModeChange} value={filters.contacts_mode == 'directFriends'} />
                     </Right>
                   </View>

                </Form>
              </Content>
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.submitButtonWrapper} >
            <Button block onPress={switchModalVisible} style={styles.submitButton}><Text>Поиск</Text></Button>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );

}

function mapStateToProps(state) {
  return {
    filters: state.filters,
    filtersValues: state.filtersValues,
    modalVisible: state.feed.modalOpened,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchModalVisible: () => dispatch({type: ActionTypes.FILTER_MODAL_SWITCH_VISIBILITY}),
    filterReset: () => dispatch(resetFilters()),
    filterQueryReset: () => dispatch(resetFilters()),
    applyFilter: (filterKey, filterValue) => dispatch(applyFilter(filterKey, filterValue))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedFilters);

FeedFilters.propTypes = {
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: darkColor,
    flex: 1,
    padding: 16,
  },
  modalControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainHeader: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingBottom: 16,
    paddingLeft: 12
  },
  filterTitle: {
    marginTop: 16,
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16
  },
  filterBox: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 12,
    padding: 6,
    flexDirection: 'row',
    backgroundColor: '#333'
  },
  activeFilterBox: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 12,
    padding: 6,
    flexDirection: 'row',
    backgroundColor: activeColor
  },
  activeColor: {
    color: activeColor
  },
  rangeItem: {
    width: '40%'
  },
  rangeItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  filterItem: {
    fontSize: 18,
  },
  safeArea: {
    backgroundColor: darkColor,
    minHeight: '100%'
  },
  submitButtonWrapper: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    padding: 16,
  },
  submitButton: {
    backgroundColor: activeColor
  },
  closeIcon: {
    alignSelf: 'flex-start',
    color: '#c9c9c9',
    fontSize: 48,
    fontWeight: 'bold',
  },
  resetIcon: {
    alignSelf: 'center',

  },
  switchFilter: {
    flexDirection: 'row',
    marginTop: 12
  },
  searchBar: {
    borderRadius: 8,
    backgroundColor: mainColor,
    marginTop: (Platform.OS === 'android' ? 32 : 0)
  },
  searchIcon: {
    color: '#666'
  },
  filtersForm: {
    paddingBottom: 96
  },
  filtersHeader: {
    borderBottomWidth: 0,
    marginTop: 12
  },
  inputTextColor: {
    color: '#c9c9c9'
  }
});
