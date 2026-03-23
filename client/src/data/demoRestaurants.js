// Fallback data when API is unavailable (e.g. Vercel deployment without backend)
export const DEMO_RESTAURANTS = [
  { _id: "demo-1", name: "Spice Garden", cuisine: ["North Indian", "Mughlai"], image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", rating: 4.5, deliveryTime: 30 },
  { _id: "demo-2", name: "Pizza Paradise", cuisine: ["Italian", "Continental"], image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", rating: 4.3, deliveryTime: 25 },
  { _id: "demo-3", name: "Dosa Corner", cuisine: ["South Indian"], image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800", rating: 4.6, deliveryTime: 20 },
  { _id: "demo-4", name: "Burger Hub", cuisine: ["American", "Fast Food"], image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800", rating: 4.2, deliveryTime: 25 },
  { _id: "demo-5", name: "Biryani Blues", cuisine: ["North Indian", "Biryani"], image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", rating: 4.7, deliveryTime: 35 },
  { _id: "demo-6", name: "China Town", cuisine: ["Chinese", "Asian"], image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800", rating: 4.4, deliveryTime: 28 },
  { _id: "demo-7", name: "Cafe Mocha", cuisine: ["Cafe", "Desserts"], image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", rating: 4.5, deliveryTime: 22 },
];

export const DEMO_RESTAURANT_DETAIL = {
  "demo-1": { _id: "demo-1", name: "Spice Garden", description: "Authentic North Indian cuisine.", cuisine: ["North Indian", "Mughlai"], image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", rating: 4.5, deliveryTime: 30, menu: [
    { _id: "m1", name: "Butter Chicken", description: "Creamy tomato curry", price: 280, category: "Main", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400" },
    { _id: "m2", name: "Paneer Tikka", price: 220, category: "Starter", image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400" },
    { _id: "m3", name: "Garlic Naan", price: 60, category: "Bread", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
  ]},
  "demo-2": { _id: "demo-2", name: "Pizza Paradise", description: "Wood-fired pizzas.", cuisine: ["Italian"], image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", rating: 4.3, deliveryTime: 25, menu: [
    { _id: "m1", name: "Margherita Pizza", price: 299, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
    { _id: "m2", name: "Pepperoni Pizza", price: 399, category: "Pizza", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400" },
  ]},
  "demo-3": { _id: "demo-3", name: "Dosa Corner", description: "South Indian meals.", cuisine: ["South Indian"], image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800", rating: 4.6, deliveryTime: 20, menu: [
    { _id: "m1", name: "Masala Dosa", price: 120, category: "Dosa", image: "https://images.unsplash.com/photo-1630386530003-7c5303e2a0f7?w=400" },
    { _id: "m2", name: "Idli Sambar", price: 80, category: "Breakfast", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400" },
  ]},
  "demo-4": { _id: "demo-4", name: "Burger Hub", description: "Gourmet burgers.", cuisine: ["American"], image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800", rating: 4.2, deliveryTime: 25, menu: [
    { _id: "m1", name: "Classic Cheeseburger", price: 199, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
    { _id: "m2", name: "Chicken Burger", price: 249, category: "Burgers", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400" },
  ]},
  "demo-5": { _id: "demo-5", name: "Biryani Blues", description: "Hyderabadi biryani.", cuisine: ["North Indian", "Biryani"], image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800", rating: 4.7, deliveryTime: 35, menu: [
    { _id: "m1", name: "Chicken Biryani", price: 299, category: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400" },
  ]},
  "demo-6": { _id: "demo-6", name: "China Town", description: "Authentic Chinese.", cuisine: ["Chinese"], image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800", rating: 4.4, deliveryTime: 28, menu: [
    { _id: "m1", name: "Kung Pao Chicken", price: 299, category: "Main", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400" },
  ]},
  "demo-7": { _id: "demo-7", name: "Cafe Mocha", description: "Coffee & desserts.", cuisine: ["Cafe"], image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", rating: 4.5, deliveryTime: 22, menu: [
    { _id: "m1", name: "Cappuccino", price: 149, category: "Coffee", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400" },
  ]},
};
