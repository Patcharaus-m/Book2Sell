import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useBook } from "../../context/BookContext";

import { createOrderService } from "../../services/orderService";
import { createReviewService } from "../../services/reviewService";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    Wallet,
    CheckCircle,
    ArrowLeft,
    ShieldCheck,
    Tag,
    Info,
    Star,
    MessageSquare,
    Send,
    X,
    User,
    MapPin
} from "lucide-react";

export default function Checkout() {
    const { user, processPayment, addPurchasedBooks, updateUser } = useAuth();
    const { cart, totalAmount, clearCart } = useCart();
    const { refreshBooks } = useBook();

    const navigate = useNavigate();
    const [isOrdered, setIsOrdered] = useState(false);
    const [error, setError] = useState('');

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
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [itemsToReview, setItemsToReview] = useState([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [rating, setRating] = useState(5.00);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;
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
                bookId: item._id || item.id,
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
        
        setItemsToReview(createdOrders);  // ใช้ createdOrders ที่มี orderId แล้ว
        addPurchasedBooks(orderItems.map(item => item.id || item._id));
        
        // รีเฟรชรายการหนังสือให้หนังสือที่ซื้อไปหายจากหน้าร้าน
        refreshBooks();

        setShowConfirmModal(false);
        setIsOrdered(true);
        // After success animation, show review modal
        setTimeout(() => {
            setShowReviewModal(true);
        }, 3000);
    };

    const handleReviewSubmit = async (e) => {
        if (e) e.preventDefault();
        const currentItem = itemsToReview[currentReviewIndex];

        setIsSubmittingReview(true);

        // Debug: ดูข้อมูลที่จะส่ง
        console.log('Review Submit - currentItem:', currentItem);
        console.log('Review Submit - orderId:', currentItem.orderId);

        // เรียก API สร้าง Review
        if (currentItem.orderId) {
            const reviewResult = await createReviewService({
                orderId: currentItem.orderId,
                userId: user._id || user.id,
                rating,
                comment
            });
            console.log('Review API Result:', reviewResult);
        } else {
            console.log('WARNING: No orderId found, skipping review API call');
        }

        // Local update สำหรับ UI (ถ้าต้องการ - ปัจจุบันไม่จำเป็น เพราะบันทึกใน DB แล้ว)

        // Move to next item or close
        setTimeout(() => {
            setIsSubmittingReview(false);
            if (currentReviewIndex < itemsToReview.length - 1) {
                setCurrentReviewIndex(prev => prev + 1);
                setRating(5.00);
                setComment('');
            } else {
                handleCloseModal();
            }
        }, 500);
    };

    const handleCloseModal = () => {
        setShowReviewModal(false);
        clearCart();
        navigate('/');
    };

    if (isOrdered && !showReviewModal) {
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
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-300">เตรียมรับของขวัญพิเศษสักครู่...</p>
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
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/20 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-inner">
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
                                        <p className="text-2xl font-black text-gray-900">
                                            ฿{((item.sellingPrice || item.price) * (item.quantity || 1)).toLocaleString()}
                                        </p>
                                        <p className="text-xs font-black text-gray-400 uppercase italic">x {item.quantity || 1} เล่ม</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* Address Card */}
                    <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20 overflow-hidden relative">
                        <div className="relative flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">ที่อยู่จัดส่ง</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* House No */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">บ้านเลขที่ / หมู่บ้าน / อาคาร</label>
                                <input
                                    type="text"
                                    value={address.houseNo}
                                    onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
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
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    placeholder="ถนน..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ซอย</label>
                                <input
                                    type="text"
                                    value={address.soi}
                                    onChange={(e) => setAddress({ ...address, soi: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    placeholder="ซอย..."
                                />
                            </div>

                            {/* Sub-district & District */}
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ตำบล / แขวง</label>
                                <input
                                    type="text"
                                    value={address.subDistrict}
                                    onChange={(e) => setAddress({ ...address, subDistrict: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    placeholder="ตำบล/แขวง..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">อำเภอ / เขต</label>
                                <input
                                    type="text"
                                    value={address.district}
                                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    placeholder="อำเภอ/เขต..."
                                />
                            </div>

                            {/* Province & Postal Code */}
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">จังหวัด</label>
                                <input
                                    type="text"
                                    value={address.province}
                                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    placeholder="จังหวัด..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">รหัสไปรษณีย์</label>
                                <input
                                    type="text"
                                    value={address.postalCode}
                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    placeholder="รหัสไปรษณีย์..."
                                />
                            </div>

                            {/* Note */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">เพิ่มเติม (Optional)</label>
                                <textarea
                                    value={address.note}
                                    onChange={(e) => setAddress({ ...address, note: e.target.value })}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all h-24 resize-none"
                                    placeholder="รายละเอียดเพิ่มเติม (จุดสังเกต, เบอร์โทรสำรอง)..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Card */}
                    <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20 overflow-hidden relative">
                        <div className="relative flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                                    <Wallet size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">ชำระด้วยเครดิตร้านค้า</h2>
                            </div>
                        </div>
                        <div className="relative bg-white/40 p-10 rounded-[2.5rem] border border-white/60 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-purple-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
                                    <Wallet size={32} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Your Balance</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">฿{(user?.creditBalance || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-pink-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative">
                            <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Order Summary</h3>
                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-400">ยอดรวม</span>
                                    <span className="text-2xl font-black tracking-tight">฿{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            {error && (
                                <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={handlePlaceOrder}
                                className="w-full py-6 bg-white text-gray-900 font-black text-xl rounded-[2rem] hover:bg-pink-50 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                            >
                                <span>สั่งซื้อทันที</span>
                                <ArrowLeft size={18} className="rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals Container */}
            <div className="relative z-[100]">
                {/* Confirmation Modal */}
                {showConfirmModal && (
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
                        <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 shadow-3xl">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-purple-50 rounded-[2rem] flex items-center justify-center text-purple-600 mb-6">
                                    <Wallet size={36} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-2">ยืนยันการชำระเงิน?</h3>
                                <p className="text-gray-500 font-medium mb-8">
                                    ยอดเงิน <span className="text-purple-600 font-black">฿{totalAmount.toLocaleString()}</span> จะถูกหักจากเครดิตของคุณ
                                </p>
                                <div className="w-full space-y-4">
                                    <button
                                        onClick={handleConfirmPayment}
                                        className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-purple-600 transition-all"
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

                {/* Review Modal */}
                {showReviewModal && (
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={handleCloseModal} />
                        <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[3.5rem] p-12 shadow-3xl overflow-hidden">
                            <div className="relative">
                                <div className="flex flex-col items-center text-center mb-10">
                                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                                        <MessageSquare size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Review Your Records</h3>
                                    <p className="text-sm text-gray-400 font-medium">Item {currentReviewIndex + 1} of {itemsToReview.length}</p>
                                </div>

                                {itemsToReview.length > 0 && (
                                    <div className="flex flex-col md:flex-row gap-8 items-start bg-white/40 p-6 rounded-[2.5rem] border border-white mb-8">
                                        <div className="w-32 h-44 flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden">
                                            <img
                                                src={itemsToReview[currentReviewIndex].image || (itemsToReview[currentReviewIndex].images && itemsToReview[currentReviewIndex].images[0]) || itemsToReview[currentReviewIndex].imageUrl}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-2xl font-black text-gray-900">{itemsToReview[currentReviewIndex].title}</h4>
                                            <div className="mt-4 flex gap-1.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button key={star} onClick={() => setRating(star)}>
                                                        <Star size={28} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                                                    </button>
                                                ))}
                                                <span className="ml-2 text-2xl font-black text-purple-600">{(rating || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                    <textarea
                                        required
                                        placeholder="Share your cosmic insights..."
                                        value={comment || ''}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-white border border-white rounded-[2rem] px-8 py-6 h-32 outline-none text-sm font-medium"
                                    />
                                    <div className="flex justify-between items-center">
                                        <button type="button" onClick={handleCloseModal} className="text-xs font-black text-gray-400 uppercase">Skip</button>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview || !(comment || '').trim()}
                                            className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-purple-600 transition-all flex items-center gap-2"
                                        >
                                            {isSubmittingReview ? "Submitting..." : <><Send size={20} /> Submit</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
