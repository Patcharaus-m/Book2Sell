export interface IOrder {
  bookId: string; // เชื่อมกับ IBook
  buyerId: string; // เชื่อมกับ IUser
  shippingAddress: string; // [cite: 29]
  status: "pending" | "preparing" | "shipped"; // 
  trackingNumber?: string; // [cite: 15]
  totalPrice: number; // [cite: 26]
}