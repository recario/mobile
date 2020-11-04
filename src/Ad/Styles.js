import { StyleSheet } from 'react-native';
import { activeColor, darkColor } from '../Colors';

export const styles = StyleSheet.create({
  oldPricesContainer: {
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop: 0,
    marginBottom: 3
  },
  header: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingTop: 0,
    padding: 0,
    margin: 0,
    width: '100%',
  },
  headerBackground: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    width: '100%',
    color: '#fff',
    position: 'absolute',
    zIndex: 10,
    margin: 0
  },
  sourceContainer: {
    margin: 12,
    marginBottom: 36,
    flexDirection: 'row'
  },
  descriptionContainer: {
    margin: 4,
    marginBottom: 16
  },
  contentContainer: {
    padding: 12
  },
  title: {
    textAlign: 'left',
    fontSize: 24,
  },
  price: {
    color: '#85bb65',
    fontSize: 18,
    marginTop: 0,
    fontWeight: 'bold',
  },
  priceVersion: {
    color: '#555',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontSize: 12
  },
  openIcon: {
    fontSize: 18
  },
  separator: {
    borderWidth: 1,
    borderColor: '#111',
    marginTop: 8,
    marginBottom: 8
  },
  deleted: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    color: '#533'
  },
  descriptionText: {
    fontSize: 12
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 8,
    marginLeft: 16
  },
  activeColor: {
    color: activeColor
  },
  mainColor: {
    color: 'white'
  },
  mainContainer: {
    backgroundColor: darkColor
  },
  image: {
    height: 350,
    opacity: 0.75,
  },
  imageGalleryBadgesContainer: {
    width: '100%',
    height: 30,
    marginTop: -30,
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12
  },
  imageGalleryBadge: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'transparent'
  },
  imageGalleryBadgeIcon: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 20
  },
  imageGalleryBadgeText: {
    color: '#fff'
  }
});