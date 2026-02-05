import React from 'react';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useBook } from "../../context/BookContext";
import { Link } from "react-router-dom";
import { ShoppingCart, ShoppingBag, ImageIcon, Trash2, Edit } from "lucide-react";

export default function BookCard({ book, onBookClick }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { deleteBook } = useBook();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(book);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบหนังสือเล่มนี้?')) {
            deleteBook(book.id);
        }
    };

    const handleCardClick = () => {
        if (onBookClick) onBookClick(book);
    };

    const isOwner = user && user.id === book.sellerId;

    const hasDiscount = book.originalPrice > book.sellingPrice;
    const discountPercentage = hasDiscount ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100) : 0;

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-3xl border border-purple-50 p-4 hover:shadow-2xl hover:shadow-purple-500/10 transition-all group relative flex flex-col h-full cursor-pointer hover:border-purple-200"
        >
            {/* Image Wrapper */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 mb-5 border border-gray-50">
                <img
                    src={book.images?.[0] || book.imageUrl || 'https://via.placeholder.com/150'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {isOwner && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onBookClick) onBookClick(book, true); // true for edit mode
                            }}
                            className="bg-blue-500/90 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-blue-600 transition-all shadow-lg"
                            title="แก้ไขหนังสือ"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-red-600 transition-all shadow-lg"
                            title="ลบหนังสือ"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}

                {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                        ลด {discountPercentage}%
                    </div>
                )}

                {book.images?.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <ImageIcon size={10} /> {book.images.length}
                    </div>
                )}

                <div className="absolute inset-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {book.category}
                    </span>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${book.condition.includes('9') || book.condition === 'มือหนึ่ง' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {book.condition}
                    </span>
                </div>

                <div className="block group/title">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover/title:text-purple-600 transition-colors h-10">{book.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4 font-medium">{book.author}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        {hasDiscount && (
                            <span className="text-[10px] font-bold text-gray-300 line-through">฿{book.originalPrice}</span>
                        )}
                        <span className="text-lg font-black text-gray-900">฿{book.sellingPrice}</span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 group/btn border border-white/20"
                        title="เพิ่มลงในรถเข็น"
                    >
                        <ShoppingCart className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
