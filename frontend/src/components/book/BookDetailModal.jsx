import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Info, CheckCircle, Package, MessageCircle, Star, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

/**
 * BookDetailModal - โมดูลแสดงรายละเอียดหนังสือเชิงลึก
 * รองรับการดูรูปภาพหลายรูป, รายละเอียดสภาพสินค้า และจุดตำหนิ
 */
const BookDetailModal = ({ isOpen, onClose, book }) => {
    const { addToCart } = useCart();
    const [activeImage, setActiveImage] = useState('');

    // อัปเดตรูปหลักเมื่อข้อมูลหนังสือเปลี่ยนหรือโหลตเข้ามา
    useEffect(() => {
        if (book && book.images && book.images.length > 0) {
            setActiveImage(book.images[0]);
        } else if (book) {
            setActiveImage(book.imageUrl || 'https://via.placeholder.com/400x600?text=No+Image');
        }
    }, [book, isOpen]);

    if (!isOpen || !book) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleAddToCart = () => {
        addToCart(book);
    };

    const hasDiscount = book.originalPrice > (book.sellingPrice || book.price);
    const allImages = book.images && book.images.length > 0 ? book.images : [book.imageUrl || 'https://via.placeholder.com/400x600?text=No+Image'];

    // ดึงรีวิวของหนังสือนี้
    const reviews = book.reviews || [];
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div
            className="fixed inset-0 z-[100] grid place-items-center h-screen w-screen bg-black/70 backdrop-blur-md p-4 transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-gray-100 flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full transition-all z-20 shadow-sm border border-gray-100
                     hover:bg-red-500 hover:text-white hover:rotate-180 duration-250 active:scale-95 active:text-red-1000"
                >
                    <X size={20} />
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-2/5 p-6 bg-gray-50/50 flex flex-col gap-4 border-r border-gray-50 overflow-y-auto custom-scrollbar">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-inner border border-gray-100 group">
                        <img
                            src={activeImage}
                            alt={book.title}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        {hasDiscount && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg ring-4 ring-red-500/20">
                                PROMO
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar py-2">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md scale-95' : 'border-white hover:border-gray-200'}`}
                                >
                                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Center: Info Section */}
                <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto custom-scrollbar border-r border-gray-50">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            {book.categories?.map((cat, i) => (
                                <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-purple-100/50">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-xl font-black text-gray-900 leading-tight mb-1">
                            {book.title}
                        </h2>
                        <p className="text-sm text-gray-500 font-bold flex items-center gap-1">
                            โดย <span className="text-purple-600">{book.author}</span>
                        </p>
                    </div>

                    {/* Price & Status */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ราคาขาย</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-gray-900">฿{book.sellingPrice || book.price}</span>
                                {(hasDiscount || book.coverPrice) && (
                                    <span className="text-sm font-bold text-gray-300 line-through">
                                        ฿{book.originalPrice || book.coverPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">สถานะ</p>
                            <div className="flex flex-col">
                                <div className={`flex items-center gap-1 font-black text-sm ${book.condition.includes('9') || book.condition === 'มือหนึ่ง' ? 'text-green-600' : 'text-orange-600'}`}>
                                    <CheckCircle size={14} />
                                    <span>{book.condition}</span>
                                </div>
                                <p className="text-[10px] font-black text-purple-600 mt-0.5">คงเหลือ {book.stock || 0} เล่ม</p>
                            </div>
                        </div>
                    </div>

                    {/* Description / Defects */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Info size={14} className="text-amber-500" />
                            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">รายละเอียด</h3>
                        </div>
                        <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl relative overflow-hidden">
                            <p className="text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                                {book.description || 'ไม่มีข้อมูลเพิ่มเติม'}
                            </p>
                        </div>
                    </div>

                    {/* Seller Info - ผู้ที่ลงขายหนังสือ */}
                    <div className="mb-4 p-4 bg-gradient-to-br from-purple-100/50 to-purple-50/30 rounded-2xl border border-purple-200/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                                {(book.sellerId?.username || book.sellerId?.name || book.sellerName)?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] font-black text-purple-600 uppercase tracking-wider">ลงขายโดย</p>
                                <p className="text-base font-black text-gray-900">
                                    {book.sellerId?.username || book.sellerId?.name || book.sellerName || 'ไม่ระบุผู้ขาย'}
                                </p>
                                {book.sellerId?.email && (
                                    <p className="text-[10px] text-gray-400 truncate">{book.sellerId.email}</p>
                                )}
                            </div>
                            <button className="p-2 text-purple-600 hover:bg-white/80 rounded-xl transition-all" title="ติดต่อผู้ขาย">
                                <MessageCircle size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            disabled={Number(book.stock) === 0}
                            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${Number(book.stock) === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gray-900 text-white shadow-gray-200 hover:bg-purple-600 hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            <ShoppingCart size={14} />
                            {Number(book.stock) === 0 ? 'สินค้าหมด' : 'เพิ่มลงรถเข็น'}
                        </button>
                    </div>
                </div>

                {/* Right: Reviews Section */}
                <div className="w-full md:w-1/4 p-6 pt-14 bg-gradient-to-b from-purple-50/30 to-white flex flex-col overflow-y-auto custom-scrollbar">
                    {/* Reviews Header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Star size={16} className="text-amber-500" fill="currentColor" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">รีวิว</h3>
                        </div>

                        {/* Average Rating */}
                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-3xl font-black text-gray-900">{averageRating || '-'}</div>
                            <div>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                                            stroke={i < Math.round(averageRating) ? "none" : "currentColor"}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                    {reviews.length} รีวิว
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="flex-1 space-y-3 overflow-y-auto">
                        {reviews.length > 0 ? (
                            reviews.slice(0, 5).map((review, idx) => (
                                <div
                                    key={review.id || idx}
                                    className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-purple-500 flex-shrink-0">
                                            <User size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">
                                                {review.userName || 'ผู้ใช้'}
                                            </p>
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={10}
                                                        fill={i < review.rating ? "currentColor" : "none"}
                                                        stroke={i < review.rating ? "none" : "currentColor"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3 italic">
                                            "{review.comment}"
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageCircle size={20} className="text-gray-300" />
                                </div>
                                <p className="text-xs font-bold text-gray-400">ยังไม่มีรีวิว</p>
                                <p className="text-[10px] text-gray-300 mt-1">เป็นคนแรกที่รีวิว!</p>
                            </div>
                        )}
                    </div>

                    {/* View All Reviews */}
                    {reviews.length > 5 && (
                        <button className="mt-3 w-full py-2 text-[10px] font-black text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all uppercase tracking-widest">
                            ดูทั้งหมด ({reviews.length})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailModal;
