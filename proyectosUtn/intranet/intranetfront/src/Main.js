import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import AppContext from 'context/Context';
import { settings } from './config';
import { getColor, getItemFromStore } from 'helpers/utils';
import { configReducer } from './reducers/configReducer';
import useToggleStyle from './hooks/useToggleStyle';
import { Provider } from 'react-redux';
import store from './redux/store';

const Main = props => {
  const configState = {
    isFluid: getItemFromStore('isFluid', settings.isFluid),
    isRTL: getItemFromStore('isRTL', settings.isRTL),
    isDark: getItemFromStore('isDark', settings.isDark),
    navbarPosition: getItemFromStore('navbarPosition', settings.navbarPosition),
    isNavbarVerticalCollapsed: getItemFromStore(
      'isNavbarVerticalCollapsed',
      settings.isNavbarVerticalCollapsed
    ),
    navbarStyle: getItemFromStore('navbarStyle', settings.navbarStyle),
    currency: settings.currency,
    showBurgerMenu: settings.showBurgerMenu,
    showSettingPanel: false,
    navbarCollapsed: false
  };

  const [config, configDispatch] = useReducer(configReducer, configState);

  const { isLoaded } = useToggleStyle(
    config.isRTL,
    config.isDark,
    configDispatch
  );

  const setConfig = (key, value) => {
    configDispatch({
      type: 'SET_CONFIG',
      payload: {
        key,
        value,
        setInStore: [
          'isFluid',
          'isRTL',
          'isDark',
          'navbarPosition',
          'isNavbarVerticalCollapsed',
          'navbarStyle'
        ].includes(key)
      }
    });
  };

  if (!isLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: config.isDark ? getColor('dark') : getColor('light')
        }}
      />
    );
  }

  return (
    <Provider store={store}>
      <AppContext.Provider value={{ config, setConfig }}>
        {props.children}
      </AppContext.Provider>
    </Provider>
  );
};

Main.propTypes = { children: PropTypes.node };

export default Main;
