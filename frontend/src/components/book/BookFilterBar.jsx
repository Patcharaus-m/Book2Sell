import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, ChevronDown, XCircle, SortAsc, SortDesc, Clock, Flame } from 'lucide-react';

/**
 * BookFilterBar (Refactored) - ตัดส่วนค้นหาออก ให้เหลือแค่ตัวกรองหมวดหมู่และราคา
 * ทำหน้าที่เป็นแผงควบคุมตัวกรองรอง (Secondary Filter Panel)
 */
const CustomDropdown = ({ options, value, onChange, placeholder, icon, className, itemClassName, isOpen, onToggle }) => {
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
            <button
                onClick={onToggle}
                className={`w-full pl-6 pr-10 py-4 flex items-center justify-between rounded-full outline-none transition-all duration-[250ms] font-black text-xs uppercase tracking-widest border border-transparent ${isOpen
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                    : 'bg-transparent hover:bg-purple-50/50 text-gray-600 hover:border-purple-100 focus:border-purple-200'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className={isOpen ? 'text-white' : 'text-purple-500'}>{icon}</span>}
                    <span>{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown className={`transition-transform duration-[250ms] ${isOpen ? 'rotate-180 text-white' : 'text-purple-400'}`} size={16} />
            </button>

            {/* Dropdown Menu with 0.25s transition */}
            <div
                className={`absolute top-full left-0 mt-3 w-full min-w-[240px] bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl border border-purple-400/20 py-2 z-40 transition-all duration-[250ms] ease-out origin-top ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0 visible'
                    : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                    }`}
            >
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => {
                            onChange(opt.value);
                            onToggle(); // Close after select
                        }}
                        className={`w-full text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${value === opt.value
                            ? 'bg-white/20 text-white'
                            : 'text-purple-50 hover:bg-white/10 hover:text-white'
                            } ${itemClassName}`}
                    >
                        {opt.icon && <span className="text-purple-200">{opt.icon}</span>}
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const BookFilterBar = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        sortBy: 'newest'
    });

    const [activeDropdown, setActiveDropdown] = useState(null);

    // Close dropdown on outside click
    useEffect(() => {
        if (!activeDropdown) return;
        const handleClose = () => setActiveDropdown(null);
        window.addEventListener('click', handleClose);
        return () => window.removeEventListener('click', handleClose);
    }, [activeDropdown]);

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleReset = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: '',
            sortBy: 'newest'
        });
        setActiveDropdown(null);
    };

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const categories = ["นิยาย", "การ์ตูน", "ความรู้", "เทคโนโลยี", "ประวัติศาสตร์", "พัฒนาตนเอง", "สยองขวัญ", "สืบสวน", "อื่นๆ"];
    const categoryOptions = [
        { label: "ทุกหมวดหมู่", value: "" },
        ...categories.map(cat => ({ label: cat, value: cat }))
    ];

    const conditions = [
        { label: "ทุกสภาพสินค้า", value: "" },
        { label: "สภาพดีเยี่ยม (90% ขึ้นไป)", value: "90" },
        { label: "สภาพพอใช้", value: "พอใช้" }
    ];

    const sortOptions = [
        { label: "มาใหม่ล่าสุด", value: "newest", icon: <Clock size={14} /> },
        { label: "ราคา: ถูกไปแพง", value: "price_asc", icon: <SortAsc size={14} /> },
        { label: "ราคา: แพงไปถูก", value: "price_desc", icon: <SortDesc size={14} /> },
        { label: "ยอดนิยม", value: "popularity", icon: <Flame size={14} /> }
    ];

    const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.condition || filters.sortBy !== 'newest';

    return (
        <div className="w-full space-y-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-700 relative z-40">
            <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[3rem] shadow-xl shadow-gray-200/30 border border-white flex flex-wrap items-center gap-2">

                {/* หมวดหมู่ (Custom Dropdown) */}
                <CustomDropdown
                    options={categoryOptions}
                    value={filters.category}
                    onChange={(val) => setFilters({ ...filters, category: val })}
                    placeholder="เลือกหมวดหมู่"
                    className="flex-1 min-w-[180px]"
                    isOpen={activeDropdown === 'category'}
                    onToggle={() => toggleDropdown('category')}
                />

                <div className="h-8 w-px bg-gray-100 hidden md:block" />

                {/* ช่วงราคา (Price Range Inputs) */}
                <div className="flex items-center gap-2 px-6 py-2 rounded-full hover:bg-purple-50/50 transition-all border border-transparent hover:border-purple-100 group/price">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 group-hover/price:text-purple-500 transition-colors">งบประมาณ</span>
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-purple-50 shadow-sm focus-within:border-purple-300 transition-all">
                        <span className="text-purple-300 text-[10px] mr-1">฿</span>
                        <input
                            type="number"
                            placeholder="ต่ำสุด"
                            className="w-16 bg-transparent outline-none font-bold text-xs text-gray-700 placeholder:text-gray-200"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        />
                    </div>
                    <span className="text-gray-200">—</span>
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-purple-50 shadow-sm focus-within:border-purple-300 transition-all">
                        <span className="text-purple-300 text-[10px] mr-1">฿</span>
                        <input
                            type="number"
                            placeholder="สูงสุด"
                            className="w-16 bg-transparent outline-none font-bold text-xs text-gray-700 placeholder:text-gray-200"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        />
                    </div>
                </div>

                <div className="h-8 w-px bg-gray-100 hidden md:block" />

                {/* สภาพสินค้า (Custom Dropdown) */}
                <CustomDropdown
                    options={conditions}
                    value={filters.condition}
                    onChange={(val) => setFilters({ ...filters, condition: val })}
                    placeholder="ทุกสภาพสินค้า"
                    className="min-w-[180px]"
                    isOpen={activeDropdown === 'condition'}
                    onToggle={() => toggleDropdown('condition')}
                />

                {/* ปุ่มล้างตัวกรอง */}
                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-xs font-black text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex items-center gap-1.5"
                    >
                        <XCircle size={14} /> ล้างตัวกรอง
                    </button>
                )}

                {/* การจัดเรียง (Custom Dropdown - Right aligned) */}
                <div className="ml-auto pr-2">
                    <CustomDropdown
                        options={sortOptions}
                        value={filters.sortBy}
                        onChange={(val) => setFilters({ ...filters, sortBy: val })}
                        className="min-w-[180px]"
                        icon={sortOptions.find(o => o.value === filters.sortBy)?.icon}
                        itemClassName="text-[10px]"
                        isOpen={activeDropdown === 'sort'}
                        onToggle={() => toggleDropdown('sort')}
                    />
                </div>
            </div>

            <div className="px-6 flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5">
                    <SlidersHorizontal size={10} className="text-purple-500" />
                    <span>ตัวกรองเสริมที่เลือก: {hasActiveFilters ? "เปิดการใช้งาน" : "ค่าเริ่มต้น"}</span>
                </div>
            </div>
        </div>
    );
};

export default BookFilterBar;
