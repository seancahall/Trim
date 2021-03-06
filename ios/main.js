import Expo from 'expo';
import { Provider } from 'react-redux';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleWare from 'redux-promise-middleware';

import AppReducer from './reducers';
import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

import './ReactotronConfig'

class AppContainer extends React.Component {
  store = createStore(AppReducer, {}, applyMiddleware(
    promiseMiddleWare()
  ));

  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
        'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Provider store={this.store}>
          <View style={styles.container}>

            <NavigationProvider router={Router}>
              <StackNavigation
                id="root"
                //initialRoute={Router.getRoute('rootNavigation')}
                initialRoute={Router.getRoute('home')}
              />
            </NavigationProvider>

            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' &&
              <View style={styles.statusBarUnderlay} />}

          </View>
        </Provider>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

});

Expo.registerRootComponent(AppContainer);
