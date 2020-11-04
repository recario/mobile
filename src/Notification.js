import React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Text, Thumbnail } from 'native-base';
import { darkColor, lightColor, mainColor } from './Colors';

import { FlingGestureHandler, Directions } from 'react-native-gesture-handler';

export default class Notification extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      message: '',
      onPress: null,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onBodyPress = this.onBodyPress.bind(this);

    this.timeout = null;
    this.timeoutConst = 5000;

    this.animatedPosition = new Animated.Value(-100);
  }

  show({ message, timeout, onPress }) {
    const timeoutValue = timeout ? timeout : this.timeoutConst;

    this.setState({ show: true, message, onPress });

    Animated.timing(this.animatedPosition, {
      toValue: 25,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (timeout !== 0) {
      this.timeout = setTimeout(this.hide, timeoutValue);
    }
  }

  hide() {
    Animated.timing(this.animatedPosition, {
      toValue: -100,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ show: false });
    });
    clearTimeout(this.timeout);
  }

  onBodyPress() {
    const { onPress } = this.state;

    if (onPress) {
      onPress();
    }
    this.hide();
  }

  render() {
    const { show, message } = this.state;
    const text = message.message ? message.message : message;

    if (!show) { return null };

    return (
      <FlingGestureHandler direction={Directions.UP} onHandlerStateChange={this.hide} >
        <Animated.View style={[styles.notificationWrapper, { top: this.animatedPosition }]}>
          {message.photo && <Thumbnail style={styles.messagePhoto} source={{ uri: message.photo }}/>}
          <TouchableOpacity activeOpacity={1} onPress={this.onBodyPress} style={styles.notificationBody}>
            <Text numberOfLines={2} style={styles.notificationBodyText}>
              {message.name && <Text style={{color: lightColor}}>{message.name}{"\n"}</Text>}
              {text.replace(/\n/g, ' ')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </FlingGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  notificationWrapper: {
    marginTop: 20,
    position: 'absolute',
    backgroundColor: '#222',
    zIndex: 100000,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  notificationBodyText: {
    color: lightColor,
    fontSize: 14,
    flex: 1,
  },
  close: {
    color: lightColor,
    fontSize: 18,
  },
  messagePhoto: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
});
