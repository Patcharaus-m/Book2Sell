import React from 'react';
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";

export default function CartDrawer() {
    const { cart, removeFromCart, updateQuantity, isDrawerOpen, setIsDrawerOpen, totalAmount } = useCart();

    if (!isDrawerOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsDrawerOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="h-6 w-6 text-purple-600" />
                                <span>รถเข็นของคุณ</span>
                                <span className="ml-2 bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-lg border border-purple-100/50">
                                    {cart.length} รายการ
                                </span>
                            </h2>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <p className="text-gray-500 font-medium">ไม่มีสินค้าในรถเข็น</p>
                                    <Link
                                        to="/"
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="text-purple-600 font-bold hover:text-pink-600 transition-colors"
                                    >
                                        ไปเลือกช้อปเลย!
                                    </Link>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">สภาพ {item.condition}%</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-purple-600 disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-base">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-purple-600 disabled:opacity-30"
                                                        disabled={item.quantity >= (item.stock || 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-black text-lg">฿{(item.sellingPrice || item.price) * item.quantity}</span>
                                                    {item.quantity >= item.stock && (
                                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter mt-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">ขีดจำกัดสต็อก</span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="mt-2 text-[10px] font-bold text-gray-300 hover:text-red-500 transition-colors uppercase flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> ลบออก
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="px-6 py-8 bg-gray-50 border-t border-gray-100 space-y-6">
                                <div className="flex justify-between items-center text-gray-900">
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">ราคารวมทั้งหมด</span>
                                    <span className="text-3xl font-black">฿{totalAmount}</span>
                                </div>
                                <Link
                                    to="/checkout"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-center rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group border border-white/20"
                                >
                                    <span>ไปที่หน้าชำระเงิน</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-center text-xs text-gray-400 font-medium">ภาษีมูลค่าเพิ่มถูกรวมไว้ในการสั่งซื้อแล้ว</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
