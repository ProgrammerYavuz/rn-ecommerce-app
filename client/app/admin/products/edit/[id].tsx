import { View, Text, Platform, ActivityIndicator, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, Image, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyProducts } from "@/assets/assets";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { CATEGORIES, COLORS } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product: any = dummyProducts.find((p) => p._id === id);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setCategory(
          typeof product.category === "object"
            ? product.category.name
            : product.category,
        );
        setIsFeatured(product.isFeatured);

        if (product.sizes) {
          setSizes(
            Array.isArray(product.sizes)
              ? product.sizes.join(",")
              : product.sizes,
          );
        }

        if (product.images && Array.isArray(product.images)) {
          setExistingImages(product.images);
        } else if (product.images) {
          setExistingImages([product.images]);
        }
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        Toast.show({
          type: "error",
          text1: "Ürün Alınamadı",
          text2: error.response?.data?.message || "Bir şeyler yanlış gitti",
        });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - (existingImages.length + newImages.length),
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setNewImages([...newImages, ...uris]);
    }
  };

  const removeExistingImage = (index: number) => {
    const updated = [...existingImages];
    updated.slice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index: number) => {
    const updated = [...newImages];
    updated.slice(index, 1);
    setNewImages(updated);
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

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("isFeatured", isFeatured.toString());
      formData.append("sizes", sizes);

      existingImages.forEach((img) => {
        formData.append("existingImages", img);
      });

      for (const [i, uri] of newImages.entries()) {
        const filename = `new-image-${i}.jpg`;

        if (Platform.OS === "web") {
          const blob = await (await fetch(uri)).blob();
          formData.append(
            "images",
            new File([blob], filename, { type: "image/jpeg" }),
          );
        } else {
          formData.append("images", {
            uri,
            name: filename,
            type: "image/jpeg",
          } as any);
        }
      }
      router.back();
    } catch (error: any) {
      console.error("Failed to update product:", error);
      Toast.show({
        type: "error",
        text1: "Ürün güncellenirken bir hata oluştu",
        text2: error.response?.data?.message || "Bir şeyler yanlış gitti",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface p-4">
      <View className="bg-white p-4 rounded-xl border border-gray-100 mb-20">
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
        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {existingImages.map((uri, index) => (
              <View key={`existing-${index}`} className="relative mr-2">
                <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
                <TouchableOpacity
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                  onPress={() => removeExistingImage(index)}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {newImages.map((uri, index) => (
              <View key={`new-${index}`} className="relative mr-2">
                <Image source={{ uri }} className="w-24 h-24 rounded-lg border-2 border-primary" />
                <TouchableOpacity
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                  onPress={() => removeNewImage(index)}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {existingImages.length + newImages.length < 5 && (
              <TouchableOpacity
                onPress={pickImages}
                className="w-24 h-24 justify-center items-center rounded-lg bg-gray-100 border border-dashed border-gray-300"
              >
                <Ionicons name="add" size={24} color={COLORS.secondary} />
                <Text className="text-xs text-secondary mt-1">Görsel Ekle</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

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
            <Text className="text-lg font-bold text-white">Ürün Güncelle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
