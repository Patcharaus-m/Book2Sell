import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, CreditCard, ShoppingBag, History, Shield, LogOut, Edit3, Save, ChevronRight, BookOpen, Star, X, Camera, ShoppingCart, ImageIcon } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo } from '../services/editInfoService';
import { getOrderHistoryService } from '../services/orderService';
import TopUpModal from '../components/layout/TopUpModal';

const MyAccount = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: user?.name || user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profileImage: user?.profileImage || ''
    });

    // ดึงประวัติการสั่งซื้อจาก API
    useEffect(() => {
        const fetchOrderHistory = async () => {
            if (!user) return;
            setLoadingHistory(true);
            try {
                const userId = user._id || user.id;
                console.log('=== FETCHING ORDER HISTORY ===');
                console.log('User object:', user);
                console.log('UserId to send:', userId);

                const result = await getOrderHistoryService(userId);
                console.log('Order history API result:', result);

                if (result.code === 200 || result.code === 201 || result.status === 2001) {
                    console.log('Setting purchaseHistory:', result.payload);
                    setPurchaseHistory(result.payload || []);
                } else {
                    console.log('API returned non-200:', result);
                }
            } catch (error) {
                console.error('Error fetching order history:', error);
            } finally {
                setLoadingHistory(false);
            }
        };
        fetchOrderHistory();
    }, [user]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-700">
                <div className="bg-emerald-50 p-8 rounded-[2rem] mb-8">
                    <User size={64} className="text-emerald-400" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">ไม่พบข้อมูลผู้ใช้</h2>
                <p className="text-gray-500 mb-8">กรุณาเข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                    กลับไปหน้าแรก
                </button>
            </div>
        );
    }

    const handleSave = async () => {
        try {
            const payload = {
                userId: user?._id || user?.id,
                username: formData.name,
                email: formData.email,
                phone: formData.phone,
                profileImage: formData.profileImage
            };

            if (formData.phone && formData.phone.length !== 10) {
                alert("เบอร์โทรศัพท์ต้องมี 10 หลัก");
                return;
            }

            const result = await updateUserInfo(payload);

            if (result.status === 2001 || result.code === 201) {
                updateUser({
                    username: formData.name,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    profileImage: formData.profileImage
                });

                alert("อัปเดตข้อมูลสำเร็จ!");
                window.location.reload(); // Force refresh as requested
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
            alert(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        }
    };

    // const handleLogout = () => {
    //     logout();
    //     navigate('/');
    // };

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("ไฟล์มีขนาดใหญ่เกินไป (จำกัด 5MB)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-6xl mx-auto pb-20 px-4 mt-8">
            {/* Header Section */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">แดชบอร์ดของฉัน</h1>
                    <p className="text-gray-500 mt-2 font-medium">จัดการข้อมูลส่วนตัว เครดิต และร้านค้าของคุณได้ในที่เดียว</p>
                </div>
                {/* <div className="flex items-center gap-3">
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 text-red-500 font-black text-xs bg-red-50 rounded-2xl hover:bg-red-100 transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                        <LogOut size={16} /> ออกจากระบบ
                    </button>
                </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center sticky top-24">
                        <div className="relative mb-6 group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfileUpload}
                            />
                            <div
                                onClick={() => isEditing && fileInputRef.current?.click()}
                                className={`w-36 h-36 rounded-[2.5rem] overflow-hidden flex items-center justify-center text-4xl font-black transition-all shadow-inner ${isEditing ? 'cursor-pointer hover:ring-8 hover:ring-emerald-50 scale-105' : ''} ${!formData.profileImage ? 'bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-600' : ''}`}
                            >
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()
                                )}
                            </div>

                            {isEditing && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 p-4 bg-emerald-600 rounded-2xl shadow-xl text-white cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-white"
                                >
                                    <Camera size={20} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-1">{user.name || user.username}</h2>
                        <p className="text-sm text-gray-400 font-bold mb-6">{user.email}</p>

                        <div className="w-full pt-6 border-t border-gray-50 flex flex-col gap-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">สถานะบัญชี</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                                    <Shield size={10} /> ยืนยันแล้ว
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Dashboard Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">ข้อมูลส่วนตัว</h3>
                                    <p className="text-xs text-gray-400 font-bold">ข้อมูลนี้จะถูกใช้ในการติดต่อและจัดส่ง</p>
                                </div>
                            </div>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${isEditing ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-emerald-600 bg-gray-50 hover:bg-emerald-50'}`}
                            >
                                {isEditing ? <><Save size={16} /> บันทึกการเปลี่ยนแปลง</> : <><Edit3 size={16} /> แก้ไขข้อมูล</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                            {[
                                { label: 'ชื่อผู้ใช้ / นามแฝง', icon: <User size={18} />, value: formData.name, key: 'name' },
                                { label: 'อีเมลที่ลงทะเบียน', icon: <Mail size={18} />, value: formData.email, key: 'email' },
                                { label: 'เบอร์โทรศัพท์ติดต่อ (10 หลัก)', icon: <Phone size={18} />, value: formData.phone, key: 'phone', full: true }
                            ].map((item) => (
                                <div key={item.key} className={`space-y-2.5 ${item.full ? 'md:col-span-2' : ''}`}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">{item.label}</label>
                                    <div className="relative group">
                                        <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors ${isEditing ? 'text-emerald-500' : 'text-gray-300'}`}>
                                            {item.icon}
                                        </div>
                                        <input
                                            disabled={!isEditing}
                                            className={`w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] text-sm font-black transition-all outline-none ${isEditing ? 'bg-white border-emerald-100 ring-8 ring-emerald-50/50 text-emerald-900' : 'text-gray-500 cursor-not-allowed'}`}
                                            value={item.value}
                                            maxLength={item.key === 'phone' ? 10 : undefined}
                                            onChange={e => {
                                                let val = e.target.value;
                                                if (item.key === 'phone') {
                                                    val = val.replace(/\D/g, '').slice(0, 10);
                                                } else if (item.key === 'email') {
                                                    // Prevent emojis and non-ASCII characters in email
                                                    val = val.replace(/[^\x00-\x7F]/g, '');
                                                }
                                                setFormData({ ...formData, [item.key]: val });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Row: Wallet & Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Wallet Card */}
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-gray-200">
                            <div className="absolute top-0 right-0 p-8 opacity-10 -mr-6 -mt-6 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <CreditCard size={120} />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2">เครดิตคงเหลือ</p>
                                    <h3 className="text-5xl font-black mb-2 flex items-center gap-3">
                                        {(user.creditBalance || 0).toLocaleString()}
                                        <i className="bi bi-coin text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" style={{ fontSize: '36px' }} />
                                    </h3>
                                    <p className="text-xs text-gray-400 font-bold italic">1 เครดิต = 1 บาท</p>
                                </div>
                                <button
                                    onClick={() => setIsTopUpModalOpen(true)}
                                    className="mt-8 w-fit px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-xl shadow-emerald-900/20 active:scale-95"
                                >
                                    <CreditCard size={18} /> เติมเครดิต
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <div
                                onClick={() => navigate('/product-in-store')}
                                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-pink-50 rounded-2xl text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-inner">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-lg">จัดการร้านค้า</h4>
                                        <p className="text-xs text-gray-400 font-bold">สินค้าและออเดอร์ที่คุณลงขาย</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors">
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>

                            <div
                                onClick={() => setShowHistory(true)}
                                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                        <History size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-lg">ประวัติการสั่งซื้อ</h4>
                                        <p className="text-xs text-gray-400 font-bold">
                                            {purchaseHistory.length > 0 ? `${purchaseHistory.length} รายการที่เคยสั่งซื้อ` : 'ยังไม่มีประวัติการสั่งซื้อ'}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase History Modal */}
            {showHistory && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-8 pb-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <span className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">ประวัติการสั่งซื้อ</span>
                                <p className="text-sm text-gray-400 mt-1">หนังสือที่คุณซื้อ (ล่าสุดก่อน)</p>
                            </div>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto max-h-[60vh]">
                            {loadingHistory ? (
                                <div className="text-center py-16">
                                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500">กำลังโหลดประวัติการสั่งซื้อ...</p>
                                </div>
                            ) : purchaseHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {purchaseHistory.map((order, index) => {
                                        const book = order.bookId; // bookId ถูก populate มาแล้ว
                                        if (!book) return null;
                                        return (
                                            <div
                                                key={order._id || index}
                                                onClick={() => {
                                                    setShowHistory(false);
                                                    navigate(`/book/${book._id || book.id}`);
                                                }}
                                                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-emerald-50 rounded-2xl cursor-pointer transition-all group"
                                            >
                                                {/* Book Cover */}
                                                <div className="w-16 h-20 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                    {book.images?.[0] || book.imageUrl ? (
                                                        <img
                                                            src={book.images?.[0] || book.imageUrl}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                                                            <BookOpen size={24} className="text-emerald-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Book Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                                                        {book.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-400 truncate">{book.author}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">{(book.sellingPrice || 0).toLocaleString()} <i className="bi bi-coin" /></span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${order.shippingStatus === 'shipped'
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : 'bg-orange-50 text-orange-600'
                                                            }`}>
                                                            {order.shippingStatus === 'shipped' ? 'ส่งแล้ว' : 'กำลังเตรียมส่ง'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Order Date */}
                                                <div className="text-right flex-shrink-0">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                        {new Date(order.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <History size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">ยังไม่มีประวัติการสั่งซื้อ</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto">เมื่อคุณซื้อหนังสือ ประวัติจะปรากฏที่นี่</p>
                                    <button
                                        onClick={() => {
                                            setShowHistory(false);
                                            navigate('/');
                                        }}
                                        className="mt-6 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
                                    >
                                        เริ่มช้อปปิ้ง
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <TopUpModal isOpen={isTopUpModalOpen} onClose={() => setIsTopUpModalOpen(false)} />
        </div>
    );
};

// Helper for the Plus icon
const Plus = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

export default MyAccount;
