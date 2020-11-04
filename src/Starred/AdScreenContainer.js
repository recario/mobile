import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AdScreen from '../Ad/AdScreen';

import { loadAdToStarred } from '../actions/adsActions';
import { likeAd, unlikeAd } from '../FavoriteAds/favoriteAdsActions';

class AdScreenContainer extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    return { headerShown: false };
  };

  onRefresh = () => {
    const { ad, navigation, loadAd } = this.props;

    loadAd(ad.id);
  };

  componentDidMount() {
    const { ad, loadAd, isLoading, navigation } = this.props;

    if (isLoading) return;

    if (parseInt(ad.id) == parseInt(navigation.state.params.id)) return;

    loadAd(navigation.state.params.id);
  }

  componentDidUpdate() {
    const { ad, loadAd, isLoading, navigation } = this.props;

    if (isLoading) return;

    if (parseInt(ad.id) == parseInt(navigation.state.params.id)) return;

    loadAd(navigation.state.params.id);
  }

  render () {
    const { ad, currentAdFriends, askFriendsIsLoading, isLoading, loadAd, likeAd, unlikeAd } = this.props;

    return <AdScreen ad={ad}
                     likeAd={likeAd}
                     unlikeAd={unlikeAd}
                     currentAdFriends={currentAdFriends}
                     askFriendsIsLoading={askFriendsIsLoading}
                     isLoading={isLoading}
                     onRefresh={this.onRefresh} />
  }
}

function mapStateToProps(state) {
  return {
    ad: state.starredAd.currentAd,
    isLoading: state.starredAd.isLoading,
    askFriendsIsLoading: state.starredAd.askFriendsIsLoading,
    currentAdFriends: state.starredAd.currentAdFriends,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAd: (id) => dispatch(loadAdToStarred(id)),
    likeAd: (adId) => dispatch(likeAd(adId)),
    unlikeAd: (adId) => dispatch(unlikeAd(adId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdScreenContainer);
