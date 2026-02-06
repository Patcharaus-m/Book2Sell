import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Info, CheckCircle, Package, MessageCircle } from 'lucide-react';
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
        // เลือกที่จะปิด Modal หรือไม่ก็ได้หลังจากหยิบใส่รถเข็น
    };

    const hasDiscount = book.originalPrice > (book.sellingPrice || book.price);
    const allImages = book.images && book.images.length > 0 ? book.images : [book.imageUrl || 'https://via.placeholder.com/400x600?text=No+Image'];

    return (
        <div
            className="fixed inset-0 z-[100] grid place-items-center h-screen w-screen bg-black/70 backdrop-blur-md p-4 transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div
                className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-gray-100 flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 rounded-full transition-all z-20 shadow-sm border border-gray-100"
                >
                    <X size={20} />
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 p-6 bg-gray-50/50 flex flex-col gap-4 border-r border-gray-50 overflow-y-auto custom-scrollbar">
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

                {/* Right: Info Section */}
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto custom-scrollbar">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            {book.categories?.map((cat, i) => (
                                <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-purple-100/50">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                            {book.title}
                        </h2>
                        <p className="text-gray-500 font-bold flex items-center gap-2">
                            โดย <span className="text-purple-600">{book.author}</span>
                        </p>
                    </div>

                    {/* Price & Status */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ราคาขาย</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-gray-900">฿{book.sellingPrice || book.price}</span>
                                {(hasDiscount || book.coverPrice) && (
                                    <span className="text-lg font-bold text-gray-300 line-through decoration-purple-100">
                                        ฿{book.originalPrice || book.coverPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">สถานะ / สต็อก</p>
                            <div className="flex flex-col">
                                <div className={`flex items-center gap-2 font-black text-lg ${book.condition.includes('9') || book.condition === 'มือหนึ่ง' ? 'text-green-600' : 'text-orange-600'}`}>
                                    <CheckCircle size={18} />
                                    <span>{book.condition}</span>
                                </div>
                                <p className="text-xs font-black text-purple-600 mt-1 uppercase bg-purple-50 w-fit px-2 py-0.5 rounded-lg border border-purple-100">คงเหลือ {book.stock || 0} เล่ม</p>
                            </div>
                        </div>
                    </div>

                    {/* Description / Defects (CRITICAL SECTION) */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={16} className="text-amber-500" />
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">รายละเอียดและตำหนิ</h3>
                        </div>
                        <div className="p-5 bg-amber-50/30 border border-amber-100/50 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                <Package size={48} className="text-amber-600" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed relative z-10 whitespace-pre-line">
                                {book.description || 'ไม่มีข้อมูลเพิ่มเติมสำหรับหนังสือเล่มนี้'}
                            </p>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="mb-8 p-4 bg-purple-50/30 rounded-2xl border border-purple-100/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black">
                                {book.sellerName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ผู้ลงขาย</p>
                                <p className="text-xs font-black text-gray-900">{book.sellerName || 'ไม่ระบุชื่อ'}</p>
                            </div>
                        </div>
                        <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-xl transition-all" title="ติดต่อผู้ขาย">
                            <MessageCircle size={20} />
                        </button>
                    </div>

                    <div className="mt-auto flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={Number(book.stock) === 0}
                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${Number(book.stock) === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gray-900 text-white shadow-gray-200 hover:bg-purple-600 hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            <ShoppingCart size={16} />
                            {Number(book.stock) === 0 ? 'สินค้าหมด' : 'เพิ่มลงในรถเข็น'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailModal;
