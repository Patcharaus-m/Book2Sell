import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, ShoppingBag, History, Shield, LogOut, Edit3, Save, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo } from '../services/editInfoService';

const MyAccount = () => {
    const { user, logout, topUp, updateUser } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || user?.username || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-700">
                <div className="bg-purple-50 p-8 rounded-[2rem] mb-8">
                    <User size={64} className="text-purple-400" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">ไม่พบข้อมูลผู้ใช้</h2>
                <p className="text-gray-500 mb-8">กรุณาเข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                    กลับไปหน้าแรก
                </button>
            </div>
        );
    }

    const handleSave = async () => {
        try {
            // Debug: ดูว่า user object มี field อะไรบ้าง
            console.log("User object:", user);

            // สร้าง payload โดยดึง id จาก user ใน context ไปด้วย
            const payload = {
                userId: user?._id || user?.id, // รองรับทั้ง _id และ id
                username: formData.name,
                email: formData.email,
                phone: formData.phone
            };

            const result = await updateUserInfo(payload);

            if (result.status === 2001 || result.code === 201) {
                // อัปเดต state ใน AuthContext ให้ UI เปลี่ยนทันที
                updateUser({
                    username: formData.name,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                });
                
                alert("อัปเดตข้อมูลสำเร็จ!");
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update user info:', error);
            alert(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">บัญชีของฉัน</h1>
                <p className="text-gray-500 mt-2">จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชีคุณ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Summary */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-tr from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center text-purple-600 text-3xl font-black">
                                {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-gray-50 text-purple-600">
                                <Edit3 size={14} />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name || user.username}</h2>
                        <p className="text-sm text-gray-400 mb-6">{user.email}</p>

                        <div className="w-full pt-6 border-t border-gray-50">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 text-red-500 font-bold text-sm bg-red-50 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut size={16} /> ออกจากระบบ
                            </button>
                        </div>
                    </div>

                    {/* Credit Card - Soft Style */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-purple-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 -mr-4 -mt-4">
                            <CreditCard size={80} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-200 mb-2">ยอดเงินคงเหลือ</p>
                        <h3 className="text-4xl font-black mb-6">฿{user.storeCredits?.toLocaleString() || 0}</h3>
                        <button
                            onClick={() => topUp(500)}
                            className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> เติมเงิน ฿500
                        </button>
                    </div>
                </div>

                {/* Right Column: Details & Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Information Form */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Shield size={18} className="text-purple-600" /> ข้อมูลส่วนตัว
                            </h3>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${isEditing ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-purple-600 bg-purple-50'}`}
                            >
                                {isEditing ? <div className="flex items-center gap-2"><Save size={14} /> บันทึก</div> : 'แก้ไขข้อมูล'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'ชื่อผู้ใช้', icon: <User size={16} />, value: formData.name, key: 'name' },
                                { label: 'อีเมล', icon: <Mail size={16} />, value: formData.email, key: 'email' },
                                { label: 'เบอร์โทรศัพท์', icon: <Phone size={16} />, value: formData.phone, key: 'phone', full: true }
                            ].map((item) => (
                                <div key={item.key} className={`space-y-1.5 ${item.full ? 'md:col-span-2' : ''}`}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{item.label}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            {item.icon}
                                        </div>
                                        <input
                                            disabled={!isEditing}
                                            className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-medium transition-all outline-none ${isEditing ? 'bg-white border-purple-200 ring-4 ring-purple-50' : ''}`}
                                            value={item.value}
                                            onChange={e => setFormData({ ...formData, [item.key]: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access Menu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            onClick={() => navigate('/my-shop')}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-50 rounded-2xl text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">จัดการร้านค้า</h4>
                                    <p className="text-[10px] text-gray-400">สินค้าและออเดอร์ของคุณ</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div
                            onClick={() => navigate('/settings')}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:bg-indigo-900 group-hover:text-white transition-all">
                                    <History size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">ประวัติการสั่งซื้อ</h4>
                                    <p className="text-[10px] text-gray-400">ติดตามสถานะพัสดุ</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for the Plus icon which was missing in imports
const Plus = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

export default MyAccount;
