import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useProductStore } from '../../../src/stores/productStore';
import { StitchProductCard } from '../../../src/components/StitchProductCard';
import { Product } from '../../../src/types';
import { colors, typography, spacing } from '../../../src/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import { Skeleton, ProductCardSkeleton } from '../../../src/components/Skeleton';

const categories = ['All Deals', 'Electronics', 'Fashion', 'Home Luxury'];

export default function ShopScreen() {
  const router = useRouter();
  const {
    products,
    loading,
    error,
    hasMore,
    fetchProducts,
    resetProducts,
    searchProducts
  } = useProductStore();

  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search products when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchProducts(debouncedQuery);
    } else {
      resetProducts();
      fetchProducts();
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = useCallback(() => {
    resetProducts();
    fetchProducts();
  }, [resetProducts, fetchProducts]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts();
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/(tabs)/shop/${product.id}`);
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Skeleton height={40} borderRadius={8} />
          </View>
        </View>
        <View style={styles.list}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search premium deals..."
            placeholderTextColor={colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.categoryPill,
              index === selectedCategory && styles.categoryPillActive
            ]}
            onPress={() => setSelectedCategory(index)}
          >
            <Text style={[
              styles.categoryText,
              index === selectedCategory && styles.categoryTextActive
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productWrapper}>
            <StitchProductCard product={item} onPress={handleProductPress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} colors={[colors.primary]} />
        }
        ListFooterComponent={
          loading && products.length > 0 ? (
            <View style={styles.footer}>
              <View style={styles.loadingDots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
              <Text style={styles.footerText}>Showing {products.length} of 248 Items</Text>
              <TouchableOpacity style={styles.loadMoreButton}>
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.surface,
  },
  centered: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[6],
  },
  loadingSpinner: {
    padding: spacing[2],
  },
  loadingText: {
    marginTop: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.primary,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius:8,
  },
  retryText: {
    color: colors.onPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.surfaceContainerLowest,
    gap: spacing[2],
  },
  searchBar: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius:8,
    paddingHorizontal: spacing[3],
    height:40,
    borderWidth:1,
    borderColor: colors.outlineVariant,
  },
  searchIcon: {
    marginRight: spacing[2],
  },
  searchInput: {
    flex:1,
    fontSize: typography.fontSize.sm,
    color: colors.onSurface,
  },
  filterButton: {
    width:40,
    height:40,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  categoryPill: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius:9999,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth:1,
    borderColor: colors.outlineVariant,
    shadowColor: '#000',
    shadowOffset: { width:0, height:1 },
    shadowOpacity:0.05,
    shadowRadius:2,
    elevation:2,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurfaceVariant,
  },
  categoryTextActive: {
    color: colors.onPrimary,
  },
  list: {
    padding: spacing[2],
    paddingBottom:80,
  },
  row: {
    justifyContent: 'space-between',
  },
  productWrapper: {
    flex:0.48,
    marginBottom: spacing[2],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    gap: spacing[2],
  },
  loadingDots: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  dot: {
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor: colors.surfaceContainerHighest,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  footerText: {
    fontSize:10,
    color: colors.outline,
    fontWeight: typography.fontWeight.bold,
    letterSpacing:0.5,
    textTransform: 'uppercase',
  },
  loadMoreButton: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderWidth:1,
    borderColor: colors.primary,
    borderRadius:8,
  },
  loadMoreText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
