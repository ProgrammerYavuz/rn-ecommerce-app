import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { dummyUser } from "@/assets/assets";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/constants";

export default function Profile() {

  const { user } = { user: dummyUser };
  const router = useRouter();
  const handleLogout = async () => {
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Profilim" />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingTop: 16 }
        }
      >
        {!user ? (
          <View className="w-full items-center">
            <View className="w-24 h-24 items-center justify-center bg-gray-200 mb-6 rounded-full">
              <Ionicons name="person" size={40} color={COLORS.secondary} />
            </View>
            <Text className="text-xl text-primary font-semibold mb-2">Misafir Kullanıcı</Text>
            <Text className="w-3/4 text-base text-secondary text-center px-4 mb-8">Profilinizi, siparişlerinizi ve adresinizi görüntülemek için giriş yapın.</Text>
            <TouchableOpacity className="w-3/5 rounded-full items-center shadow-lg bg-primary py-3" onPress={() => router.push("/sign-in")}>
              <Text className="text-lg text-white font-bold">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="items-center mb-8">
              <View className="mb-3">
                <Image source={{uri: user.imageUrl}} className="size-20 border-2 border-white shadow-sm rounded-full" />
              </View>
              <Text className="text-xl font-bold text-primary">{user.firstName + " " + user.lastName}</Text>
              <Text className="text-secondary text-sm">{user.emailAddresses[0].emailAddress}</Text>
              {user.publicMetadata?.role === 'admin' && (
                <TouchableOpacity className="mt-4 bg-primary px-6 py-2 rounded-full" onPress={() => router.push("/admin")}>
                  <Text className="text-white font-bold">Admin Panel</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="bg-white rounded-xl border border-gray-100/75 p-2 mb-4">
              {PROFILE_MENU.map((item, index)=>(
                <TouchableOpacity 
                  key={item.id}
                  className={`flex-row items-center p-4 ${index !== PROFILE_MENU.length - 1 ? "border-b border-gray-100" : ""}`}
                  onPress={() => router.push(item.route as any)}>
                  <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-4">
                    <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                  </View>
                  <Text className="flex-1 text-primary font-medium">{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.secondary} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity className="flex-row items-center justify-center p-4" onPress={handleLogout}>
              <Text className="text-red-500 font-bold ml-2">Çıkış Yap</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
