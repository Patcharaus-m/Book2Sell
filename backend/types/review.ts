// types/review.ts

export interface IReview {
  _id: string;
  orderId: string;
  reviewerId: {
    _id: string;
    name: string;
    image?: string; // ถ้ามีรูปโปรไฟล์
  };
  sellerId: string; // ✅ เพิ่มมาแล้ว
  rating: number;
  comment?: string;
  createdAt: string;
}