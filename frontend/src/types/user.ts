export interface IUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    storeCredits: number;
    role: "user";
}

export interface ICartItem {
    bookId: string;
    title: string;
    price: number;
    coverImage: string;
    quantity: number;
}
