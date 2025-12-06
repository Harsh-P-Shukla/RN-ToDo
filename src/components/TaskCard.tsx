import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {Task} from '../types';
import {format} from 'date-fns';
import {useTheme} from '../hooks/useTheme';

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

const priorityColors: Record<Task['priority'], string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const TaskCard = ({task, onToggle, onDelete}: Props) => {
  const {palette, radius, shadow} = useTheme();
  const styles = createStyles(palette, radius, shadow);
  const deadlineText = task.deadline
    ? format(new Date(task.deadline), 'MMM d, p')
    : 'No deadline';
  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <View style={[styles.priorityDot, {backgroundColor: priorityColors[task.priority]}]} />
          <Text style={styles.title}>{task.title}</Text>
        </View>
        <View style={[styles.statusPill, task.completed && styles.statusPillDone]}>
          <Text style={styles.statusText}>{task.completed ? '✓ Done' : '○ Open'}</Text>
        </View>
      </View>

      <Text style={styles.description}>{task.description}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Deadline</Text>
        <Text style={styles.metaValue}>{deadlineText}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Priority</Text>
        <Text style={[styles.metaValue, {color: priorityColors[task.priority]}]}>
          {task.priority.toUpperCase()}
        </Text>
      </View>
      {task.tag ? (
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>🏷 {task.tag}</Text>
        </View>
      ) : null}
      <View style={styles.actions}>
        <Pressable style={styles.primaryAction} onPress={onToggle}>
          <Text style={styles.primaryActionText}>
            {task.completed ? 'Mark Open' : 'Mark Done'}
          </Text>
        </Pressable>
        <Pressable style={styles.deleteAction} onPress={onDelete}>
          <Text style={styles.deleteActionText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (palette: any, radius: any, shadow: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: palette.mutedCard ?? palette.card,
      borderRadius: radius.lg,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      marginBottom: 12,
      ...shadow.card,
      overflow: 'hidden',
    },
    completedCard: {
      opacity: 0.65,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
    },
    priorityDot: {
      width: 10,
      height: 10,
      borderRadius: 10,
      marginRight: 8,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    title: {
      color: palette.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      flexShrink: 1,
    },
    description: {
      color: palette.textSecondary,
      marginBottom: 8,
      lineHeight: 18,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    metaLabel: {
      color: palette.textSecondary,
      fontSize: 12,
    },
    metaValue: {
      color: palette.textPrimary,
      fontSize: 12,
    },
    statusPill: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      backgroundColor: 'rgba(34,197,94,0.08)',
    },
    statusPillDone: {
      backgroundColor: 'rgba(34,197,94,0.18)',
      borderColor: 'rgba(34,197,94,0.4)',
    },
    statusText: {
      color: palette.textPrimary,
      fontWeight: '700',
      fontSize: 12,
    },
    tagBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: 'rgba(124,58,237,0.12)',
      borderRadius: radius.sm,
      marginTop: 6,
    },
    tagText: {
      color: palette.accentSoft,
      fontSize: 12,
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      marginTop: 12,
      gap: 8,
    },
    primaryAction: {
      flex: 1,
      backgroundColor: palette.success,
      paddingVertical: 10,
      borderRadius: radius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.04)',
    },
    primaryActionText: {
      color: '#0c0f1c',
      fontWeight: '700',
    },
    deleteAction: {
      backgroundColor: palette.danger,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.06)',
    },
    deleteActionText: {
      color: '#0c0f1c',
      fontWeight: '700',
    },
  });

export default TaskCard;
