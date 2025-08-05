import React from 'react';
import { StatusBar, Platform } from 'react-native';

interface AppStatusBarProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  hidden?: boolean;
}

const AppStatusBar: React.FC<AppStatusBarProps> = ({
  backgroundColor = '#FFFFFF',
  barStyle = 'dark-content',
  hidden = false,
}) => {
  return (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      hidden={hidden}
      translucent={Platform.OS === 'android'}
      showHideTransition="fade"
      networkActivityIndicatorVisible={false}
    />
  );
};

export default AppStatusBar;
