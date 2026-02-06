import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, CreditCard, Wallet, CheckCircle, ArrowLeft, ShieldCheck, Tag, Info } from "lucide-react";

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
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[3.5rem] p-12 shadow-3xl animate-in zoom-in-95 spring-bounce-20 duration-500 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-pink-50 rounded-[2.5rem] flex items-center justify-center text-pink-500 mb-8 shadow-sm border border-pink-100 animate-bounce">
                        <CheckCircle size={54} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">สั่งซื้อสำเร็จ!</h2>
                    <p className="text-gray-500 font-medium leading-relaxed mb-10">
                        ขอบคุณที่เลือกซื้อหนังสือกับเรา <br />
                        ความรู้ใหม่กำลังเดินทางไปหาคุณ
                    </p>

                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-400 to-purple-600 animate-[progress_3s_linear]" />
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">พาคุณกลับหน้าหลักสักครู่...</p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/40 backdrop-blur-lg rounded-[3rem] border border-white/50 p-16 shadow-xl text-center border-dashed">
                    <div className="w-24 h-24 bg-gray-50/50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag size={44} className="text-gray-200" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">ตะกร้าว่างเปล่า</h2>
                    <p className="text-gray-500 font-medium mb-10">ไม่มีสินค้าสำหรับการชำระเงินในขณะนี้</p>
                    <Link to="/" className="inline-flex items-center justify-center px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-gray-200">
                        ไปเลือกช้อปเลย!
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-black mb-10 transition-all group w-fit hover:-translate-x-1">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm uppercase tracking-widest">กลับไปเลือกซื้อ</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Checkout</h1>
                    <p className="text-gray-400 italic font-medium">ทำรายการสั่งซื้อสุดท้ายก่อนรับหนังสือ</p>
                </div>
                <div className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 text-gray-500 font-bold text-sm">
                    {cart.length} รายการในออเดอร์
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/20 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="relative flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
                                <ShoppingBag size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">รายการสินค้า</h2>
                        </div>

                        <div className="space-y-8 relative">
                            {cart.map((item) => (
                                <div key={item.id} className="group flex gap-8 items-center p-4 hover:bg-white/40 rounded-3xl transition-all">
                                    <div className="relative w-20 h-28 flex-shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={item.image || (item.images && item.images[0]) || item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 py-1 bg-black/60 backdrop-blur-sm text-[8px] text-white text-center font-bold rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.condition}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-black text-gray-400 rounded-md uppercase tracking-tighter group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">Book</span>
                                            {item.isbn && <span className="text-[10px] text-gray-300 font-medium">ISBN: {item.isbn}</span>}
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 truncate mb-1 group-hover:text-pink-700 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-gray-400 font-medium italic">โดย {item.author || 'ไม่ระบุผู้แต่ง'}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-900 group-hover:scale-110 transition-transform origin-right">
                                            ฿{((item.sellingPrice || item.price) * (item.quantity || 1)).toLocaleString()}
                                        </p>
                                        <div className="flex flex-col items-end mt-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-tight bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 italic">x {item.quantity || 1} เล่ม</p>
                                            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mt-0.5">@ ฿{(item.sellingPrice || item.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20 overflow-hidden relative">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl -ml-32 -mb-32" />

                        <div className="relative flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">วิธีการชำระเงิน</h2>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-50/50 rounded-xl text-purple-600 text-[10px] font-black uppercase tracking-widest border border-purple-100">
                                <ShieldCheck size={14} /> Encrypted
                            </div>
                        </div>

                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <button
                                onClick={() => setPaymentMethod('credits')}
                                className={`group flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden ${paymentMethod === 'credits'
                                    ? 'border-purple-600 bg-white shadow-xl shadow-purple-100/50'
                                    : 'border-white bg-white/20 hover:bg-white/40 grayscale hover:grayscale-0'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${paymentMethod === 'credits' ? 'bg-purple-600 text-white rotate-6' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    <Wallet size={28} />
                                </div>
                                <div className="text-left">
                                    <p className={`font-black text-lg ${paymentMethod === 'credits' ? 'text-gray-900' : 'text-gray-500'}`}>เครดิตร้านค้า</p>
                                    <p className="text-[11px] font-bold text-purple-500">คงเหลือ: ฿{(user?.creditBalance || 0).toLocaleString()}</p>
                                </div>
                                {paymentMethod === 'credits' && (
                                    <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white scale-75">
                                            <CheckCircle size={14} />
                                        </div>
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`group flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden ${paymentMethod === 'card'
                                    ? 'border-pink-600 bg-white shadow-xl shadow-pink-100/50'
                                    : 'border-white bg-white/20 hover:bg-white/40 grayscale hover:grayscale-0'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${paymentMethod === 'card' ? 'bg-pink-600 text-white rotate-6' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    <CreditCard size={28} />
                                </div>
                                <div className="text-left">
                                    <p className={`font-black text-lg ${paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-500'}`}>บัตรเครดิต</p>
                                    <p className="text-[11px] font-bold text-pink-500">Simulator System</p>
                                </div>
                                {paymentMethod === 'card' && (
                                    <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                                        <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-white scale-75">
                                            <CheckCircle size={14} />
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Totals Summary */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-pink-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        {/* Decorative circles */}
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-pink-600/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px]" />

                        <div className="relative">
                            <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Order Summary</h3>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                                    <span className="text-sm font-bold text-slate-400">ราคาสินค้า</span>
                                    <span className="text-lg font-black tracking-tight">฿{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-bold text-slate-400">ค่าจัดส่ง</span>
                                        <Info size={12} className="text-slate-600" />
                                    </div>
                                    <span className="text-md font-black text-pink-400 uppercase tracking-widest text-sm">FREE</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 group/item hover:translate-x-1 transition-transform">
                                    <span className="text-sm font-bold text-slate-400">ส่วนลดพิเศษ</span>
                                    <span className="text-md font-black text-rose-400">- ฿0</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10 mb-12">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">ยอดรวมสุทธิ</p>
                                        <p className="text-sm font-bold text-slate-500">VAT Included</p>
                                    </div>
                                    <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-300">
                                        ฿{totalAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-xs font-bold text-center animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full py-5.5 bg-white text-gray-900 font-black text-xl rounded-[2rem] hover:bg-pink-50 transition-all active:scale-95 shadow-2xl hover:shadow-white/10 flex items-center justify-center gap-3 group/btn"
                            >
                                <span>สั่งซื้อทันที</span>
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <ArrowLeft size={18} className="rotate-180" />
                                </div>
                            </button>

                            <div className="mt-8 flex flex-col items-center gap-3">
                                <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.1em] text-slate-500 uppercase">
                                    <ShieldCheck size={14} className="text-pink-500" />
                                    <span>Secure checkout</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-white/5 rounded border border-white/10" />
                                    <div className="w-8 h-5 bg-white/5 rounded border border-white/10" />
                                    <div className="w-8 h-5 bg-white/5 rounded border border-white/10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white/20 backdrop-blur-md rounded-[2.5rem] border border-white/50 border-dashed">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-pink-500"><Tag size={20} /></div>
                            <div>
                                <h4 className="font-black text-gray-900 mb-1 italic">มีคูปองลับ?</h4>
                                <p className="text-xs text-gray-500 font-medium">กรอกรหัสส่วนลดหลังชำระเงินสำเร็จ เพื่อรับเครดิตคืนในรอบถัดไป</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
