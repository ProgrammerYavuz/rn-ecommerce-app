import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Order, Product } from '@/constants/types';
import { dummyOrders, formatDate } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@/constants';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        setOrder(dummyOrders.find((order) => order._id === id) as any)
        setLoading(false)
    }

    useEffect(() => {
        fetchOrderDetails()
    }, [id])

    if(loading) {
        return (
            <SafeAreaView className='flex-1 bg-surface'>
                <Header title='Sipariş Detayı' showBack />
                <View className='flex-1 justify-center items-center'>
                    <ActivityIndicator size='large' color={COLORS.primary} />
                </View>
            </SafeAreaView>
        )
    }

    if(!order) {
        return (
            <SafeAreaView className='flex-1 bg-surface'>
                <Header title='Sipariş Detayı' showBack />
                <View className='flex-1 justify-center items-center'>
                    <Text>Sipariş bilgilerine ulaşılamadı</Text>
                </View>
            </SafeAreaView>
        )
    }

    const ORDER_STEPS = [
        { title: "Sipariş Alındı", date: formatDate(order.createdAt), completed: true },
        { title: "Hazırlanıyor", date: "", completed: ['processing', 'shipped', 'delivered'].includes(order.orderStatus) },
        { title: "Kargoya Verildi", date: "", completed: ['shipped', 'delivered'].includes(order.orderStatus) },
        { title: "Teslim Edildi", date: "", completed: order.orderStatus === 'delivered' },
    ];
    
  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
        <Header title={`#${order.orderNumber}`} showBack />

        <ScrollView className='flex-1 px-4 pt-4' showsVerticalScrollIndicator={false}>
            <View className='bg-white p-4 rounded-xl mb-4 border border-gray-100'>
                <Text className='text-lg font-bold text-primary mb-4'>Sipariş Bilgileri</Text>

                {ORDER_STEPS.map((step, index) => (
                    <View key={index} className='flex-row mb-4 last:mb-0'>
                        <View className='items-center mr-4'>
                            <View className={`w-3 h-3 rounded-full ${step.completed ? 'bg-primary' : 'bg-gray-300'}`} />
                            {index !== ORDER_STEPS.length - 1 && (
                                <View className={`w-0.5 h-full ${step.completed ? 'bg-primary' : 'bg-gray-300'} absolute top-3`} />
                            )}
                        </View>
                        <View className='pb-4'>
                            <Text className={`font-semibold ${step.completed ? 'text-primary' : 'text-gray-400'}`}>{step.title}</Text>
                            {step.date ? <Text className='text-sm text-secondary'>{step.date}</Text> : null}
                        </View>
                    </View>
                ))}
            </View>

            <View className='bg-white p-4 rounded-xl mb-4 border border-gray-100'>
                <Text className='text-lg font-bold text-primary mb-4'>Ürünler</Text>
                {order.items.map((item: any, index: number) => {
                    const productData = item.product as Product
                    const image = productData?.images?.[0]

                    return (
                        <TouchableOpacity key={index} onPress={()=>router.push(`/product/${productData._id}`)} className={`flex-row ${index !== order.items.length - 1 && 'border-b border-gray-100 pb-4 mb-4'}`}>
                            {image ? (
                                <Image source={{ uri: image }} className='w-16 h-16 rounded-md bg-gray-200' resizeMode='contain' />
                            ) : (
                                <View className="w-16 h-16 justify-center items-center bg-gray-200 rounded-md">
                                    <Ionicons name="image-outline" size={20} color={COLORS.secondary} />
                                </View>
                            )}

                            <View className='flex-1 ml-3 justify-center'>
                                <Text className='text-primary font-medium' numberOfLines={1}>{item.name}</Text>
                                <Text className='text-xs text-secondary'>Beden: {item.size}</Text>
                                <View className='flex-row justify-between items-center mt-2'>
                                    <Text className='text-secondary text-xs'>{item.quantity} adet</Text>
                                    <Text className='text-sm text-primary font-bold'>{item.price.toFixed(2)} TL</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>

            <View className='bg-white p-4 rounded-xl mb-4 border border-gray-100'>
                <Text className='text-lg font-bold text-primary mb-4'>Adres Bilgileri</Text>
                <View className='flex-row items-center mb-2'>
                    <Ionicons name='location-outline' size={20} color={COLORS.secondary} />
                    <Text className='flex-1 text-sm text-secondary ml-2'>
                        {order.shippingAddress?.street}
                        {"\n"}
                        {order.shippingAddress?.city} - {order.shippingAddress?.district} {order.shippingAddress?.zipCode} {order.shippingAddress?.country}
                        {"\n"}
                        {order.shippingAddress?.phone}
                    </Text>
                </View>
            </View>

            {order.notes && (
                <View className='bg-white p-4 rounded-xl mb-4 border border-gray-100'>
                    <Text className='text-lg font-bold text-primary mb-4'>Notlar</Text>
                    <Text className='text-sm text-secondary'>{order.notes}</Text>
                </View>
            )}

            <View className='bg-white p-4 rounded-xl mb-4 border border-gray-100'>
                <Text className='text-lg font-bold text-primary mb-4'>Ödeme Bilgileri</Text>
                <View className='flex-row justify-between mb-2'>
                    <Text className='text-secondary text-sm'>Ödeme Yöntemi</Text>
                    <Text className='text-primary text-sm font-medium'>{PAYMENT_METHOD_LABELS[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS] || 'Bilinmiyor'}</Text>
                </View>
                <View className='flex-row justify-between'>
                    <Text className='text-secondary text-sm'>Ödeme Durumu</Text>
                    <Text className={`font-medium text-sm ${order.paymentStatus === 'paid' ? 'text-green-600' : order.paymentStatus === 'failed' ? 'text-red-600' : 'text-orange-500'}`}>{PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] || 'Bilinmiyor'}</Text>
                </View>
                <View className='h-px bg-gray-100 my-3'/>
                <View className='flex-row justify-between mb-2'>
                    <Text className='text-secondary text-sm'>Ara Toplam</Text>
                    <Text className='text-primary font-medium text-sm'>{order.subtotal.toFixed(2)} TL</Text>
                </View>
                <View className='flex-row justify-between mb-2'>
                    <Text className='text-secondary text-sm'>Kargo Ücreti</Text>
                    <Text className='text-primary font-medium text-sm'>{order.shippingCost.toFixed(2)} TL</Text>
                </View>
                <View className='flex-row justify-between mb-2'>
                    <Text className='text-secondary text-sm'>Vergi</Text>
                    <Text className='text-primary font-medium text-sm'>{order.tax.toFixed(2)} TL</Text>
                </View>
                <View className='h-px bg-gray-100 my-3'/>
                <View className='flex-row justify-between'>
                    <Text className='text-primary font-bold text-lg'>Toplam</Text>
                    <Text className='text-primary font-bold text-lg'>{order.totalAmount.toFixed(2)} TL</Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}