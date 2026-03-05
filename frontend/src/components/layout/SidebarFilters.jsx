import { useBook } from "../../context/useBook";


export default function SidebarFilters() {
    const { filters, setFilters } = useBook();

    const categories = ["นิยาย", "การ์ตูน", "ความรู้", "เทคโนโลยี", "ประวัติศาสตร์", "พัฒนาตนเอง", "อื่นๆ"];

    const handlePriceChange = (e) => {
        setFilters({ ...filters, maxPrice: Number(e.target.value) });
    };

    return (
        <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">หมวดหมู่หนังสือ</h3>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setFilters({ ...filters, category: "" })}
                                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${!filters.category ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                ทั้งหมด
                            </button>
                        </li>
                        {categories.map(cat => (
                            <li key={cat}>
                                <button
                                    onClick={() => setFilters({ ...filters, category: cat })}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${filters.category === cat ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Range */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">ช่วงราคา</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">{(filters.maxPrice || 0).toLocaleString()} <i className="bi bi-coin" style={{ fontSize: '12px' }} /></span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={filters.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                        <span className="flex items-center gap-1">0 <i className="bi bi-coin" style={{ fontSize: '8px' }} /></span>
                        <span className="flex items-center gap-1">1,000+ <i className="bi bi-coin" style={{ fontSize: '8px' }} /></span>
                    </div>
                </div>

                {/* Condition */}
                <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">สภาพหนังสือ</h3>
                    <div className="space-y-2">
                        {[
                            { label: "ทุกสภาพ", value: 0 },
                            { label: "ดีเยี่ยม (90%+)", value: 90 },
                            { label: "ดี (70%+)", value: 70 },
                            { label: "พอใช้ (50%+)", value: 50 },
                        ].map((cond) => (
                            <label key={cond.value} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="condition"
                                        checked={filters.minCondition === cond.value}
                                        onChange={() => setFilters({ ...filters, minCondition: cond.value })}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${filters.minCondition === cond.value ? 'border-emerald-600 bg-emerald-600' : 'border-gray-200 group-hover:border-emerald-400'}`}>
                                        <div className={`w-2 h-2 rounded-full bg-white transition-all ${filters.minCondition === cond.value ? 'scale-100' : 'scale-0'}`} />
                                    </div>
                                </div>
                                <span className={`ml-3 text-sm transition-colors ${filters.minCondition === cond.value ? 'text-emerald-600 font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                    {cond.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
