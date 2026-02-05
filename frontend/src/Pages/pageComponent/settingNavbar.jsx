import React from "react";
import { User, Star, ShoppingBag, CircleAlert } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SettingNavbar() {
    const location = useLocation();

    const navItems = [
        { name: "ตั้งค่าบัญชี", path: "/settings", icon: <User size={18} /> },
        { name: "รีวิว", path: "/review", icon: <Star size={18} /> },
        { name: "สินค้าในร้าน", path: "/product-in-store", icon: <ShoppingBag size={18} /> },
        { name: "เกี่ยวกับ", path: "/about-us", icon: <CircleAlert size={18} /> }
    ];

    return (
        <div className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-[80px] z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`
                                    flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-sm transition-all duration-300 whitespace-nowrap
                                    ${isActive
                                        ? "border-purple-600 text-purple-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }
                                `}
                            >
                                <span className={`${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-500"}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
