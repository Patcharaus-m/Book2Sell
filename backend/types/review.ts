export interface IReview {
  orderId: string;
  rating: number; // 1-5 ดาว [cite: 44]
  comment?: string; // [cite: 30]
}