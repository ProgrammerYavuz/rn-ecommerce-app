import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

const addressTypeLabels: Record<Address["type"], string> = {
  home: "Ev",
  work: "İş",
  other: "Diğer",
};

export default function Checkout() {
  const { cartTotal } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  const shipping = 2.0;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  const fetchAddress = async () => {
    const addressList = dummyAddress;
    if (addressList.length > 0) {
      const defaultAddress =
        addressList.find((address: any) => address.isDefault) || addressList[0];
      setSelectedAddress(defaultAddress as Address);
    }
    setPageLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Lütfen bir teslimat adresi seçiniz",
      });
      return;
    }

    if (paymentMethod === "card") {
      Toast.show({
        type: "info",
        text1: "Bilgi",
        text2: "Kartla ödeme entegrasyonu henüz tamamlanmadı",
      });
      return;
    }

    router.replace("/orders");
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Ödeme Yapın" showBack />

      <ScrollView className="flex-1 px-4 mt-4">
        <Text className="text-lg font-bold text-primary mb-4">
          Teslimat Adresi
        </Text>
        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold">
                {addressTypeLabels[selectedAddress.type]}
              </Text>
              <TouchableOpacity onPress={() => router.push("/addresses")}>
                <Text className="text-accent text-sm">Değiştir</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-secondary leading-5">
              {selectedAddress.street}, {selectedAddress.city}
              {"\n"}
              {selectedAddress.state} {selectedAddress.zipCode}
              {"\n"}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/addresses")}
            className="bg-white p-6 rounded-xl mb-6 items-center justify-center border-2 border-dashed border-gray-100"
          >
            <Text className="text-primary font-bold">Adres Ekle</Text>
          </TouchableOpacity>
        )}

        <Text className="text-lg font-bold text-primary mb-4">
          Ödeme Yöntemi
        </Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod("cash")}
          className={`flex-row items-center border-2 bg-white p-4 rounded-xl mb-4 shadow-sm ${paymentMethod === "cash" ? "border-primary" : "border-transparent"}`}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />
          <View className="flex-1 ml-3">
            <Text className="text-base font-bold text-primary">
              Kapıda Ödeme
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Siparişi teslim alırken ödeme yapın
            </Text>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("card")}
          className={`flex-row items-center border-2 bg-white p-4 rounded-xl mb-4 shadow-sm ${paymentMethod === "card" ? "border-primary" : "border-transparent"}`}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />
          <View className="flex-1 ml-3">
            <Text className="text-base font-bold text-primary">
              Kart ile Ödeme
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Kredi kartı veya banka kartı ile ödeme yapın
            </Text>
          </View>
          {paymentMethod === "card" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      <View className="p-4 bg-white shadow-lg border-t border-gray-100">
        <Text className="text-lg font-bold text-primary mb-4">
          Sipariş Özeti
        </Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Ara Toplam</Text>
          <Text className="font-bold">{cartTotal.toFixed(2)} TL</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Kargo Ücreti</Text>
          <Text className="font-bold">{shipping.toFixed(2)} TL</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Vergi</Text>
          <Text className="font-bold">{tax.toFixed(2)} TL</Text>
        </View>
        <View className="flex-row justify-between mb-6">
          <Text className="text-xl font-bold text-primary">Toplam</Text>
          <Text className="text-xl font-bold text-primary">
            {total.toFixed(2)} TL
          </Text>
        </View>
        <TouchableOpacity
          className={`p-4 rounded-xl items-center ${loading ? "bg-gray-400" : "bg-primary"}`}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sipariş Ver</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
