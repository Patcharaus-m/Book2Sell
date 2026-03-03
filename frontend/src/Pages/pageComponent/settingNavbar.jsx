import React from "react";
import { User, Star, ShoppingBag, CircleAlert, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SettingNavbar() {
    const location = useLocation();
    const isAboutUsPage = location.pathname === "/about-us";

    const navItems = [
        { name: "สินค้าในร้าน", path: "/product-in-store", icon: <ShoppingBag size={18} /> },
        { name: "รีวิว", path: "/review", icon: <Star size={18} /> },
        { name: "ประวัติ", path: "/history", icon: <History size={18} /> },
        { name: "เกี่ยวกับผู้พัฒนา", path: "/about-us", icon: <CircleAlert size={18} /> },
        { name: "ตั้งค่าบัญชี", path: "/settings", icon: <User size={18} /> }
    ];

    return (
        <div className={`sticky top-[80px] z-40 backdrop-blur-md transition-all duration-700 ease-in-out border-b  ${isAboutUsPage
            ? "border-white/5 bg-[#111111]/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "border-emerald-100 bg-white shadow-sm"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav name="navbar" className="flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`
                                    flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all duration-300 whitespace-nowrap group
                                    ${isActive
                                        ? "border-emerald-600 text-emerald-700"
                                        : isAboutUsPage
                                            ? "border-transparent text-gray-400 hover:text-white hover:border-white/20"
                                            : "border-transparent text-gray-500 hover:text-emerald-600 hover:border-emerald-200"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2 transition-all duration-[350ms] group-active:scale-[0.85]">
                                    <span className={`transition-all duration-300 group-hover:scale-110 group-hover:animate-shake ${isActive ? "text-emerald-700" : isAboutUsPage ? "text-gray-500 group-hover:text-emerald-400" : "text-gray-400 group-hover:text-emerald-600"}`}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
