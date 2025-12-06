import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import {useAppStore} from './src/store/useAppStore';
import {useTheme} from './src/hooks/useTheme';
import {getApp} from '@react-native-firebase/app';

const App = () => {
  const user = useAppStore(state => state.user);
  const themeMode = useAppStore(state => state.themeMode);
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());
  const {palette} = useTheme();
  const styles = createStyles(palette);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    // Touch default Firebase app using modular API to avoid deprecated namespace warning
    getApp();
  }, []);

  if (!hydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      {user ? <HomeScreen /> : <AuthScreen />}
    </SafeAreaView>
  );
};

const createStyles = (palette: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.bg,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.bg,
    },
  });

export default App;
