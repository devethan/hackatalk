import * as Device from 'expo-device';

import type {
  AppUserQuery,
  AppUserQueryResponse,
} from './__generated__/AppUserQuery.graphql';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { AuthProvider, useAuthContext } from './providers/AuthProvider';
import { DeviceProvider, useDeviceContext } from './providers/DeviceProvider';
import React, { FC, ReactElement, Suspense, useEffect } from 'react';
import {
  RelayEnvironmentProvider,
  graphql,
  preloadQuery,
  usePreloadedQuery,
  useRelayEnvironment,
} from 'react-relay/hooks';
import { ThemeProvider, ThemeType } from '@dooboo-ui/theme';
import { dark, light } from './theme';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import ErrorBoundary from './components/screen/ErrorBoundary';
// import { LoadingIndicator } from 'dooboo-ui';
import RootNavigator from './components/navigation/RootStackNavigator';
import { User } from 'types/graphql';
import { initializeEThree } from './utils/virgil';
import styled from 'styled-components/native';

const View = styled.View`
  flex: 1;
`;
const Text = styled.Text``;

const meQuery = graphql`
  query AppUserQuery {
    me {
      id
      email
      verified
      profile {
        authType
      }
    }
  }
`;

function AppWithTheme(): ReactElement {
  const environment = useRelayEnvironment();
  const result = preloadQuery<AppUserQuery>(environment, meQuery, {});
  const data = usePreloadedQuery<AppUserQuery>(meQuery, result);

  useEffect(() => {
    if (data.me) {
      initUser(data.me);
      return;
    }

    AsyncStorage.removeItem('token');
    setDevice();
  }, [data.me]);

  const { setDeviceType } = useDeviceContext();
  const { setUser } = useAuthContext();

  const setDevice = async (): Promise<void> => {
    const deviceType = await Device.getDeviceTypeAsync();
    setDeviceType(deviceType);
  };

  const initUser = async (me: AppUserQueryResponse['me']): Promise<void> => {
    if (!me) return;
    await initializeEThree(me.id);
    setUser(me as User);
  };

  return <RootNavigator />;
}

function App(): ReactElement {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      customTheme={{ light, dark }}
      initialThemeType={
        colorScheme === 'dark' ? ThemeType.DARK : ThemeType.LIGHT
      }
    >
      <AppWithTheme />
    </ThemeProvider>
  );
}

const RelayProviderWrapper: FC = ({ children }) => {
  const {
    state: { relay },
  } = useAuthContext();
  return (
    <RelayEnvironmentProvider environment={relay}>
      <ErrorBoundary
        fallback={
          <View>
            <Text>Error!</Text>
          </View>
        }
      >
        <Suspense fallback={<Text>Loading...</Text>}>
          <ActionSheetProvider>{children}</ActionSheetProvider>
        </Suspense>
      </ErrorBoundary>
    </RelayEnvironmentProvider>
  );
};

function ProviderWrapper(): ReactElement {
  return (
    <AppearanceProvider>
      <DeviceProvider>
        <AuthProvider>
          <RelayProviderWrapper>
            <App />
          </RelayProviderWrapper>
        </AuthProvider>
      </DeviceProvider>
    </AppearanceProvider>
  );
}

export default ProviderWrapper;
