import { Search, ShoppingCart, LogOut, ShoppingBag, Plus, X, ChevronDown, Package, Settings, BookOpen, Book, Library, Wallet, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useBook } from "../../context/BookContext";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import AdvancedBookModal from "../book/AdvancedBookModal";
import TopUpModal from "./TopUpModal";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { filters, setSearchKeyword, addBook } = useBook();
    const { cart, setIsDrawerOpen } = useCart();
    const navigate = useNavigate();

    // State
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // ฟังก์ชันสลับระหว่าง Login และ Register Modal
    const switchToRegister = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); };
    const switchToLogin = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); };

    // Click Outside เพื่อปิด User Menu
    const menuRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        if (window.location.pathname !== '/') navigate('/');
    };

    const handleAddBook = (bookData) => {
        addBook(bookData, user);
        setIsSellModalOpen(false);
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* 1. Logo */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-all duration-300">
                            <Library className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                            Book2Sell
                        </span>
                    </Link>

                    {/* 2. Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative group w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-10 py-3 border border-gray-200 rounded-full bg-gray-50 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 focus:bg-white transition-all"
                                placeholder="ค้นหาหนังสือ..."
                                value={filters.keyword}
                                onChange={handleSearch}
                            />
                            {filters.keyword && (
                                <button
                                    onClick={() => setSearchKeyword("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 3. Actions */}
                    <div className="flex items-center gap-2 md:gap-4">

                        {/* Mobile Search Toggle */}
                        <button
                            className="md:hidden p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                        >
                            {showMobileSearch ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
                        </button>

                        {/* Cart Button */}
                        <button
                            className="relative p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all hover:scale-105 active:scale-95"
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cart.length > 0 && (
                                <span className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white animate-pulse">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Sell Button */}
                                <button
                                    onClick={() => setIsSellModalOpen(true)}
                                    className="relative group hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all duration-250 active:scale-95 overflow-hidden"
                                >
                                    {/* เลเยอร์สี Gradient  */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

                                    {/* เนื้อหาปุ่มที่อยู่ด้านบน */}
                                    <div className="relative z-10 flex items-center gap-2">
                                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                        <span>ลงขาย</span>
                                    </div>
                                </button>

                                {/* User Menu Dropdown */}
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-1 pl-3 pr-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-all hover:shadow-md"
                                    >
                                        <div className="text-right hidden lg:block">
                                            <p className="text-xs font-bold text-gray-900">{user.name}</p>
                                            <p className="text-[10px] text-purple-600 font-bold">฿{user.storeCredits?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Content with Animation */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 origin-top-right animate-popup z-50">
                                            <div className="px-4 py-3 border-b border-gray-50 lg:hidden bg-gray-50/50">
                                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-purple-600 font-bold">เครดิต: ฿{user.storeCredits?.toLocaleString()}</p>
                                            </div>

                                            <Link to="/my-shop" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                                                <Package size={16} className="text-purple-500" /> ของฉัน
                                            </Link>
                                            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                                                <Settings size={16} className="text-purple-500" /> ตั้งค่าบัญชี
                                            </Link>
                                            <Link to="/account" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                                                <User size={16} className="text-purple-500" /> บัญชีของฉัน
                                            </Link>
                                            <button
                                                onClick={() => { setIsTopUpOpen(true); setShowUserMenu(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors border-t border-gray-50"
                                            >
                                                <Wallet size={16} className="text-purple-500" /> เติมเครดิต
                                            </button>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={() => { logout(); setShowUserMenu(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} className="text-red-500" /> ออกจากระบบ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-200 hover:bg-purple-700 hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    เข้าสู่ระบบ
                                </button>
                                <button
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    className="px-5 py-2.5 border-2 border-purple-600 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    สมัครสมาชิก
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar (Expandable with Animation) */}
                {showMobileSearch && (
                    <div className="md:hidden pb-4 px-2 animate-slide-down">
                        <div className="relative">
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
                                placeholder="ค้นหา..."
                                value={filters.keyword}
                                onChange={handleSearch}
                                autoFocus
                            />
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* External Modals */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSwitchToRegister={switchToRegister}
            />
            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onSwitchToLogin={switchToLogin}
            />

            <AdvancedBookModal
                isOpen={isSellModalOpen}
                onClose={() => setIsSellModalOpen(false)}
                onSubmit={handleAddBook}
            />

            <TopUpModal
                isOpen={isTopUpOpen}
                onClose={() => setIsTopUpOpen(false)}
            />
        </nav>
    );
}