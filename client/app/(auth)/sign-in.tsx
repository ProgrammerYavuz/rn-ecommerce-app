import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EmailCodeFactor = {
  strategy: "email_code";
  emailAddressId: string;
};

export default function Page() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");

    // Giriş işlemi
    const onSignInPress = async () => {
        if (!emailAddress || !password || fetchStatus === 'fetching') return;

        try {
            // Şifre ile giriş yap
            const { error } = await signIn.password({ emailAddress, password });
            if (error) {
                console.error(error);
                return;
            }

            if (signIn.status === 'complete') {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) {
                            console.log("Bekleyen oturum görevi:", session.currentTask);
                            return;
                        }
                        const url = decorateUrl("/");
                        if (url.startsWith("http")) {
                            window.location.href = url;
                        } else {
                            router.replace(url as any);
                        }
                    },
                });
            } else if (signIn.status === 'needs_second_factor') {
                    const emailCodeFactor = signIn.supportedSecondFactors?.find(
                    (factor) => factor.strategy === 'email_code'
                    ) as { strategy: 'email_code'; emailAddressId: string } | undefined;
                if (emailCodeFactor) {
                    // Email code MFA gönder
                    await signIn.mfa.sendEmailCode();
                }
            } else if (signIn.status === 'needs_client_trust') {
                console.warn("Client trust required. Handle according to your flow.");
            } else {
                console.error("Sign-in attempt not complete:", signIn.status);
            }
        } catch (err) {
            console.error("Sign-in error:", err);
        }
    };

    // Email code doğrulama
    const onVerifyPress = async () => {
        if (!code || fetchStatus === 'fetching') return;

        try {
            await signIn.mfa.verifyEmailCode({ code });

            if (signIn.status === 'complete') {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) {
                            console.log("Pending session task:", session.currentTask);
                            return;
                        }
                        const url = decorateUrl("/");
                        if (url.startsWith("http")) {
                            window.location.href = url;
                        } else {
                            router.replace(url as any);
                        }
                    },
                });
            } else {
                console.error("Verification attempt not complete:", signIn.status);
            }
        } catch (err) {
            console.error("Verification error:", err);
        }
    };

    // Email code MFA flow aktif ise
    if (signIn.status === "needs_second_factor") {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
                <View className="flex-1 justify-center relative">
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute top-0 left-0 z-10 bg-black p-1.5 rounded-full">
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">E-postanızı doğrulayın</Text>
                        <Text className="text-secondary text-center">E-postanıza gönderilen kodu girin</Text>
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

                    {errors.fields?.code && <Text className="text-red-600 mb-2">{errors.fields.code.message}</Text>}

                    <Pressable
                        className="w-full bg-primary py-4 rounded-full items-center"
                        onPress={onVerifyPress}
                        disabled={fetchStatus === 'fetching'}
                    >
                        {fetchStatus === 'fetching' ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Doğrula</Text>}
                    </Pressable>

                    <Pressable
                        className="w-full py-4 items-center mt-2"
                        onPress={() => signIn.mfa.sendEmailCode()}
                    >
                        <Text className="text-primary font-bold">Yeni kod iste</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // Normal sign-in form
    return (
        <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
            <View className="flex-1 justify-center relative">
                <TouchableOpacity onPress={() => router.push("/")} className="absolute top-0 left-0 z-10 bg-black p-1.5 rounded-full">
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-primary mb-2">Giriş Yapın</Text>
                    <Text className="text-secondary">Alışverişe başlamak için hesabınıza giriş yapın</Text>
                </View>

                <View className="mb-4">
                    <Text className="text-primary font-medium mb-2">Email Adresiniz</Text>
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
                {errors.fields?.identifier && <Text className="text-red-600 mb-2">{errors.fields.identifier.message}</Text>}

                <View className="mb-6">
                    <Text className="text-primary font-medium mb-2">Şifreniz</Text>
                    <TextInput
                        className="w-full bg-surface p-4 rounded-xl text-primary"
                        placeholder="********"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                {errors.fields?.password && <Text className="text-red-600 mb-2">{errors.fields.password.message}</Text>}

                <Pressable
                    className={`w-full py-4 rounded-full items-center mb-10 ${!emailAddress || !password || fetchStatus === 'fetching' ? 'bg-gray-300' : 'bg-primary'}`}
                    onPress={onSignInPress}
                    disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                >
                    {fetchStatus === 'fetching' ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Giriş Yap</Text>}
                </Pressable>

                <View className="flex-row justify-center">
                    <Text className="text-secondary">Hesabınız yok mu? </Text>
                    <Link href="/sign-up">
                        <Text className="text-primary font-bold">Kayıt ol</Text>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}