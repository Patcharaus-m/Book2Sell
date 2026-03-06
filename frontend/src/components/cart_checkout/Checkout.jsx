import React, { useState } from 'react';
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import { useBook } from "../../context/useBook";

import { createOrderService } from "../../services/orderService";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    Wallet,
    CheckCircle,
    ArrowLeft,
    Star,
    BookOpen,
    MapPin,
    Save,
    History
} from "lucide-react";

export default function Checkout() {
    const { user, processPayment, addPurchasedBooks, updateUser } = useAuth();
    const { cart, totalAmount, clearCart } = useCart();
    const { refreshBooks } = useBook();

    const navigate = useNavigate();
    const [isOrdered, setIsOrdered] = useState(false);
    const [error, setError] = useState('');
    const [addressError, setAddressError] = useState('');

    // Address State
    const [address, setAddress] = useState({
        houseNo: '',
        province: '',
        district: '',
        subDistrict: '',
        road: '',
        soi: '',
        postalCode: '',
        note: ''
    });

    // Modals State
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Default address: load from localStorage
    const DEFAULT_ADDR_KEY = `defaultAddress_${user?._id || user?.id || 'guest'}`;
    const [savedAddress, setSavedAddress] = useState(() => {
        try { return JSON.parse(localStorage.getItem(DEFAULT_ADDR_KEY)); } catch { return null; }
    });
    const [saveAddrFeedback, setSaveAddrFeedback] = useState(false);

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;

        // Validate required address fields
        const requiredFields = [
            { key: 'houseNo', label: 'บ้านเลขที่' },
            { key: 'subDistrict', label: 'ตำบล/แขวง' },
            { key: 'district', label: 'อำเภอ/เขต' },
            { key: 'province', label: 'จังหวัด' },
            { key: 'postalCode', label: 'รหัสไปรษณีย์' },
        ];
        const missing = requiredFields.filter(f => !address[f.key]?.trim());
        if (missing.length > 0) {
            setAddressError(`กรุณากรอก: ${missing.map(f => f.label).join(', ')}`);
            // Scroll to address section
            document.getElementById('address-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setAddressError('');
        setShowConfirmModal(true);
    };

    const handleConfirmPayment = async () => {
        // ตรวจสอบเครดิตก่อน
        if ((user?.creditBalance || 0) < totalAmount) {
            setError("ยอดเงินคงเหลือไม่พอ กรุณาเติมเครดิต");
            setShowConfirmModal(false);
            return;
        }

        // สั่งซื้อทุกรายการใน cart
        const orderItems = [...cart];
        const createdOrders = [];  // เก็บ orderId สำหรับใช้ตอน review
        let allSuccess = true;
        let lastError = "";

        for (const item of orderItems) {
            // Debug: ดูค่า address state
            console.log('Address state:', address);

            // รวม address จากฟอร์มเป็น string
            let fullAddress = `${address.houseNo || ''} ${address.soi ? 'ซอย ' + address.soi : ''} ${address.road ? 'ถนน ' + address.road : ''} ${address.subDistrict || ''} ${address.district || ''} ${address.province || ''} ${address.postalCode || ''} ${address.note ? '(' + address.note + ')' : ''}`.trim();

            // ถ้าไม่มีที่อยู่ ให้ใช้ค่า default
            if (!fullAddress || fullAddress.length < 5) {
                fullAddress = "ที่อยู่เริ่มต้น (กรุณาแก้ไขในโปรไฟล์)";
            }

            // Debug: ดูข้อมูลที่ส่งไป API
            const orderData = {
                bookId: item.id || item._id,
                userId: user._id || user.id,
                shippingAddress: fullAddress
            };
            console.log('Order Data being sent:', orderData);
            console.log('shippingAddress value:', orderData.shippingAddress);
            console.log('shippingAddress length:', orderData.shippingAddress.length);

            const result = await createOrderService(orderData);

            // Debug: ดู response structure จาก order API
            console.log('Order API Result:', result);
            console.log('Order payload:', result.payload);

            // Backend ส่ง status เป็น number (2001 = success) และ error: null ถ้าสำเร็จ
            if (result.error || result.code >= 400) {
                allSuccess = false;
                lastError = result.error?.message || "เกิดข้อผิดพลาด";
                console.log('Order creation FAILED:', lastError);
                break;
            }

            // Debug: ดู response structure จาก order API
            console.log('Order API Result:', result);
            console.log('Order payload:', result.payload);

            // เก็บข้อมูล order พร้อมกับ book info สำหรับใช้ตอน review
            // ลองหลายๆ path เพื่อหา orderId ที่ถูกต้อง
            const orderId = result.payload?.order?._id ||
                result.payload?.order?.id ||
                result.payload?._id ||
                result.payload?.id;

            // ดึง newBalance จาก Backend
            const newBalance = result.payload?.newBalance;

            console.log('Extracted orderId:', orderId);
            console.log('New balance from backend:', newBalance);

            createdOrders.push({
                ...item,
                orderId: orderId,
                newBalance: newBalance
            });
        }

        if (!allSuccess) {
            setError(lastError);
            setShowConfirmModal(false);
            return;
        }

        // สำเร็จทั้งหมด - อัปเดต local state ด้วยค่าจาก Backend (ใช้ค่าล่าสุดจาก order สุดท้าย)
        const lastOrderResult = createdOrders.length > 0 ? createdOrders[createdOrders.length - 1] : null;

        console.log('=== UPDATING CREDIT BALANCE ===');
        console.log('lastOrderResult:', lastOrderResult);
        console.log('lastOrderResult.newBalance:', lastOrderResult?.newBalance);

        if (lastOrderResult && lastOrderResult.newBalance !== undefined) {
            // ใช้ค่า newBalance จาก Backend เพื่อ sync กับ Database
            console.log('Updating user credit balance to:', lastOrderResult.newBalance);
            updateUser({ creditBalance: lastOrderResult.newBalance });
        } else {
            // Fallback: ถ้าไม่มี newBalance ให้คำนวณเอง
            console.log('FALLBACK: Using processPayment instead');
            processPayment(totalAmount);
        }

        addPurchasedBooks(orderItems.map(item => item.id || item._id));

        // รีเฟรชรายการหนังสือให้หนังสือที่ซื้อไปหายจากหน้าร้าน
        refreshBooks();

        setShowConfirmModal(false);
        setIsOrdered(true);
        // After success, redirect to history page
        setTimeout(() => {
            clearCart();
            navigate('/history');
        }, 2500);
    };

    // Save default address to localStorage
    const handleSaveDefault = () => {
        localStorage.setItem(DEFAULT_ADDR_KEY, JSON.stringify(address));
        setSavedAddress(address);
        setSaveAddrFeedback(true);
        setTimeout(() => setSaveAddrFeedback(false), 2000);
    };

    // Load default address
    const handleLoadDefault = () => {
        if (savedAddress) setAddress(savedAddress);
    };

    if (isOrdered) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[3.5rem] p-12 shadow-3xl animate-in zoom-in-95 spring-bounce-20 duration-500 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mb-8 shadow-sm border border-emerald-100 animate-bounce">
                        <CheckCircle size={54} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">สั่งซื้อสำเร็จ!</h2>
                    <p className="text-gray-500 font-medium leading-relaxed mb-10">
                        ขอบคุณที่เลือกซื้อหนังสือกับเรา <br />
                        กำลังพาคุณไปดูสถานะการสั่งซื้อ...
                    </p>

                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-600 animate-[progress_2.5s_linear]" />
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        <History size={12} /> กำลังพาไปหน้าประวัติ...
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !isOrdered) {
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
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                                <ShoppingBag size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">รายการสินค้า</h2>
                        </div>
                        <div className="space-y-8 relative">
                            {cart.map((item) => (
                                <div key={item.id || item._id} className="group flex gap-8 items-center p-4 hover:bg-white/40 rounded-3xl transition-all">
                                    <div className="relative w-20 h-28 flex-shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={item.image || (item.images && item.images[0]) || item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-black text-gray-900 truncate mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-400 font-medium italic">โดย {item.author || 'ไม่ระบุผู้แต่ง'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                            {((item.sellingPrice || item.price || 0) * (item.quantity || 1)).toLocaleString()} <i className="bi bi-coin" style={{ fontSize: '20px' }} />
                                        </p>
                                        <p className="text-xs font-black text-gray-400 uppercase italic">x {item.quantity || 1} เล่ม</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* Address Card */}
                    <div id="address-section" className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20 overflow-hidden relative">
                        <div className="relative flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">ที่อยู่จัดส่ง</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                {savedAddress && (
                                    <button
                                        type="button"
                                        onClick={handleLoadDefault}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-black rounded-2xl text-xs border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95"
                                    >
                                        <MapPin size={12} /> ที่อยู่ที่บันทึกไว้
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleSaveDefault}
                                    className={`flex items-center gap-2 px-4 py-2 font-black rounded-2xl text-xs border transition-all active:scale-95 ${saveAddrFeedback
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                                        }`}
                                >
                                    <Save size={12} /> {saveAddrFeedback ? 'บันทึกแล้ว!' : 'บันทึกเป็นที่อยู่หลัก'}
                                </button>
                            </div>
                        </div>
                        {/* Address validation error */}
                        {addressError && (
                            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-3">
                                <Info size={16} className="flex-shrink-0" />
                                <span className="text-sm font-bold">{addressError}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* House No */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">บ้านเลขที่ / หมู่บ้าน / อาคาร <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={address.houseNo}
                                    onChange={(e) => { setAddress({ ...address, houseNo: e.target.value }); if (addressError) setAddressError(''); }}
                                    className={`w-full bg-white/50 border rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 transition-all ${addressError && !address.houseNo.trim() ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                                    placeholder="ระบุบ้านเลขที่..."
                                />
                            </div>

                            {/* Road & Soi */}
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ถนน</label>
                                <input
                                    type="text"
                                    value={address.road}
                                    onChange={(e) => setAddress({ ...address, road: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    placeholder="ถนน..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ซอย</label>
                                <input
                                    type="text"
                                    value={address.soi}
                                    onChange={(e) => setAddress({ ...address, soi: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    placeholder="ซอย..."
                                />
                            </div>

                            {/* Sub-district & District */}
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ตำบล / แขวง <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={address.subDistrict}
                                    onChange={(e) => { setAddress({ ...address, subDistrict: e.target.value }); if (addressError) setAddressError(''); }}
                                    className={`w-full bg-white/50 border rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 transition-all ${addressError && !address.subDistrict.trim() ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                                    placeholder="ตำบล/แขวง..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">อำเภอ / เขต <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={address.district}
                                    onChange={(e) => { setAddress({ ...address, district: e.target.value }); if (addressError) setAddressError(''); }}
                                    className={`w-full bg-white/50 border rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 transition-all ${addressError && !address.district.trim() ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                                    placeholder="อำเภอ/เขต..."
                                />
                            </div>

                            {/* Province & Postal Code */}
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">จังหวัด <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={address.province}
                                    onChange={(e) => { setAddress({ ...address, province: e.target.value }); if (addressError) setAddressError(''); }}
                                    className={`w-full bg-white/50 border rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 transition-all ${addressError && !address.province.trim() ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                                    placeholder="จังหวัด..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">รหัสไปรษณีย์ <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={address.postalCode}
                                    onChange={(e) => { setAddress({ ...address, postalCode: e.target.value }); if (addressError) setAddressError(''); }}
                                    className={`w-full bg-white/50 border rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 transition-all ${addressError && !address.postalCode.trim() ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400' : 'border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                                    placeholder="รหัสไปรษณีย์..."
                                />
                            </div>

                            {/* Note */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">เพิ่มเติม (Optional)</label>
                                <textarea
                                    value={address.note}
                                    onChange={(e) => setAddress({ ...address, note: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-24 resize-none"
                                    placeholder="รายละเอียดเพิ่มเติม (จุดสังเกต, เบอร์โทรสำรอง)..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20 overflow-hidden relative">
                        <div className="relative flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                                    <Wallet size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">ชำระด้วยเครดิตร้านค้า</h2>
                            </div>
                        </div>
                        <div className="relative bg-white/40 p-10 rounded-[2.5rem] border border-white/60 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
                                    <Wallet size={32} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Your Balance</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">{(user?.creditBalance || 0).toLocaleString()} <i className="bi bi-coin" style={{ fontSize: '24px' }} /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 via-emerald-950 to-teal-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative">
                            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Order Summary</h3>
                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-400">Total Amount</span>
                                    <span className="text-2xl font-black tracking-tight flex items-center gap-2">{(totalAmount || 0).toLocaleString()} <i className="bi bi-coin" style={{ fontSize: '20px' }} /></span>
                                </div>
                            </div>
                            {error && (
                                <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={handlePlaceOrder}
                                className="w-full py-6 bg-white text-gray-900 font-black text-xl rounded-[2rem] hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                            >
                                <span>สั่งซื้อทันที</span>
                                <ArrowLeft size={18} className="rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            <div className="relative z-[100]">
                {showConfirmModal && (
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
                        <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 shadow-3xl">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-6">
                                    <Wallet size={36} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-2">ยืนยันการชำระเงิน?</h3>
                                <p className="text-gray-500 font-medium mb-8">
                                    Amount <span className="text-emerald-600 font-black flex items-center gap-1.5 justify-center mt-1">{(totalAmount || 0).toLocaleString()} <i className="bi bi-coin" style={{ fontSize: '18px' }} /></span> will be deducted from your balance.
                                </p>
                                <div className="w-full space-y-4">
                                    <button
                                        onClick={handleConfirmPayment}
                                        className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all"
                                    >
                                        ยืนยันและสั่งซื้อ
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="w-full py-4 text-gray-400 font-black"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
