import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View, FlatList, Pressable, TextInput, Animated} from 'react-native';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import {useAppStore, AppState} from '../store/useAppStore';
import {sortTasks} from '../utils/sort';
import {SortMode, Task} from '../types';
import {useTheme} from '../hooks/useTheme';

const sortModes: SortMode[] = ['smart', 'deadline', 'priority', 'created'];

const HomeScreen = () => {
  const {user, tasks, addTask, toggleTask, deleteTask, sortMode, setSortMode, logout} = useAppStore(
    (state: AppState) => state,
  );
  const {palette, radius} = useTheme();
  const themeMode = useAppStore((state: AppState) => state.themeMode);
  const setThemeMode = useAppStore((state: AppState) => state.setThemeMode);
  const streak = useAppStore(
    (state: AppState) => (user?.email ? state.streaks[user.email]?.count || 0 : 0),
  );
  const [filterTag, setFilterTag] = useState('');
  const [focusSignal, setFocusSignal] = useState(0);
  const styles = createStyles(palette, radius);
  const listRef = useRef<FlatList<Task>>(null);

  const visibleTasks = useMemo(() => {
    const scoped = tasks.filter((task: Task) => task.ownerEmail === (user?.email || ''));
    const filtered = filterTag
      ? scoped.filter((task: Task) => task.tag === filterTag.trim())
      : scoped;
    return sortTasks(filtered, sortMode);
  }, [tasks, user, sortMode, filterTag]);

  const {completionRatio, completedCount, totalCount} = useMemo(() => {
    const scoped = tasks.filter((task: Task) => task.ownerEmail === (user?.email || ''));
    const completed = scoped.filter(t => t.completed).length;
    return {
      completedCount: completed,
      totalCount: scoped.length,
      completionRatio: scoped.length ? Math.round((completed / scoped.length) * 100) : 0,
    };
  }, [tasks, user]);

  const renderItem = ({item}: {item: Task}) => (
    <TaskCard task={item} onToggle={() => toggleTask(item.id)} onDelete={() => deleteTask(item.id)} />
  );

  const pulse = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const fabPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1, duration: 2600, useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 0, duration: 2600, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(orbit, {toValue: 1, duration: 9000, useNativeDriver: true}),
    );
    spin.start();
    return () => spin.stop();
  }, [orbit]);

  useEffect(() => {
    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(ripple, {toValue: 1, duration: 5200, useNativeDriver: true}),
        Animated.timing(ripple, {toValue: 0, duration: 5200, useNativeDriver: true}),
      ]),
    );
    drift.start();
    return () => drift.stop();
  }, [ripple]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fabPulse, {toValue: 1, duration: 2200, useNativeDriver: true}),
        Animated.timing(fabPulse, {toValue: 0, duration: 2200, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [fabPulse]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pulseAura,
          {
            transform: [
              {
                scale: pulse.interpolate({inputRange: [0, 1], outputRange: [0.9, 1.18]}),
              },
            ],
            opacity: pulse.interpolate({inputRange: [0, 1], outputRange: [0.18, 0.38]}),
          },
        ]}
      />
      <View style={styles.heroStrip} />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.rippleAura,
          {
            backgroundColor:
              themeMode === 'light' ? 'rgba(14,165,233,0.16)' : 'rgba(34,197,94,0.14)',
            transform: [
              {
                scale: ripple.interpolate({inputRange: [0, 1], outputRange: [0.95, 1.08]}),
              },
              {
                translateY: ripple.interpolate({inputRange: [0, 1], outputRange: [4, -6]}),
              },
            ],
            opacity: ripple.interpolate({inputRange: [0, 1], outputRange: [0.12, 0.32]}),
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.orbit,
          {
            transform: [
              {
                rotate: orbit.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']}),
              },
            ],
          },
        ]}>
        <View style={[styles.orb, styles.orbPrimary]} />
        <View style={[styles.orb, styles.orbSecondary]} />
      </Animated.View>
      <View style={styles.header}>
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.kicker}>Today</Text>
            <Text style={styles.title}>Hello Harsh 👋</Text>
            <Text style={styles.subtitle}>{user?.email}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.toggle, themeMode === 'dark' && styles.toggleActive]}
              onPress={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}>
              <Text style={[styles.toggleText, themeMode === 'dark' && styles.toggleTextActive]}>
                {themeMode === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </Pressable>
            <Pressable style={styles.logout} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.surface}>
        <View style={styles.miniStatsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{streak} 🔥</Text>
            <Text style={styles.statHint}>Consecutive days done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Momentum</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {width: `${completionRatio}%`}]} />
            </View>
            <Text style={styles.statHint}>
              {completedCount}/{totalCount || 1} completed
            </Text>
          </View>
        </View>

        <TaskForm onSubmit={addTask} focusSignal={focusSignal} />

        <View style={styles.filters}>
          <FlatList
            data={sortModes}
            keyExtractor={(item: SortMode) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}: {item: SortMode}) => (
              <Pressable
                style={[styles.filterChip, item === sortMode && styles.filterChipActive]}
                onPress={() => setSortMode(item)}>
                <Text style={[styles.filterChipText, item === sortMode && styles.filterChipTextActive]}>
                  {item.toUpperCase()}
                </Text>
              </Pressable>
            )}
          />
          <TextInput
            style={styles.tagInput}
            placeholder="Filter by tag (optional)"
            placeholderTextColor={palette.textSecondary}
            value={filterTag}
            onChangeText={setFilterTag}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleTasks}
        keyExtractor={(item: Task) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add your first one above.</Text>}
        ListFooterComponent={<View style={{height: 20}} />}
      />
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [
              {scale: fabPulse.interpolate({inputRange: [0, 1], outputRange: [1, 1.06]})},
            ],
            shadowColor: palette.glow,
          },
        ]}>
        <Pressable
          style={styles.fabInner}
          onPress={() => {
            setFocusSignal(focusSignal + 1);
            listRef.current?.scrollToOffset({offset: 0, animated: true});
          }}>
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const createStyles = (palette: any, radius: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.softBg ?? palette.bg,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 30,
      gap: 14,
      backgroundColor: palette.softBg ?? palette.bg,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 24,
      width: 66,
      height: 66,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.gradientPrimary ? palette.gradientPrimary[0] : palette.accent,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 18,
      shadowOffset: {width: 0, height: 10},
      elevation: 12,
    },
    fabInner: {
      width: 64,
      height: 64,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.35)',
    },
    fabText: {
      color: '#fff',
      fontSize: 26,
      fontWeight: '800',
    },
    heroStrip: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      borderRadius: 24,
      backgroundColor: palette.gradientPrimary ? palette.gradientPrimary[0] : palette.accent,
      opacity: 0.12,
    },
    pulseAura: {
      position: 'absolute',
      right: -10,
      top: -30,
      width: 160,
      height: 160,
      borderRadius: 140,
      backgroundColor: 'rgba(124,58,237,0.25)',
      shadowColor: '#7c3aed',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.3,
      shadowRadius: 30,
    },
    rippleAura: {
      position: 'absolute',
      left: -10,
      top: -10,
      width: 150,
      height: 150,
      borderRadius: 130,
      shadowColor: '#0ea5e9',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.25,
      shadowRadius: 24,
    },
    heroCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      alignSelf: 'stretch',
      marginHorizontal: 0,
      padding: 18,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      borderColor: palette.cardBorder,
      overflow: 'hidden',
    },
    orbit: {
      position: 'absolute',
      top: -10,
      right: -6,
      width: 140,
      height: 140,
      justifyContent: 'center',
      alignItems: 'center',
    },
    orb: {
      position: 'absolute',
      width: 28,
      height: 28,
      borderRadius: 28,
      backgroundColor: 'rgba(14,165,233,0.3)',
      shadowColor: '#0ea5e9',
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: {width: 0, height: 0},
    },
    orbPrimary: {
      top: 0,
      left: 70,
      backgroundColor: 'rgba(124,58,237,0.45)',
      shadowColor: '#7c3aed',
    },
    orbSecondary: {
      bottom: 10,
      right: 60,
      backgroundColor: 'rgba(14,165,233,0.35)',
      shadowColor: '#0ea5e9',
      width: 22,
      height: 22,
      borderRadius: 22,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 16,
    },
    headerContainer: {
      width: '100%',
      alignSelf: 'stretch',
      maxWidth: '100%',
      overflow: 'hidden',
      paddingHorizontal: 0,
      alignItems: 'stretch',
      borderRadius: radius.lg,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    kicker: {
      color: palette.accentSoft,
      fontWeight: '700',
      marginBottom: 4,
      letterSpacing: 0.8,
    },
    title: {
      color: palette.textPrimary,
      fontSize: 26,
      fontWeight: '800',
    },
    subtitle: {
      color: palette.textSecondary,
    },
    toggle: {
      backgroundColor: palette.card,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
    },
    toggleActive: {
      borderColor: palette.accent,
      backgroundColor: 'rgba(124,58,237,0.12)',
    },
    toggleText: {
      color: palette.textPrimary,
      fontWeight: '700',
    },
    toggleTextActive: {
      color: palette.accent,
    },
    logout: {
      backgroundColor: palette.card,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
    },
    logoutText: {
      color: palette.textPrimary,
      fontWeight: '700',
    },
    surface: {
      backgroundColor: palette.mutedCard ?? palette.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      padding: 14,
      marginBottom: 14,
    },
    filters: {
      marginTop: 8,
      gap: 8,
    },
    miniStatsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: palette.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      padding: 12,
    },
    statLabel: {
      color: palette.textSecondary,
      fontSize: 12,
      marginBottom: 4,
      fontWeight: '700',
      letterSpacing: 0.4,
    },
    statValue: {
      color: palette.textPrimary,
      fontSize: 18,
      fontWeight: '800',
    },
    statHint: {
      color: palette.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    progressTrack: {
      height: 10,
      borderRadius: 10,
      backgroundColor: palette.divider,
      overflow: 'hidden',
      marginTop: 6,
    },
    progressFill: {
      height: '100%',
      backgroundColor: palette.accent,
      borderRadius: 10,
    },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: 'transparent',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      marginRight: 8,
    },
    filterChipActive: {
      backgroundColor: 'rgba(124,58,237,0.12)',
      borderColor: palette.accent,
    },
    filterChipText: {
      color: palette.textSecondary,
      fontWeight: '700',
    },
    filterChipTextActive: {
      color: palette.accent,
    },
    tagInput: {
      backgroundColor: palette.card,
      color: palette.textPrimary,
      padding: 12,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
    },
    list: {
      paddingBottom: 24,
    },
    empty: {
      color: palette.textSecondary,
      textAlign: 'center',
      marginTop: 20,
    },
  });

export default HomeScreen;
