import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { dummyAdminStats, formatDate } from "@/assets/assets";
import { COLORS } from "@/constants";
import { ORDER_STATUS_LABELS } from "@/constants";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const fetchStats = async () => {
    setStats(dummyAdminStats as any);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface p-4"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="mb-8">
        <Text className="text-primary font-bold text-2xl mb-4 tracking-tight">
          Genel İstatistikler
        </Text>
        <View className="flex-row flex-wrap justify-between">
          <StatCard
            label="Toplam Ciro"
            value={`${stats.totalRevenue.toFixed(2)} TL`}
          />
          <StatCard
            label="Sipariş Sayısı"
            value={stats.totalOrders.toString()}
          />
          <StatCard
            label="Ürün Sayısı"
            value={stats.totalProducts.toString()}
          />
          <StatCard
            label="Kullanıcı Sayısı"
            value={stats.totalUsers.toString()}
          />
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-primary font-bold text-2xl mb-4 tracking-tight">
          Son Siparişler
        </Text>
        {stats.recentOrders.length === 0 ? (
          <View className="bg-white p-6 rounded-2xl border border-gray-100 items-center">
            <Text className="text-secondary text-sm font-medium">
              Henüz bir sipariş bulunmuyor
            </Text>
          </View>
        ) : (
          stats.recentOrders.slice(0, 5).map((order: any) => (
            <View
              key={order._id}
              className="bg-white p-4 rounded-2xl border border-gray-100 mb-4"
            >
              <View className="flex-row justify-between items-center mb-2">
                <View>
                  <Text className="text-base text-primary font-bold">
                    Toplam Ürün Adedi:{" "}
                    {order.items.reduce(
                      (acc: number, item: any) => acc + item.quantity,
                      0,
                    )}
                  </Text>
                  <Text className="text-xs mt-1 text-secondary">
                    Sipariş Tarihi: {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View
                  className={`px-2 py-1 rounded-full ${order.orderStatus === "delivered" ? "bg-primary" : "bg-gray-100"}`}
                >
                  <Text
                    className={`text-xs font-bold ${order.orderStatus === "delivered" ? "text-white" : "text-gray-700"}`}
                  >
                    {
                      ORDER_STATUS_LABELS[
                        order.orderStatus as keyof typeof ORDER_STATUS_LABELS
                      ]
                    }
                  </Text>
                </View>
              </View>
              <View className="pb-2">
                {order.items.map((item: any) => (
                  <Text key={item._id} className="text-secondary text-xs mt-1">
                    {item.quantity} x {item.name}
                  </Text>
                ))}
              </View>

              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-300">
                <Text className="text-sm text-secondary">
                  #{order.orderNumber}
                </Text>
                <Text className="text-base text-primary font-bold">
                  Toplam: {order.totalAmount.toFixed(2)} TL
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View className="w-[48%] justify-center bg-white p-5 rounded-2xl border border-gray-100 mb-4">
    <Text className="text-xl font-bold text-primary mb-1">{value}</Text>
    <Text className="text-secondary text-xs font-medium uppercase tracking-wide">
      {label}
    </Text>
  </View>
);
