import { View, Text, Alert, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { dummyProducts } from "@/assets/assets";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

export default function AdminProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    setProducts(dummyProducts as any);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const performDelete = async (id: string) => {
    setProducts(products.filter((product: any) => product._id !== id) as any);
  };

  const deleteProduct = async (id: string) => {
    Alert.alert("Ürünü Sil", "Bu ürünü silmek istediğinizden emin misiniz?", [
      {
        text: "İptal",
        style: "cancel" as const,
      },
      {
        text: "Sil",
        style: "destructive" as const,
        onPress: () => performDelete(id),
      },
    ]);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row items-center justify-between p-4 bg-white border border-gray-100">
        <Text className="text-lg font-semibold text-primary">Ürün Sayısı: {products.length}</Text>
        <TouchableOpacity
          onPress={() => router.push("/admin/products/add")}
          className="flex-row items-center bg-gray-800 px-4 py-2 rounded-full"
        >
          <Ionicons name="add" size={20} color={COLORS.background} />
          <Text className="text-white font-medium ml-1">Ürün Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 p-2"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {products.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-secondary text-lg font-semibold">Ürün bulunmamaktadır</Text>
          </View>
        ) : (
          products.map((product: any, index: number) => (
            <View key={index} className="bg-white p-3 rounded-lg border border-gray-100 mb-3 flex-row items-center">
              <Image
                source={{ uri: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150' }}
                className="w-24 h-24 rounded-lg bg-gray-100 mr-3"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="font-bold text-primary text-base" numberOfLines={1}>{product.name}</Text>
                <Text className="text-secondary text-xs mb-1" numberOfLines={1}>Kategori : {product.category || 'Diğer'}</Text>
                <Text className="text-secondary text-xs mb-1" numberOfLines={1}>Stok : {product.stock}</Text>
                <Text className="text-secondary text-xs mb-1" numberOfLines={1}>Bedenler : {product.sizes.join(", ")}</Text>
                <Text className="text-primary text-sm font-bold">{product.price.toFixed(2)} TL</Text>
              </View>

              <View className="flex-row items-center">
                <TouchableOpacity
                  className="p-2 bg-slate-50 rounded-full mr-2"
                  onPress={() => router.push(`/admin/products/edit/${product._id}`)}
                >
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 bg-slate-50 rounded-full"
                  onPress={() => deleteProduct(product._id)}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
