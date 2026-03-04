import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem";

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const shipping = 2.0;
  const total = cartTotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Sepetim" showBack />

      {cartItems.length > 0 ? (
        <>
          <ScrollView
            className="flex-1 px-4 mt-4"
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item, index) => (
              // <Text key={index}>{item.product.name}</Text>
              <CartItem
                key={index}
                item={item}
                onRemove={() => removeFromCart(item.id, item.size)}
                onUpdateQuantity={(q) => updateQuantity(item.id, q, item.size)}
              />
            ))}
          </ScrollView>

          <View className="p-4 bg-white rounded-t-3xl shadow-sm">
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Toplam Tutar:</Text>
              <Text className="text-primary font-bold">
                {cartTotal.toFixed(2)} TL
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Kargo Ücreti:</Text>
              <Text className="text-primary font-bold">
                {shipping.toFixed(2)} TL
              </Text>
            </View>

            <View className="h-[1px] bg-border mt-2 mb-4" />

            <View className="flex-row justify-between mb-6">
              <Text className="text-primary font-bold text-lg">Toplam:</Text>
              <Text className="text-primary font-bold text-lg">
                {total.toFixed(2)} TL
              </Text>
            </View>

            <TouchableOpacity
              className="bg-primary py-4 rounded-full items-center"
              onPress={() => router.push("/checkout")}
            >
              <Text className="text-white font-bold text-base">Ödeme Yap</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-secondary text-lg">
            Sepetinizde ürün bulunmuyor
          </Text>
          <TouchableOpacity className="mt-4" onPress={() => router.push("/")}>
            <Text className="text-primary font-semibold">Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
