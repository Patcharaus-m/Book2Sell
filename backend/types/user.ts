export interface IUser {
  username: string; // [cite: 36]
  password?: string; // [cite: 37]
  email: string; // [cite: 39]
  phone: string; // [cite: 38]
  contactChannel?: string; // [cite: 40]
  creditBalance?: number; // สำหรับระบบจ่ายเงินเป็นเครดิต [cite: 42]
}