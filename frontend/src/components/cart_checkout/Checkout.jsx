import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, CreditCard, Wallet, CheckCircle, ArrowLeft, ShieldCheck } from "lucide-react";

export default function Checkout() {
    const { user, processPayment } = useAuth();
    const { cart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('credits');
    const [isOrdered, setIsOrdered] = useState(false);
    const [error, setError] = useState('');

    const handlePlaceOrder = () => {
        if (paymentMethod === 'credits') {
            const result = processPayment(totalAmount);
            if (!result.success) {
                setError(result.message);
                return;
            }
        }

        setIsOrdered(true);
        setTimeout(() => {
            clearCart();
            navigate('/');
        }, 3000);
    };

    if (isOrdered) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
                        <CheckCircle size={60} strokeWidth={3} />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-gray-900">สั่งซื้อสำเร็จ!</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                    ขอบคุณที่วางใจเลือกซื้อหนังสือกับเรา <br />
                    กำลังพาท่านกลับสู่หน้าหลัก...
                </p>
                <div className="pt-4">
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 animate-[progress_3s_ease-in-out]" />
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">ไม่มีสินค้าสำหรับการชำระเงิน</h2>
                <Link to="/" className="text-blue-600 hover:underline font-bold">ไปเลือกช้อปเลย!</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold mb-8 transition-colors group w-fit">
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span>กลับสู่ร้านค้า</span>
            </Link>

            <h1 className="text-4xl font-black text-gray-900 mb-12">สรุปการสั่งซื้อ</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-blue-600" />
                                สินค้าในออเดอร์ ({cart.length})
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-24 object-cover rounded-xl shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium">สภาพ {item.condition}%</p>
                                    </div>
                                    <span className="text-lg font-black text-gray-900">฿{item.sellingPrice || item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                                วิธีการชำระเงิน
                            </h2>
                        </div>
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('credits')}
                                className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'credits' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 hover:bg-gray-50'}`}
                            >
                                <div className={`p-3 rounded-xl ${paymentMethod === 'credits' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Wallet size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">ใช้เครดิตร้านค้า</p>
                                    <p className="text-xs text-gray-500">คงเหลือ: ฿{user?.storeCredits || 0}</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 hover:bg-gray-50'}`}
                            >
                                <div className={`p-3 rounded-xl ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <CreditCard size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">บัตรเครดิต/เดบิต</p>
                                    <p className="text-xs text-gray-500">ระบบจำลอง</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Totals */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl shadow-gray-200">
                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">สรุปยอดเงิน</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between font-bold">
                                <span className="text-gray-400">ราคาสินค้า ({cart.length})</span>
                                <span>฿{totalAmount}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span className="text-gray-400">ค่าจัดส่ง</span>
                                <span className="text-green-400">ฟรี</span>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-6 mb-8">
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg font-bold">ยอดสุทธิ</span>
                                <span className="text-4xl font-black">฿{totalAmount}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full py-5 bg-white text-gray-900 font-black text-xl rounded-2xl hover:bg-blue-50 transition-all active:scale-[0.98] shadow-xl shadow-black/20"
                        >
                            สั่งซื้อทันที
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                            <ShieldCheck size={16} />
                            <span>ชำระผ่านระบบที่มีความปลอดภัยสูง</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
