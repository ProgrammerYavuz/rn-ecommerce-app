import { View, Text, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { dummyOrders, dummyUser, formatDate } from "@/assets/assets";
import { COLORS, ORDER_STATUS_LABELS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

  const fetchOrders = async () => {
    setOrders(
      dummyOrders.map((order: any) => ({
        ...order,
        user: dummyUser,
      })) as any,
    );
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const openStatusModal = (order: any) => {
    setSelectedOrder(order);
    setStatusModalVisible(true);
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setOrders(
      orders.map((order: any) =>
        order._id === selectedOrder._id
          ? { ...order, orderStatus: newStatus }
          : order,
      ) as any,
    );
    setStatusModalVisible(false);
    setUpdating(false);
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
      <ScrollView 
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-secondary">Henüz bir sipariş bulunmuyor</Text>
          </View>
        ) : (
          orders.map((order: any) => (
            <View key={order._id} className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-400 font-medium">#{order.orderNumber}</Text>
                <Text className="text-xs text-secondary">{formatDate(order.createdAt)}</Text>
              </View>

              <View className="mb-3 bg-gray-50 p-3 rounded-lg">
                <Text className="text-xs text-secondary font-bold mb-1">Müşteri Bilgileri</Text>
                <Text className="text-primary font-medium">{order.user?.name || 'Bilinmeyen Müşteri'}</Text>
                <Text className="text-xs text-secondary">{order.user?.email || 'Bilinmeyen Email'}</Text>
                {order.user?.phone && <Text className="text-xs text-secondary">{order.user?.phone}</Text>}
                {!order.user && <Text className="text-xs text-gray-400 mt-1">ID: {order.user?._id || 'N/A'}</Text>}
              </View>

              <View className="mb-3 bg-gray-50 p-3 rounded-lg">
                <Text className="text-xs text-secondary font-bold mb-1">Teslimat Adresi</Text>
                <Text className="text-xs text-primary">
                  {order.shippingAddress?.street}
                  {"\n"}
                  {order.shippingAddress?.city} - {order.shippingAddress?.district} {order.shippingAddress?.zipCode} {order.shippingAddress?.country}
                  {"\n"}
                  {order.shippingAddress?.phone}
                </Text>
              </View>

              <View className="mb-3 bg-gray-50 p-3 rounded-lg">
                <Text className="text-xs text-secondary font-bold mb-1">Ürünler:</Text>
                {order.items.map((item: any) => (
                  <View key={item._id} className="flex-row justify-between mb-1">
                    <Text className="flex-1 text-xs text-primary">{item.quantity}x {item.product?.name || item.name}
                      {(item.size) && (
                        <Text className="text-xs text-secondary">{" "}({item.size || '-'})</Text>
                      )}
                    </Text>
                    <Text className="text-xs text-secondary font-bold">{item.price.toFixed(2)} TL</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-100">
                <Text className="text-lg text-primary font-bold">{order.totalAmount.toFixed(2)} TL</Text>
                <TouchableOpacity
                  className={`flex-row items-center px-2 py-1 rounded-full ${order.orderStatus === "delivered" ? "bg-primary" : "bg-gray-100"}`}
                  onPress={() => openStatusModal(order)}
                >
                  <Text className={`text-xs font-bold mr-1 ${order.orderStatus === "delivered" ? "text-white" : "text-gray-700"}`}>
                    {ORDER_STATUS_LABELS[order.orderStatus as keyof typeof ORDER_STATUS_LABELS]}
                  </Text>
                  <Ionicons name="chevron-forward" size={12} color={order.orderStatus === "delivered" ? "white" : "gray"} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={statusModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white max-h-[60%] rounded-t-2xl p-4">
              <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <Text className="text-lg text-primary font-bold">Sipariş Durumunu Güncelle</Text>
                <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              {updating ? (
                <View className="py-8">
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text className="text-center text-secondary mt-2">Durum güncelleniyor...</Text>
                </View>
              ) : (
                <FlatList
                  data={STATUSES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className={`p-4 rounded-xl mb-2 flex-row justify-between items-center ${selectedOrder?.orderStatus === item ? "bg-primary/10" : "bg-gray-50"}`}
                      onPress={() => updateStatus(item)}
                    >
                      <Text className={`font-medium ${selectedOrder?.orderStatus === item ? "text-primary" : "text-secondary"}`}>{ORDER_STATUS_LABELS[item as keyof typeof ORDER_STATUS_LABELS]}</Text>
                      {selectedOrder?.orderStatus === item && (
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
