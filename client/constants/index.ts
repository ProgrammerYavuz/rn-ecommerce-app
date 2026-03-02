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

export const getStatusColor = (status: string) => {
    switch (status) {
        case "placed":
            return "bg-yellow-50 text-yellow-900"; // Sipariş Alındı
        case "processing":
            return "bg-indigo-50 text-indigo-900"; // Hazırlanıyor
        case "shipped":
            return "bg-purple-50 text-purple-900"; // Kargoya Verildi
        case "delivered":
            return "bg-green-50 text-green-900"; // Teslim Edildi
        case "cancelled":
            return "bg-red-50 text-red-900"; // İade Edildi
        default:
            return "bg-gray-50 text-gray-900";
    }
};
