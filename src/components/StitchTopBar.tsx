import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { colors, typography, spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface StitchTopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
}

export function StitchTopBar({ title = "DiscountPro", showBack = false, onBack, rightActions }: StitchTopBarProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity onPress={onBack || (() => navigation.goBack())} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={20} color={colors.onSurface} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="menu" size={20} color={colors.onSurface} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, showBack && styles.titleSmall]}>{title}</Text>
        </View>
        <View style={styles.rightSection}>
          {rightActions || (
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="bag-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainer,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    height: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  iconButton: {
    padding: spacing[2],
    borderRadius: 9999,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  titleSmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.outline,
  },
});
