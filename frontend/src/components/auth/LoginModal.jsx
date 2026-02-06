import React, { useState } from 'react';
import { X, Lock, User, ArrowRight, Github, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginModal - Modal สำหรับเข้าสู่ระบบ (แยกจาก Register)
 */
const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                onClose();
                setFormData({ username: '', password: '' });
            } else {
                setError(result.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToRegister = () => {
        setError('');
        setFormData({ username: '', password: '' });
        onSwitchToRegister();
    };

    return (
        <div
            className="fixed inset-0 z-[100] grid place-items-center h-screen w-screen bg-black/60 backdrop-blur-sm p-4 transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div
                name="login-modal" className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ปุ่มปิด */}
                <button
                    onClick={onClose}
                    name='login-close-btn' className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-10 overflow-y-auto custom-scrollbar">
                    {/* Header/Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20 mb-4">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ยินดีต้อนรับ
                        </h2>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">
                            Book2Sell Marketplace
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-2 animate-pulse">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อผู้ใช้งาน</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-300">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text" 
                                    required
                                    name='login-username-input' className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm font-bold"
                                    placeholder="username123"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">รหัสผ่าน</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-300">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    name='login-password-input' className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm font-bold"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            name='login-btn' className="relative group w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบเลยตอนนี้'}</span>
                                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <button
                            onClick={handleSwitchToRegister}
                            name='register-goto-btn' className="text-xs font-black text-purple-600 hover:text-pink-600 transition-colors uppercase tracking-widest"
                        >
                            ยังไม่มีบัญชี? สมัครที่นี่
                        </button>

                        <div className="w-full flex items-center gap-4 py-2">
                            <div className="h-px bg-gray-100 flex-1" />
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Social Access</span>
                            <div className="h-px bg-gray-100 flex-1" />
                        </div>

                        <div className="flex gap-4 w-full">
                            <button name='login-github-btn' className="flex-1 flex justify-center py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-600 gap-2">
                                <Github size={18} /> GitHub
                            </button>
                            <button name='login-google-btn' className="flex-1 flex justify-center py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-600 gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
