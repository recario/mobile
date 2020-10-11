import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, ScrollView, Share } from 'react-native';

import { Text,
  Container,
  Content,
  Spinner,
  View,
  Icon,
  H3,
  Header,
  Title,
  Body,
  Left,
  Right
} from 'native-base';

import LinearGradient from 'react-native-linear-gradient';

import { loadAd } from '../actions/adsActions';

import ImageGallery from './ImageGallery';
import AskFriend from './AskFriend';
import OptionsList from './OptionsList';

import NavigationService from '../services/NavigationService';

import { styles } from './Styles';
import { activeColor } from '../Colors';

export default class AdScreen extends React.PureComponent {
  shareAction = () => {
    const { ad } = this.props;

    Share.share({
      message: `Посмотри, ты можешь знать продавца: https://recar.io/ads/${ad.id}`,
      title: ad.title
    })
  }

  favAction = () => {
    const { ad, likeAdDispatched, unlikeAdDispatched } = this.props;

    ad.is_favorite ? unlikeAdDispatched(ad) : likeAdDispatched(ad)
  }

  favIconActiveStyles = [styles.icon, styles.activeColor]
  favIconDefaultStyles = [styles.icon, styles.mainColor]

  render() {
    const { ad, currentAdFriends, askFriendsIsLoading, isLoading, onRefresh } = this.props;
    const refreshControl = <RefreshControl tintColor={activeColor} refreshing={isLoading} onRefresh={onRefresh} />;
    const colorStyle = ad.is_favorite ? this.favIconActiveStyles : this.favIconDefaultStyles;

    if (isLoading && typeof ad.id === 'undefined') {
      return <Container><Content><Spinner color={activeColor}/></Content></Container>
    }

    return (
<<<<<<< HEAD
      <Container style={styles.mainContainer}>
        <View style={styles.headerBackground}>
          <Header iosBarStyle="light-content" style={styles.header}>
=======
      <Container>
        <LinearGradient colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']} style={styles.headerBackground}>
          <Header noShadow iosBarStyle={"light-content"} style={styles.header}>
>>>>>>> Gradient WIP
            <Left>
              <Icon name='chevron-back-outline' onPress={NavigationService.popToTop} />
            </Left>
            <Right style={styles.actionButtonsContainer}>
              <Icon onPress={this.shareAction} name='share-outline' />
<<<<<<< HEAD
              <Icon onPress={this.favAction} style={colorStyle} name={ad.is_favorite ? 'heart' : 'heart-outline'} />
            </Right>
          </Header>
        </View>
        <ScrollView refreshControl={refreshControl} showsVerticalScrollIndicator={false}>
=======
              <Icon onPress={this.favAction} style={[styles.icon, colorStyle]} name={ad.is_favorite ? 'heart' : 'heart-outline'} />
            </Right>
          </Header>
        </LinearGradient>
        <ScrollView style={styles.mainContainer} refreshControl={refreshControl} showsVerticalScrollIndicator={false}>
>>>>>>> Gradient WIP
          <ImageGallery ad={ad} />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{ad.title}</Text>
            <Text style={styles.price}>{ad.price} $</Text>

            <View style={styles.oldPricesContainer}>
              {ad.prices.map((v, index) => (
                <Text key={v[1]} style={styles.priceVersion}>{v[1]} $</Text>
              ))}
            </View>

            {ad.deleted && (
              <View>
                <View style={styles.separator}></View>
                <Text style={styles.deleted}>Удалено</Text>
              </View>
            )}

            {currentAdFriends && currentAdFriends.length > 0 &&
                (askFriendsIsLoading ?
                  <Spinner color={activeColor} /> :
                  <AskFriend ad={ad} currentAdFriends={currentAdFriends} />
                )
            }

            <OptionsList ad={ad} />

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{ad.description}</Text>
            </View>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

AdScreen.propTypes = {
  ad: PropTypes.object.isRequired,
};
