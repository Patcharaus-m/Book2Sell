import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Plus, Trash2, Tag, BookOpen, User, CreditCard, Award, Package, AlertTriangle, UploadCloud, ChevronDown, Check } from 'lucide-react';

/**
 * AdvancedBookModal (Compact Version)
 * ปรับลดความหนาของ UI (Padding/Margin) เพื่อให้ดูไม่ล้นหน้าจอ
 */
const AdvancedBookModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        isbn: '',
        sellingPrice: '',
        coverPrice: '',
        images: [],
        condition: 'สภาพ 95%',
        status: 'available',
        stock: 1,
        description: ''
    });

    const [showConditionMenu, setShowConditionMenu] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const fileInputRef = useRef(null);

    // Close condition menu on outside click
    useEffect(() => {
        if (!showConditionMenu) return;
        const handleClose = () => setShowConditionMenu(false);
        window.addEventListener('click', handleClose);
        return () => window.removeEventListener('click', handleClose);
    }, [showConditionMenu]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                category: initialData.category || (initialData.categories?.[0] || ''),
                isbn: initialData.isbn || '',
                coverPrice: initialData.coverPrice || initialData.originalPrice || '',
                images: initialData.images || (initialData.imageUrl ? [initialData.imageUrl] : []),
                sellingPrice: initialData.sellingPrice || initialData.price || ''
            });
        } else {
            setFormData({
                title: '',
                author: '',
                category: '',
                isbn: '',
                sellingPrice: '',
                coverPrice: '',
                images: [],
                condition: 'สภาพ 95%',
                status: 'available',
                stock: 1,
                description: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleAddImage = () => {
        if (imageUrlInput && !formData.images.includes(imageUrlInput)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput] }));
            setImageUrlInput('');
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 5) {
            alert("อัปโหลดได้ไม่เกิน 5 รูปครับ");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const selectCategory = (cat) => {
        setFormData({ ...formData, category: cat });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.category) {
            alert("กรุณาเลือกหมวดหมู่");
            return;
        }
        onSubmit(formData);
        onClose();
    };

    const categoriesList = ["นิยาย", "การ์ตูน", "ความรู้", "เทคโนโลยี", "ประวัติศาสตร์", "พัฒนาตนเอง", "สยองขวัญ", "สืบสวน", "อื่นๆ"];
    const conditions = ["มือหนึ่ง", "สภาพ 99%", "สภาพ 95%", "สภาพ 80% มีตำหนิ", "สภาพพอใช้"];

    return (
        <div
            className="fixed inset-0 z-[100] grid place-items-center h-screen w-screen bg-black/60 backdrop-blur-sm p-4 transition-all duration-300"
            onClick={onClose}
        >
            <div
                // ปรับ: ลด max-h เป็น 85vh และลดความโค้งมุม (rounded) ลงเล็กน้อยให้ดูทางการขึ้น
                className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col border border-white/20 max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header: ลด Padding */}
                <div className="px-6 py-4 bg-gradient-to-br from-pink-600 to-purple-900 to-indigo-600 text-white flex justify-between items-center shrink-0 shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-inner">
                            <Plus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">{initialData ? 'แก้ไขข้อมูล' : 'ลงขายหนังสือ'}</h2>
                            <p className="text-[10px] font-medium text-pink-100 opacity-80 uppercase tracking-widest">Book Selling System</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-all duration-750 ease-in-out hover:rotate-180 flex items-center justify-center"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body: ลด space-y จาก 10 เหลือ 5 และลด padding */}
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 custom-scrollbar bg-slate-50/50">

                    {/* Image Section: จัด Layout ใหม่ให้ Compact */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <ImageIcon size={14} className="text-purple-500" /> รูปภาพ ({formData.images.length}/5)
                            </label>
                        </div>

                        {/* Upload Zone & URL Input รวมกันเพื่อให้ประหยัดที่ */}
                        <div className="flex gap-3 h-24">
                            {/* Upload Button */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-full border-2 border-dashed border-pink-200 rounded-xl hover:border-purple-400 hover:scale-102   hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1 bg-white shrink-0 group/upload"
                            >
                                <UploadCloud size={20} className="text-pink-300 group-hover/upload:text-purple-500 transition-colors duration-300" />
                                <span className="text-[10px] font-bold text-gray-400 group-hover/upload:text-purple-600 transition-colors duration-300">เลือกไฟล์</span>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" multiple />
                            </div>

                            {/* Preview List (Horizontal Scroll) */}
                            <div className="flex-1 flex gap-2 overflow-x-auto items-center pr-2 custom-scrollbar">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative w-20 h-full flex-shrink-0 rounded-xl overflow-hidden group border border-purple-100 shadow-sm">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                        {index === 0 && <div className="absolute bottom-0 inset-x-0 bg-purple-600/80 text-[8px] text-white text-center py-0.5">ปก</div>}
                                    </div>
                                ))}
                                {/* URL Input (ถ้าไม่มีรูป ให้โชว์ช่องนี้ใหญ่หน่อย แต่ถ้ามีรูปแล้วให้ต่อท้าย) */}
                                <div className="min-w-[120px] flex-1 h-full flex items-center justify-center p-2">
                                    <div className="w-full flex gap-1">
                                        <input
                                            type="url"
                                            placeholder="หรือ URL..."
                                            className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs outline-none focus:border-purple-500"
                                            value={imageUrlInput}
                                            onChange={(e) => setImageUrlInput(e.target.value)}
                                        />
                                        <button type="button" onClick={handleAddImage} className="bg-purple-100 text-purple-600 p-1.5 rounded-lg hover:bg-purple-200">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info: Grid และลดความสูง Input */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">ชื่อหนังสือ *</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all text-sm font-semibold text-gray-700"
                                placeholder="ระบุชื่อ..."
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">ผู้แต่ง *</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all text-sm font-semibold text-gray-700"
                                placeholder="ระบุผู้แต่ง..."
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">ISBN</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all text-sm font-semibold text-gray-700"
                                placeholder="เลข ISBN..."
                                value={formData.isbn}
                                onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Categories: ลดขนาดปุ่ม */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">หมวดหมู่ *</label>
                        <div className="flex flex-wrap gap-2">
                            {categoriesList.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => selectCategory(cat)}
                                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all flex items-center gap-1.5 ${formData.category === cat
                                        ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-purple-300 hover:bg-purple-50'
                                        }`}
                                >
                                    {formData.category === cat && <Check size={10} />}
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price & Condition */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">ราคาปก (บาท)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all text-sm font-bold text-gray-500 line-through"
                                placeholder="0"
                                value={formData.coverPrice}
                                onChange={e => setFormData({ ...formData, coverPrice: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">ราคาขาย (บาท) *</label>
                            <input
                                required
                                type="number"
                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all text-sm font-bold text-purple-600"
                                placeholder="0"
                                value={formData.sellingPrice}
                                onChange={e => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">สภาพ *</label>
                        <div className="relative">
                            {/* Custom Condition Dropdown */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    onClick={() => setShowConditionMenu(!showConditionMenu)}
                                    className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl flex items-center justify-between focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all text-sm font-semibold text-gray-700"
                                >
                                    <span>{formData.condition}</span>
                                    <ChevronDown className={`transition-transform duration-300 ${showConditionMenu ? 'rotate-180' : ''} text-purple-400`} size={14} />
                                </button>

                                {showConditionMenu && (
                                    <div className="absolute top-full left-0 mt-2 w-full bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl border border-purple-400/20 py-2 z-[110] animate-popup overflow-hidden">
                                        {conditions.map(cond => (
                                            <button
                                                key={cond}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, condition: cond });
                                                    setShowConditionMenu(false);
                                                }}
                                                className={`w-full text-left px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${formData.condition === cond
                                                    ? 'bg-white/20 text-white'
                                                    : 'text-purple-50 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {cond}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stock & Description */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-1.5 col-span-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">จำนวน</label>
                            <input
                                required
                                type="number"
                                min="1"
                                className="w-full px-2 py-2.5 text-center bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all text-sm font-bold text-gray-700"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1.5 col-span-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">รายละเอียด/ตำหนิ</label>
                            <textarea
                                className="w-full px-4 py-2.5 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700/15 focus:border-purple-700 outline-none transition-all min-h-[60px] text-sm text-gray-600 resize-none"
                                placeholder="เช่น มีรอยพับที่ปกหลัง..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="relative group w-full py-3.5 bg-purple-900 text-white font-bold text-sm uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250 flex items-center justify-center gap-2 mt-2 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            <span>{initialData ? 'บันทึกการแก้ไข' : 'ลงขาย'}</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
};

const ArrowRight = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-white-800 ${className}`}//ไว้แต่งสี
    >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default AdvancedBookModal;