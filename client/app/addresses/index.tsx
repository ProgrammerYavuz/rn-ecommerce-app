import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

const addressTypeLabels: Record<Address["type"], string> = {
  home: "Ev",
  work: "İş",
  other: "Diğer",
};

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [type, setType] = useState("home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    setAddresses(dummyAddress as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEditSearch = (address: Address) => {
    setIsEditing(true);
    setEditingId(address._id);
    setType(address.type);
    setStreet(address.street);
    setCity(address.city);
    setDistrict(address.district);
    setPhone(address.phone || "");
    setZipCode(address.zipCode);
    setCountry(address.country);
    setIsDefault(address.isDefault);
    setModalVisible(true);
  };

  const resetForm = () => {
    setStreet("");
    setCity("");
    setDistrict("");
    setPhone("");
    setZipCode("");
    setCountry("");
    setType("home");
    setIsDefault(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSaveAddress = async () => {
    setModalVisible(false);
    resetForm();
    fetchAddresses();
  };

  const handleDeleteAddress = async (id: string) => {};

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Adreslerim" showBack />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-4">
          {addresses.length == 0 ? (
            <Text className="text-center text-secondary mt-10">
              Adres bulunamadı
            </Text>
          ) : (
            addresses.map((address) => (
              <View
                key={address._id}
                className="bg-white p-4 rounded-xl mb-4 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={
                        address.type === "home"
                          ? "home-outline"
                          : "briefcase-outline"
                      }
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text className="text-base font-bold text-primary ml-2">
                      {addressTypeLabels[address.type]}
                    </Text>
                    {address.isDefault && (
                      <View className="bg-primary/10 px-2 py-1 rounded ml-2">
                        <Text className="text-primary text-xs font-bold">
                          Varsayılan
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => handleEditSearch(address)}>
                      <Ionicons
                        name="pencil-outline"
                        size={20}
                        color={COLORS.secondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(address._id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={COLORS.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text className="text-secondary leading-5 ml-7">
                  {address.street}, {address.city} - {address.district}{" "}
                  {address.zipCode} {address.country}{" "}
                  {address.phone ? (
                    <>
                      {"\n"}
                      {address.phone}
                    </>
                  ) : (
                    ""
                  )}
                </Text>
              </View>
            ))
          )}

          <TouchableOpacity
            onPress={openAddModal}
            className="flex-row items-center justify-center p-4 border border-dashed border-secondary rounded-xl mt-2 mb-8"
          >
            <Ionicons name="add" size={24} color={COLORS.secondary} />
            <Text className="text-secondary font-medium ml-2">
              Yeni Adres Ekle
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-primary">
                {isEditing ? "Adres Düzenle" : "Yeni Adres Ekle"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-primary font-medium mb-2">Adres Tipi</Text>
              <View className="flex-row gap-3 mb-4">
                {["home", "work", "other"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    className={`px-4 py-2 rounded-full border ${type === t ? "bg-primary" : "bg-white"}`}
                  >
                    <Text
                      className={type === t ? "text-white" : "text-primary"}
                    >
                      {addressTypeLabels[t as keyof typeof addressTypeLabels]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-primary font-medium mb-2">Ülke</Text>
              <TextInput
                className="bg-surface p-4 mb-4 rounded-xl text-primary"
                placeholder="Türkiye"
                value={country}
                onChangeText={setCountry}
              />

              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">Şehir</Text>
                  <TextInput
                    className="bg-surface p-4 rounded-xl text-primary"
                    placeholder="İstanbul"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">İlçe</Text>
                  <TextInput
                    className="bg-surface p-4 rounded-xl text-primary"
                    placeholder="Beşiktaş"
                    value={district}
                    onChangeText={setDistrict}
                  />
                </View>
              </View>

              <Text className="text-primary font-medium mb-2">Sokak/Cadde</Text>
              <TextInput
                className="bg-surface p-4 mb-4 rounded-xl text-primary"
                placeholder="Büyükdere Caddesi"
                value={street}
                onChangeText={setStreet}
              />

              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">
                    Posta Kodu
                  </Text>
                  <TextInput
                    className="bg-surface p-4 rounded-xl text-primary"
                    placeholder="34433"
                    value={zipCode}
                    onChangeText={setZipCode}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">Telefon</Text>
                  <TextInput
                    className="bg-surface p-4 rounded-xl text-primary"
                    placeholder="555 123 4567"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>

              <TouchableOpacity
                className="flex-row items-center mb-8"
                onPress={() => setIsDefault(!isDefault)}
              >
                <View
                  className={`w-5 h-5 border rounded mr-2 items-center justify-center ${isDefault ? "bg-primary border-primary" : "border-secondary"}`}
                >
                  {isDefault && (
                    <Ionicons name="checkmark" color="white" size={14} />
                  )}
                </View>
                <Text className="text-primary">Varsayılan Adres Yap</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full items-center bg-primary rounded-full py-4 mb-10"
                onPress={handleSaveAddress}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg text-white font-bold">Kaydet</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
