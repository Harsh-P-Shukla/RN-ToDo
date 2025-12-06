import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {Priority} from '../types';
import {useTheme} from '../hooks/useTheme';

type TaskFormInput = {
  title: string;
  description: string;
  deadline?: string;
  priority: Priority;
  tag?: string;
};

type Props = {
  onSubmit: (input: TaskFormInput) => void;
  focusSignal?: number;
};

const priorities: Priority[] = ['high', 'medium', 'low'];

const TaskForm = ({onSubmit, focusSignal}: Props) => {
  const {palette, radius} = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [deadlineTime, setDeadlineTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState<Priority>('medium');
  const [tag, setTag] = useState('');
  const titleRef = useRef<TextInput>(null);
  const styles = createStyles(palette, radius);

  useEffect(() => {
    if (typeof focusSignal === 'number') {
      titleRef.current?.focus();
    }
  }, [focusSignal]);

  const submit = () => {
    if (!title.trim()) return;

    let deadline: string | undefined = undefined;
    if (deadlineDate) {
      const date = new Date(deadlineDate);
      if (deadlineTime) {
        date.setHours(deadlineTime.getHours(), deadlineTime.getMinutes(), 0, 0);
      } else {
        date.setHours(0, 0, 0, 0);
      }
      if (!Number.isNaN(date.getTime())) {
        deadline = date.toISOString();
      }
    }

    onSubmit({title, description, deadline, priority, tag: tag || undefined});
    setTitle('');
    setDescription('');
    setDeadlineDate(null);
    setDeadlineTime(null);
    setTag('');
  };

  const onChangeDate = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setDeadlineDate(selected);
      if (!deadlineTime) {
        setDeadlineTime(selected);
      }
    }
  };

  const onChangeTime = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) {
      setDeadlineTime(selected);
      if (!deadlineDate) {
        setDeadlineDate(selected);
      }
    }
  };

  const dateLabel = deadlineDate ? format(deadlineDate, 'MMM d, yyyy') : 'Pick a date';
  const timeLabel = deadlineTime ? format(deadlineTime, 'hh:mm a') : 'Pick a time';

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Capture a task</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
        ref={titleRef}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        placeholderTextColor={palette.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.datetimeRow}>
        <Pressable style={[styles.input, styles.datetimeHalf, styles.pickerField]} onPress={() => setShowDatePicker(true)}>
          <Text style={deadlineDate ? styles.pickerValue : styles.placeholder}>{dateLabel}</Text>
        </Pressable>
        <Pressable style={[styles.input, styles.datetimeHalf, styles.pickerField]} onPress={() => setShowTimePicker(true)}>
          <Text style={deadlineTime ? styles.pickerValue : styles.placeholder}>{timeLabel}</Text>
        </Pressable>
      </View>
      {showDatePicker && (
        <DateTimePicker value={deadlineDate || new Date()} mode="date" onChange={onChangeDate} />
      )}
      {showTimePicker && (
        <DateTimePicker value={deadlineTime || new Date()} mode="time" onChange={onChangeTime} />
      )}
      <TextInput
        style={styles.input}
        placeholder="Tag / Category (optional)"
        placeholderTextColor={palette.textSecondary}
        value={tag}
        onChangeText={setTag}
      />
      <View style={styles.priorityRow}>
        {priorities.map(option => (
          <Pressable
            key={option}
            style={[styles.chip, option === priority && styles.chipActive]}
            onPress={() => setPriority(option)}>
            <Text style={styles.chipText}>{option.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Save Task</Text>
      </Pressable>
    </View>
  );
};

const createStyles = (palette: any, radius: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.card,
      padding: 16,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      marginBottom: 14,
      shadowColor: palette.glow,
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: {width: 0, height: 10},
    },
    heading: {
      color: palette.textPrimary,
      fontWeight: '800',
      marginBottom: 10,
      fontSize: 17,
    },
    input: {
      backgroundColor: 'transparent',
      color: palette.textPrimary,
      padding: 12,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      marginBottom: 10,
    },
    datetimeRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 10,
    },
    datetimeHalf: {
      flex: 1,
      marginBottom: 0,
    },
    pickerField: {
      justifyContent: 'center',
    },
    pickerValue: {
      color: palette.textPrimary,
      fontWeight: '700',
    },
    placeholder: {
      color: palette.textSecondary,
    },
    multiline: {
      minHeight: 70,
      textAlignVertical: 'top',
    },
    priorityRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: 'transparent',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: palette.cardBorder,
      shadowColor: 'transparent',
    },
    chipActive: {
      backgroundColor: 'rgba(124,58,237,0.12)',
      borderColor: palette.accent,
    },
    chipText: {
      color: palette.textPrimary,
      fontWeight: '700',
    },
    submit: {
      backgroundColor: palette.gradientPrimary ? palette.gradientPrimary[0] : palette.accent,
      paddingVertical: 14,
      borderRadius: radius.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.35)',
      shadowColor: palette.glow,
      shadowOpacity: 0.28,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 10},
    },
    submitText: {
      color: '#0c0f1c',
      fontWeight: '800',
    },
  });

export default TaskForm;
