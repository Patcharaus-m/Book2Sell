export interface IBook {
    id: string; // Frontend ID (or MongoDB _id)
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publishYear?: string;
    category: string;

    // Pricing
    originalPrice?: number;
    sellingPrice: number;

    // Condition
    conditionRating: number; // e.g., 90
    defectDescription?: string;
    status: "available" | "reserved" | "sold" | "archived";

    // Images
    images: string[]; // [Cover, Spine, Defects...]

    stock: number;
    createdAt?: string;
}

export type BookSortOption = "price_asc" | "price_desc" | "newest" | "popularity";
