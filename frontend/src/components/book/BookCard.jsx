import React from 'react';
import { useCart } from "../../context/CartContext";
import { ShoppingCart, ImageIcon } from "lucide-react";

export default function BookCard({ book, onBookClick }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(book);
    };

    const handleCardClick = () => {
        if (onBookClick) onBookClick(book);
    };


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
                        <div className="flex items-center gap-2 mb-0.5">
                            {hasDiscount && (
                                <span className="text-xs font-bold text-gray-300 line-through decoration-purple-200">฿{book.originalPrice || book.coverPrice}</span>
                            )}
                            <span className="text-xs font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">สต็อก: {book.stock || 0}</span>
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tight">฿{book.sellingPrice}</span>
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
