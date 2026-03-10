export const COLORS = {
    primary: "#111111",
    secondary: "#666666",
    background: "#FFFFFF",
    surface: "#F7F7F7",
    accent: "#FF4C3B",
    border: "#EEEEEE",
    error: "#FF4444",
};

export const CATEGORIES = [
    { id: 1, name: "Erkek", icon: "man-outline" },
    { id: 2, name: "Kadın", icon: "woman-outline" },
    { id: 3, name: "Çocuk", icon: "happy-outline" },
    { id: 4, name: "Ayakkabı", icon: "footsteps-outline" },
    { id: 5, name: "Çanta", icon: "briefcase-outline" },
    { id: 6, name: "Diğer", icon: "grid-outline" },
];

export const PROFILE_MENU = [
    { id: 1, title: "Siparişlerim", icon: "receipt-outline", route: "/orders" },
    { id: 2, title: "Adreslerim", icon: "location-outline", route: "/addresses" },
    { id: 4, title: "Yorumlarım", icon: "star-outline", route: "/reviews" },
    { id: 5, title: "Ayarlar", icon: "settings-outline", route: "/settings" },
];

export const PAYMENT_STATUS_LABELS = {
  paid: "Ödendi",
  pending: "Beklemede",
  failed: "Başarısız",
  refunded: "İade edildi",
};

export const ORDER_STATUS_LABELS = {
  placed: "Sipariş Alındı",
  processing: "Hazırlanıyor",
  shipped: "Kargoya Verildi",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export const PAYMENT_METHOD_LABELS = {
  card: "Kartla ödeme",
  cash: "Kapıda ödeme",
};

export const ADDRESS_TYPE_LABELS = {
  home: "Ev",
  work: "İş",
  other: "Diğer",
};