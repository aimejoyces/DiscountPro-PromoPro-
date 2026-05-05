import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../../../src/stores/authStore';
import { colors, typography, spacing } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuthStore();

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.onPrimary} />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={14} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] || 'Alex Thompson'}</Text>
        <Text style={styles.email}>{user?.email || 'alex.thompson@retailpro.io'}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.primaryStat]}>
          <Ionicons name="trending-up" size={24} color="rgba(255,255,255,0.8)" style={styles.statIcon} />
          <View>
            <Text style={styles.statLabel}>Lifetime Savings</Text>
            <Text style={styles.statValue}>₱14,250</Text>
          </View>
        </View>
        <View style={[styles.statCard, styles.secondaryStat]}>
          <Ionicons name="bag-outline" size={24} color="rgba(255,255,255,0.8)" style={styles.statIcon} />
          <View>
            <Text style={styles.statLabel}>Coupons Used</Text>
            <Text style={styles.statValue}>42</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="person-outline" size={20} color={colors.onSurface} />
            <Text style={styles.menuLabel}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.outline} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="card-outline" size={20} color={colors.onSurface} />
            <Text style={styles.menuLabel}>Payment Methods</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.outline} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="location-outline" size={20} color={colors.onSurface} />
            <Text style={styles.menuLabel}>Shipping Addresses</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.outline} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.onSurface} />
            <Text style={styles.menuLabel}>Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.outline} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
          <View style={styles.menuLeft}>
            <Ionicons name="notifications-outline" size={20} color={colors.onSurface} />
            <Text style={styles.menuLabel}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.outline} />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.signOutButton, loading && styles.disabledButton]}
        onPress={signOut}
        disabled={loading}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.tertiary} style={styles.signOutIcon} />
        <Text style={styles.signOutText}>
          {loading ? 'Signing out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.surface,
    paddingBottom:80,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing[4],
  },
  avatar: {
    width:96,
    height:96,
    borderRadius:48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:4,
    borderColor: colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width:0, height:4 },
    shadowOpacity:0.1,
    shadowRadius:12,
    elevation:8,
  },
  editButton: {
    position: 'absolute',
    bottom:0,
    right:0,
    backgroundColor: colors.primary,
    width:32,
    height:32,
    borderRadius:16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth:2,
    borderColor: colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width:0, height:2 },
    shadowOpacity:0.1,
    shadowRadius:4,
    elevation:4,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    marginBottom: spacing[1],
  },
  email: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    fontWeight: typography.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  statCard: {
    flex:1,
    padding: spacing[6],
    borderRadius:20,
    shadowColor: '#000',
    shadowOffset: { width:0, height:4 },
    shadowOpacity:0.1,
    shadowRadius:12,
    elevation:8,
    justifyContent: 'space-between',
  },
  primaryStat: {
    backgroundColor: colors.primary,
  },
  secondaryStat: {
    backgroundColor: colors.secondary,
  },
  statIcon: {
    marginBottom: spacing[4],
    opacity:0.8,
  },
  statLabel: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing:1,
  },
  statValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.black,
    color: colors.onPrimary,
  },
  menuContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing[4],
    borderRadius:20,
    shadowColor: '#000',
    shadowOffset: { width:0, height:1 },
    shadowOpacity:0.05,
    shadowRadius:2,
    elevation:2,
    overflow: 'hidden',
    marginBottom: spacing[8],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth:1,
    borderBottomColor: colors.surfaceContainer,
  },
  lastMenuItem: {
    borderBottomWidth:0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  menuLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginHorizontal: spacing[4],
    backgroundColor: colors.surfaceContainerHighest,
    paddingVertical: spacing[3],
    borderRadius:12,
    borderWidth:1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width:0, height:2 },
    shadowOpacity:0.1,
    shadowRadius:4,
    elevation:4,
  },
  signOutIcon: {
    transform: [{ rotate: '180deg' }],
  },
  signOutText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.tertiary,
  },
  disabledButton: {
    opacity:0.5,
  },
});
