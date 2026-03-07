import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Order } from "@/constants/types";
import { dummyOrders, formatDate } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS, ORDER_STATUS_LABELS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setOrders(dummyOrders as any[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Siparişlerim" showBack />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-secondary">
            Henüz bir siparişiniz yok
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm"
              onPress={()=>router.push(`/orders/${item._id}`)}
            >
              <View className="flex-row justify-between mb-3">
                <View className={`px-2 py-1 rounded-full ${item.orderStatus === "delivered" ? "bg-primary" : "bg-gray-100"}`}>
                  <Text className={`text-xs font-bold ${item.orderStatus === "delivered" ? "text-white" : "text-gray-700"}`}>
                    {ORDER_STATUS_LABELS[item.orderStatus]}
                  </Text>
                </View>

                <Text className="text-sm text-secondary font-semibold">
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              <Text className="text-sm text-primary font-semibold">
                {item.items.length} Ürün
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="my-2"
              >
                {item.items.map((prod: any, idx) => {
                  const image = prod.product?.images?.[0];
                  return (
                    <View key={idx} className="mr-3 border border-gray-100 rounded-md p-1 bg-gray-50">
                      {image ? (
                        <Image source={{ uri: image }} className="w-12 h-12 rounded-md" resizeMode="cover"/>
                      ) : (
                        <View className="w-12 h-12 justify-center items-center bg-gray-200 rounded-md">
                          <Ionicons name="image-outline" size={20} color={COLORS.secondary}/>
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-300">
                <Text className="text-sm text-secondary">
                  #{item.orderNumber}
                </Text>
                <Text className="text-base text-primary font-bold">
                  Toplam: {item.totalAmount.toFixed(2)} TL
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
