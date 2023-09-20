import React from 'react';
import { ThemeProvider } from 'styled-components';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts
} from '@expo-google-fonts/poppins';
import theme from './src/global/styles/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}


