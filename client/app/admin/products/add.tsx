import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, Image, Switch, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { CATEGORIES, COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

export default function AddProduct() {
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Erkek");
  const [sizes, setSizes] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris.slice(0, 5));
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !category || sizes.length < 1) {
      Toast.show({
        type: "error",
        text1: "Eksik Bilgi",
        text2: "Lütfen tüm zorunlu alanları doldurun",
      });
      return;
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface p-4">
      <View className="bg-white p-4 rounded-xl shadow-sm mb-20">
        <Text className="text-xs text-secondary font-bold mb-1">
          Ürün Adı <Text className="text-accent">*</Text>
        </Text>
        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          placeholder="Ürün adını girin"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-xs text-secondary font-bold mb-1">
          Fiyat (TL) <Text className="text-accent">*</Text>
        </Text>
        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          placeholder="0.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <Text className="text-xs text-secondary font-bold mb-1">
          Kategori <Text className="text-accent">*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-between bg-surface p-3 rounded-lg mb-4"
        >
          <Text className="text-primary">{category}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white max-h-[50%] rounded-t-2xl p-4">
                <Text className="text-lg font-bold text-center mb-4">Kategori Seçiniz</Text>
                <FlatList
                  data={CATEGORIES}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className={`p-4 rounded-xl mb-2 flex-row justify-between items-center ${category === item.name ? 'bg-primary/10' : 'bg-gray-50'}`}
                      onPress={() => {
                        setCategory(item.name)
                        setModalVisible(false)
                      }}
                    >
                      <Text className={`font-medium ${category === item.name ? "text-primary" : "text-secondary"}`}>{item.name}</Text>
                      {category === item.name && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Text className="text-xs text-secondary font-bold mb-1">
          Stok Adedi <Text className="text-accent">*</Text>
        </Text>
        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          placeholder="0"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />
        
        <Text className="text-xs text-secondary font-bold mb-1">
          Bedenler <Text className="text-accent">*</Text>
        </Text>
        <TextInput
          className="bg-surface p-3 rounded-lg mb-4 text-primary"
          placeholder="S,M,L,XL vb. (virgülle ayırın)"
          value={sizes}
          onChangeText={setSizes}
        />

        <Text className="text-xs text-secondary font-bold mb-1">
          Ürün Açıklaması
        </Text>
        <TextInput
          className="h-24 bg-surface p-3 rounded-lg mb-4 text-primary"
          placeholder="Ürün açıklamasını girin"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text className="text-xs text-secondary font-bold mb-1">
          Ürün Görselleri (max 5)
        </Text>
        <TouchableOpacity onPress={pickImages} className="mb-4">
          {images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, index) => (
                <Image key={index} source={{ uri }} className="h-32 w-32 rounded-lg mr-2" />
              ))}
            </ScrollView>
          ) : (
          <View className="h-32 w-full justify-center items-center bg-gray-100 border border-dashed border-gray-300 rounded-lg">
            <Ionicons name="cloud-upload-outline" size={32} color={COLORS.secondary} />
            <Text className="text-xs text-secondary mt-2">Görsel Yükle</Text>
          </View>
        )}
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-secondary font-bold">Öne Çıkan Ürün</Text>
          <Switch
            value={isFeatured}
            onValueChange={setIsFeatured}
            trackColor={{ false: "#EEEEEE", true: COLORS.primary }}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className={`bg-primary p-4 rounded-xl items-center ${submitting && 'opacity-70'}`}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-bold text-white">Ürün Ekle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
