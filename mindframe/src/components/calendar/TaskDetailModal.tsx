import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Clock, Timer, Calendar as CalendarIcon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { AppFrame } from '../AppFrame';
import { ScheduledTask } from '../../types/Task.types';
import { TaskStatus } from '../../types/calendar/Calendar.types';
import { formatDateTime, formatTimeRange, formatDuration } from '../../utils/calendarUtils';
import { TASK_ACTION_ICONS, TASK_ACTION_COLORS } from '../ui/taskActionIcons';
import { Badge } from '../ui/Badge';
import { colors } from '../../styling/theme';
import { styles } from '../../styling/components/calendar/TaskDetailModal.styles';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    in_progress: { label: 'In Progress', color: colors.brand, bg: colors.brandSoft },
    complete:    { label: 'Complete',    color: colors.energy, bg: colors.energySoft },
    delayed:     { label: 'Delayed',     color: colors.momentum, bg: colors.momentumSoft },
    skipped:     { label: 'Skipped',     color: colors.stress, bg: colors.stressSoft },
    failed:      { label: 'Failed',      color: colors.stress, bg: colors.stressSoft },
};

const PRIORITY_COLOR: Record<string, string> = {
  low:    colors.energy,
  medium: colors.momentum,
  high:   colors.stress,
};

// ─── Action button ────────────────────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  Icon: LucideIcon;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}

function ActionButton({ label, Icon, color, onPress, disabled }: ActionButtonProps) {
  const tint = disabled ? colors.inkFaint : color;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.actionBtn, disabled && styles.actionBtnDisabled]}
    >
      <Icon size={20} color={tint} />
      <Text style={[styles.actionLabel, { color: tint }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
//
// This modal never opens another <Modal> itself — every action that needs a
// follow-up UI (edit, delay, delete) hands the task back to the parent via a
// callback instead. The parent (Calendar) closes this modal first and then
// opens the next one, so only one native Modal is ever visible at a time.
// Stacking multiple <Modal>s at once is what previously froze touch input.

interface TaskDetailModalProps {
  visible: boolean;
  task: ScheduledTask | null;
  onClose: () => void;
  onComplete: (id: string) => void;
  onSkip:     (id: string) => void;
  onEdit:          (task: ScheduledTask) => void;
  onRequestDelay:  (task: ScheduledTask) => void;
  onRequestDelete: (task: ScheduledTask) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskDetailModal({
  visible,
  task,
  onClose,
  onComplete,
  onSkip,
  onEdit,
  onRequestDelay,
  onRequestDelete,
}: TaskDetailModalProps) {
  if (!task) return null;

  const statusCfg = STATUS_CONFIG[task.status];
  const isActionable = task.status === 'in_progress' || task.status === 'delayed';
  const isFinished   = task.status === 'complete' || task.status === 'skipped';

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <AppFrame>
        <SafeAreaView style={styles.safe}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} hitSlop={HIT_SLOP}>
              <Text style={styles.closeBtn}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEdit(task)} hitSlop={HIT_SLOP}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>

            {/* ── Color bar + title ── */}
            <View style={[styles.colorBar, { backgroundColor: task.color }]} />
            <Text style={styles.taskTitle}>{task.title}</Text>

            {/* ── Badges ── */}
            <View style={styles.badgeRow}>
              <Badge label={statusCfg.label} color={statusCfg.color} backgroundColor={statusCfg.bg} />
              <Badge
                label={`${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority`}
                color={PRIORITY_COLOR[task.priority] ?? colors.inkMuted}
                backgroundColor={colors.surfaceAlt}
              />
              {task.isRecommended && (
                <Badge label="Recommended" color={colors.brand} backgroundColor={colors.brandSoft} />
              )}
            </View>

            {/* ── Time info ── */}
            <View style={styles.infoBlock}>
              <InfoRow Icon={Clock} label="Time" value={formatTimeRange(task.startDateTime, task.endDateTime)} />
              <InfoRow Icon={Timer} label="Duration" value={formatDuration(task.startDateTime, task.endDateTime)} />
              <InfoRow Icon={CalendarIcon} label="Date" value={formatDateTime(task.startDateTime).split(' · ')[0]} />
            </View>

            {/* ── Subtasks ── */}
            {task.subtasks && task.subtasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Subtasks</Text>
                {task.subtasks.map((s, i) => (
                  <View key={i} style={styles.subtaskRow}>
                    <View style={[styles.subtaskDot, { backgroundColor: task.color }]} />
                    <Text style={styles.subtaskText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── Actions ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Actions</Text>
              <View style={styles.actionRow}>
                <ActionButton
                  label="Complete"
                  Icon={TASK_ACTION_ICONS.complete}
                  color={TASK_ACTION_COLORS.complete}
                  onPress={() => handleAction(() => onComplete(task.id))}
                  disabled={!isActionable}
                />
                <ActionButton
                  label="Delay"
                  Icon={TASK_ACTION_ICONS.delay}
                  color={TASK_ACTION_COLORS.delay}
                  onPress={() => onRequestDelay(task)}
                  disabled={!isActionable}
                />
                <ActionButton
                  label="Skip"
                  Icon={TASK_ACTION_ICONS.skip}
                  color={TASK_ACTION_COLORS.skip}
                  onPress={() => handleAction(() => onSkip(task.id))}
                  disabled={!isActionable}
                />
              </View>

              {isFinished && (
                <Text style={styles.finishedNote}>
                  This task is {task.status}. Edit it to reopen.
                </Text>
              )}
            </View>

            {/* ── Delete ── */}
            <TouchableOpacity onPress={() => onRequestDelete(task)} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>Delete task</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </AppFrame>
    </Modal>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Icon size={15} color={colors.inkFaint} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };
