import { NavigationActions, StackActions } from 'react-navigation';


let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function push(routeName, params) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
    })
  );
}

function popToTop() {
  _navigator.dispatch(StackActions.popToTop());
}

export default {
  navigate,
  popToTop,
  push,
  setTopLevelNavigator,
};
