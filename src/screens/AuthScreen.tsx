import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import {useAppStore, AppState} from '../store/useAppStore';
import {useTheme} from '../hooks/useTheme';

type Mode = 'login' | 'register';

const AuthScreen = () => {
  const register = useAppStore((state: AppState) => state.register);
  const login = useAppStore((state: AppState) => state.login);
  const {palette, radius, shadow} = useTheme();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    }
  };

  const styles = createStyles(palette, radius, shadow);

  return (
    <View style={styles.container}>
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>RN TODO</Text>
      </View>
      <Text style={styles.heading}>Ship tasks faster</Text>
      <Text style={styles.subhead}>
        {mode === 'login'
          ? 'Welcome back—pick up where you left off.'
          : 'Create an account to sync and prioritize what matters.'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#64748b"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.primary} onPress={handleSubmit}>
        <Text style={styles.primaryText}>{mode === 'login' ? 'Login' : 'Register'}</Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
        <Text style={styles.link}>
          {mode === 'login' ? "No account yet? Register" : 'Already registered? Login'}
        </Text>
      </Pressable>
      <Text style={styles.disclaimer}>Local auth only for the assignment. Swap with Firebase easily.</Text>
    </View>
  );
};

const createStyles = (palette: any, radius: any, shadow: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.softBg ?? palette.bg,
      padding: 24,
      justifyContent: 'center',
    },
    heroBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: 'rgba(124,58,237,0.15)',
      borderColor: palette.accentSoft,
      borderWidth: 1,
      borderRadius: radius.md,
      marginBottom: 12,
    },
    heroBadgeText: {
      color: palette.accentSoft,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    heading: {
      color: palette.textPrimary,
      fontSize: 30,
      fontWeight: '800',
      marginBottom: 8,
    },
    subhead: {
      color: palette.textSecondary,
      marginBottom: 24,
      lineHeight: 22,
    },
    input: {
      backgroundColor: palette.card,
      color: palette.textPrimary,
      padding: 14,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      marginBottom: 12,
    },
    primary: {
      backgroundColor: palette.accent,
      paddingVertical: 16,
      borderRadius: radius.lg,
      alignItems: 'center',
      marginTop: 4,
      ...shadow.card,
    },
    primaryText: {
      color: '#0c0f1c',
      fontWeight: '800',
    },
    link: {
      color: palette.accentSoft,
      textAlign: 'center',
      marginTop: 16,
      fontWeight: '700',
    },
    error: {
      color: palette.danger,
      marginBottom: 10,
    },
    disclaimer: {
      color: palette.textSecondary,
      textAlign: 'center',
      fontSize: 12,
      marginTop: 24,
    },
  });

export default AuthScreen;
