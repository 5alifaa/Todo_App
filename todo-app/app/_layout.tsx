import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AuthContext, AuthProvider } from '../src/context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}

function InnerLayout() {
  const { logout } = useContext(AuthContext)!;

  const handleLogoutWithConfirmation = async () => {
    try {
      if (Platform.OS === 'web') {
        const confirmLogout = window.confirm(
          'Are you sure you want to log out?'
        );
        if (confirmLogout) {
          await logout();
        }
      } else {
        Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => await logout(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Logout failed', String(error));
    }
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          animation: 'slide_from_left',
        }}
      />
      <Stack.Screen
        name="todos"
        options={{
          title: '✔️ Tick It',
          headerTitleAlign: 'center',
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogoutWithConfirmation}
              style={styles.logoutButton}
            >
              <FontAwesome
                name="sign-out"
                size={24}
                color={'red'}
                style={styles.logoutText}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    // backgroundColor: '#ff4d4d',
    // opacity: 0.8,
    // borderRadius: 5,
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  logoutText: {
    // color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
