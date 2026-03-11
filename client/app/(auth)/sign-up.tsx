import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSignUp } from "@clerk/expo";

export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!signUp) return;

    if (!emailAddress || !password || !firstName || !lastName) {
      Toast.show({
        type: "error",
        text1: "Eksik Alanlar",
        text2: "Lütfen tüm alanları doldurun",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      if (error) throw error;

      await signUp.verifications.sendEmailCode();

      setPendingVerification(true);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Kayıt Olunamadı",
        text2: err?.errors?.[0]?.message ?? "Bir şeyler yanlış gitti",
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!signUp) return;

    if (!code) {
      Toast.show({
        type: "error",
        text1: "Eksik Alanlar",
        text2: "Lütfen doğrulama kodunu girin",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: () => {
            router.replace("/");
          },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Doğrulama tamamlanmadı",
        });
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Doğrulama Başarısız",
        text2: err?.errors?.[0]?.message ?? "Geçersiz kod",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center p-6">
      {!pendingVerification ? (
        <View className="flex-1 justify-center relative">
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="absolute top-0 left-0 z-10 bg-black p-1.5 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">
              Hesabınızı Oluşturun
            </Text>
            <Text className="text-secondary">
              Alışverişe başlamak için hesap oluşturun
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">
              Adınız
            </Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="Adınızı Giriniz"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">
              Soyadınız
            </Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="Soyadınızı Giriniz"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">
              Email Adresiniz
            </Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="Email Adresinizi Giriniz"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          <View className="mb-6">
            <Text className="text-primary font-medium mb-2">
              Şifreniz
            </Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="Şifrenizi Giriniz"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-full items-center mb-10"
            onPress={onSignUpPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Kayıt Ol
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-secondary">
              Zaten hesabınız var mı?{" "}
            </Text>
            <Link href="/sign-in">
              <Text className="text-primary font-bold">
                Giriş Yap
              </Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      ) : (
        <View className="flex-1 justify-center relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-0 left-0 z-10 bg-black p-1.5 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">
              Email Doğrula
            </Text>
            <Text className="text-secondary text-center">
              Email adresinize gönderilen kodu giriniz
            </Text>
          </View>

          <View className="mb-6">
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest"
              placeholder="123456"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
          </View>

          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-full items-center"
            onPress={onVerifyPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Doğrula
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}