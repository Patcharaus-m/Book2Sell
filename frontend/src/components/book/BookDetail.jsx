import React, { useState } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBook } from "../../context/BookContext";
import { useCart } from "../../context/CartContext";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCcw, Image as ImageIcon } from "lucide-react";

export default function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { books } = useBook();
    const { addToCart } = useCart();
    const [activeImage, setActiveImage] = useState(0);

    const book = books.find(b => b.id === id);

    if (!book) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900">ไม่พบข้อมูลหนังสือ</h2>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block font-bold">กลับสู่หน้าหลัก</Link>
            </div>
        );
    }

    const images = book.images || (book.imageUrl ? [book.imageUrl] : []);
    const hasDiscount = book.originalPrice > book.price;
    const discountPercentage = hasDiscount ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors group"
            >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span>กลับ</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 shadow-2xl border border-gray-100">
                        <img
                            src={images[activeImage]}
                            alt={book.title}
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                        {hasDiscount && (
                            <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-2xl shadow-xl">
                                ลดแรง {discountPercentage}%
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Grid */}
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-blue-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-black rounded-xl uppercase tracking-widest">
                                {book.category}
                            </span>
                            <span className={`px-3 py-1 text-xs font-black rounded-xl uppercase tracking-widest ${book.condition.includes('9') || book.condition === 'มือหนึ่ง' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                {book.condition}
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">{book.title}</h1>
                        <p className="text-xl text-gray-500 font-medium">แต่งโดย <span className="text-purple-600">{book.author}</span></p>
                    </div>

                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex justify-between items-center">
                        <div>
                            <span className="text-sm font-bold text-gray-400 block mb-1">ราคาขายพิเศษ</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-black text-gray-900">฿{book.price}</span>
                                {hasDiscount && (
                                    <span className="text-xl font-bold text-gray-300 line-through">฿{book.originalPrice}</span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-black text-purple-600 bg-purple-100/50 px-3 py-1 rounded-full uppercase tracking-tighter">
                                {book.stock > 0 ? `เหลือเพียง ${book.stock} เล่ม` : 'สินค้าหมด'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            รายละเอียดหนังสือ
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                            {book.description || "ไม่มีรายละเอียดเพิ่มเติมสำหรับหนังสือเล่มนี้"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                            <ShieldCheck className="text-purple-600" />
                            <span>ตรวจสอบสภาพแล้ว</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                            <Truck className="text-purple-600" />
                            <span>ส่งเร็วทั่วไทย</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                            <RefreshCcw className="text-purple-600" />
                            <span>รับประกันของแท้</span>
                        </div>
                    </div>

                    <button
                        onClick={() => addToCart(book)}
                        disabled={book.stock <= 0}
                        className={`w-full py-5 px-8 font-black text-xl rounded-[2rem] shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${book.stock > 0 ? 'bg-gray-900 text-white hover:bg-purple-600 hover:shadow-purple-500/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        <ShoppingBag className="h-6 w-6" />
                        <span>{book.stock > 0 ? 'เพิ่มลงในรถเข็น' : 'สินค้าหมดชั่วคราว'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
