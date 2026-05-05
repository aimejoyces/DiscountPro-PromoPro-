import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <Skeleton height={150} borderRadius={0} />
      <View style={styles.cardContentSkeleton}>
        <Skeleton height={16} width="80%" style={{ marginTop: spacing[2] }} />
        <Skeleton height={14} width="40%" style={{ marginTop: spacing[1] }} />
        <Skeleton height={12} width="60%" style={{ marginTop: spacing[1] }} />
      </View>
    </View>
  );
}

export function CartItemSkeleton() {
  return (
    <View style={styles.cartItemSkeleton}>
      <Skeleton width={60} height={60} borderRadius={6} />
      <View style={styles.cartItemContent}>
        <Skeleton height={16} width="70%" />
        <Skeleton height={14} width="30%" style={{ marginTop: spacing[1] }} />
        <View style={styles.cartItemBottom}>
          <Skeleton height={28} width={100} borderRadius={4} />
          <Skeleton height={16} width="30%" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  cardSkeleton: {
    flex:1,
    margin:6,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius:8,
    overflow: 'hidden',
    borderWidth:1,
    borderColor: colors.surfaceContainer,
  },
  cardContentSkeleton: {
    padding: spacing[3],
  },
  cartItemSkeleton: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing[4],
    marginBottom: spacing[2],
    borderRadius:8,
    borderWidth:1,
    borderColor: colors.surfaceContainer,
  },
  cartItemContent: {
    flex:1,
    marginLeft: spacing[3],
    justifyContent: 'space-between',
  },
  cartItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
});
