import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductStore } from '../../../src/stores/productStore';
import { useCartStore } from '../../../src/stores/cartStore';
import { useFavoritesStore } from '../../../src/stores/favoritesStore';
import { Product } from '../../../src/types';
import { colors, typography, spacing } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { fetchProductById, loading, error } = useProductStore();
  const { addItem } = useCartStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setIsFav(isFavorite(product.id));
    }
  }, [product]);

  const toggleFavorite = () => {
    if (!product) return;
    if (isFav) {
      removeFromFavorites(product.id);
      setIsFav(false);
    } else {
      addToFavorites(product);
      setIsFav(true);
    }
  };

  const loadProduct = async () => {
    if (!id) return;
    const data = await fetchProductById(id);
    setProduct(data);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, quantity, product.price, product.name, product.image_url);
    Alert.alert('Added to Cart', `${quantity}x ${product.name} added to your cart`, [{ text: 'OK' }]);
  };

  if (loading && !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.galleryContainer}>
          <Image
            source={{ uri: product.image_url || 'https://via.placeholder.com/600x400' }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>₱{product.price.toLocaleString()}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.name} - Premium quality product.
            </Text>
          </View>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.qtyButton, quantity <= 1 && styles.disabledButton]}
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.qtyButton, quantity >= product.stock && styles.disabledButton]}
              onPress={() => quantity < product.stock && setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={16} color={colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.stockText}>Stock: {product.stock}</Text>
          </View>

          <TouchableOpacity
            style={[styles.addButton, product.stock === 0 && styles.disabledButton]}
            onPress={product.stock > 0 ? handleAddToCart : undefined}
          >
            <Text style={styles.addButtonText}>
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.surfaceContainerLowest,
  },
  scrollView: {
    flex:1,
  },
  centered: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[6],
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.error,
  },
  galleryContainer: {
    height:400,
    backgroundColor: colors.surfaceContainerLow,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing[4],
    paddingBottom:120,
  },
  name: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  price: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: spacing[1],
  },
  section: {
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.onSurfaceVariant,
    lineHeight:24,
    marginTop: spacing[2],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginTop: spacing[6],
  },
  qtyButton: {
    width:32,
    height:32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius:4,
  },
  qtyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    minWidth:40,
    textAlign: 'center',
  },
  stockText: {
    fontSize: typography.fontSize.sm,
    color: colors.outline,
    marginLeft: spacing[4],
  },
  disabledButton: {
    opacity:0.5,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[3],
    borderRadius:12,
    marginTop: spacing[6],
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.onPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
});
