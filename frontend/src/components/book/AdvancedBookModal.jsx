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
    const [sellingPriceError, setSellingPriceError] = useState('');
    const [isbnError, setIsbnError] = useState('');
    const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'
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
        setSellingPriceError('');
        setIsbnError('');
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleAddImage = () => {
        if (formData.images.length >= 5) {
            alert("เพิ่มได้ไม่เกิน 5 รูปครับ");
            return;
        }
        if (imageUrlInput && !formData.images.includes(imageUrlInput)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput] }));
            setImageUrlInput('');
        }
    };

    const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 5) {
            alert("อัปโหลดได้ไม่เกิน 5 รูปครับ");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const compressed = await compressImage(reader.result);
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, compressed]
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
            alert('กรุณาเลือกหมวดหมู่');
            return;
        }
        if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) {
            setSellingPriceError('กรุณาระบุราคาขายที่มากกว่า 0');
            return;
        }
        if (Number(formData.sellingPrice) > 999999) {
            setSellingPriceError('ราคาขายต้องไม่เกิน 999,999');
            return;
        }

        if (formData.isbn && formData.isbn.length !== 13) {
            setIsbnError('ISBN ต้องมี 13 หลักพอดี');
            return;
        }

        const payload = {
            title: formData.title,
            author: formData.author,
            category: formData.category,
            isbn: formData.isbn || undefined,
            coverPrice: formData.coverPrice ? Number(formData.coverPrice) : undefined,
            sellingPrice: Number(formData.sellingPrice),
            condition: formData.condition,
            description: formData.description || undefined,
            stock: formData.stock ? Number(formData.stock) : undefined,
            status: formData.status,
            images: formData.images,
            isDeleted: false
        };

        onSubmit(payload);
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
                <div className="px-6 py-4 bg-gradient-to-br from-emerald-600 to-teal-700 to-teal-900 text-white flex justify-between items-center shrink-0 shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-inner">
                            <Plus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">{initialData ? 'แก้ไขข้อมูล' : 'ลงขายหนังสือ'}</h2>
                            <p className="text-[10px] font-medium text-emerald-100 opacity-80 uppercase tracking-widest">Book Selling System</p>
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <ImageIcon size={14} className="text-emerald-500" /> รูปภาพ ({formData.images.length}/5)
                            </label>

                            {/* Toggle Buttons */}
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setImageInputMode('upload')}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${imageInputMode === 'upload'
                                        ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    อัปโหลดไฟล์
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageInputMode('url')}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${imageInputMode === 'url'
                                        ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    ระบุ URL
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 h-28">
                            {/* Conditional Input based on Mode */}
                            {imageInputMode === 'upload' ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-28 h-full border-2 border-dashed border-emerald-200 rounded-2xl hover:border-emerald-400 hover:scale-102 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1.5 bg-white shrink-0 group/upload shadow-sm"
                                >
                                    <div className="bg-emerald-50 p-2 rounded-xl group-hover/upload:bg-emerald-100 transition-colors">
                                        <UploadCloud size={24} className="text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">เลือกไฟล์</span>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" multiple />
                                </div>
                            ) : (
                                <div className="w-48 h-full bg-white border border-emerald-100 rounded-2xl p-4 flex flex-col justify-center gap-3 shrink-0 shadow-sm">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                        <Plus size={12} /> ใส่ลิงก์รูปภาพ
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 bg-slate-50 border border-emerald-100 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                                            value={imageUrlInput}
                                            onChange={(e) => setImageUrlInput(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddImage}
                                            className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 active:scale-90 transition-all"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Preview List (Horizontal Scroll) */}
                            <div className="flex-1 flex gap-3 overflow-x-auto items-center pr-3 custom-scrollbar pb-1">
                                {formData.images.length === 0 ? (
                                    <div className="w-full h-full border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center opacity-40">
                                        <ImageIcon size={24} className="text-gray-300 mb-1" />
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ยังไม่มีรูปภาพ</span>
                                    </div>
                                ) : (
                                    formData.images.map((url, index) => (
                                        <div key={index} className="relative w-20 h-full flex-shrink-0 rounded-2xl overflow-hidden group border-2 border-white shadow-xl group/img">
                                            <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-600 shadow-lg scale-75 hover:scale-100"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 backdrop-blur-sm text-[8px] font-black text-white text-center py-1 uppercase tracking-widest">
                                                    ภาพปก
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
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
                                className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-700/15 focus:border-emerald-700 outline-none transition-all text-sm font-semibold text-gray-700"
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
                                className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-700/15 focus:border-emerald-700 outline-none transition-all text-sm font-semibold text-gray-700"
                                placeholder="ระบุผู้แต่ง..."
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">ISBN</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 outline-none transition-all text-sm font-semibold text-gray-700 ${isbnError ? 'border-red-400 focus:ring-red-500/10' : 'border-emerald-200 focus:ring-emerald-700/15 focus:border-emerald-700'
                                    }`}
                                placeholder="เลข ISBN 13 หลัก..."
                                value={formData.isbn}
                                onChange={e => {
                                    setIsbnError('');
                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                                    setFormData({ ...formData, isbn: val });
                                }}
                            />
                            {isbnError && <p className="text-[10px] text-red-500 mt-1 ml-1">{isbnError}</p>}
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
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50'
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
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">ราคาปก (<i className="bi bi-coin" style={{ fontSize: '8px' }} />)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-700/15 focus:border-emerald-700 outline-none transition-all text-sm font-bold text-gray-500 line-through"
                                placeholder="0"
                                value={formData.coverPrice}
                                onChange={e => setFormData({ ...formData, coverPrice: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">ราคาขาย (<i className="bi bi-coin" style={{ fontSize: '8px' }} />) *</label>
                            <input
                                type="number"
                                min="1"
                                max="999999"
                                className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 outline-none transition-all text-sm font-bold ${sellingPriceError
                                    ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500 text-red-500'
                                    : 'border-emerald-200 focus:ring-emerald-700/15 focus:border-emerald-700 text-emerald-600'
                                    }`}
                                placeholder="0"
                                value={formData.sellingPrice}
                                onChange={e => {
                                    setSellingPriceError('');
                                    setFormData({ ...formData, sellingPrice: e.target.value });
                                }}
                            />
                            {sellingPriceError && (
                                <p className="text-xs text-red-500 font-medium ml-1">{sellingPriceError}</p>
                            )}
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
                                    className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between focus:ring-2 focus:ring-emerald-700/15 focus:border-emerald-700 outline-none transition-all text-sm font-semibold text-gray-700"
                                >
                                    <span>{formData.condition}</span>
                                    <ChevronDown className={`transition-transform duration-300 ${showConditionMenu ? 'rotate-180' : ''} text-emerald-400`} size={14} />
                                </button>

                                {showConditionMenu && (
                                    <div className="absolute top-full left-0 mt-2 w-full bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-2xl border border-emerald-400/20 py-2 z-[110] animate-popup overflow-hidden">
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
                                                    : 'text-emerald-50 hover:bg-white/10 hover:text-white'
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
                                className="w-full px-2 py-2.5 text-center bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-700/15 focus:border-emerald-700 outline-none transition-all text-sm font-bold text-gray-700"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1.5 col-span-3">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">รายละเอียด/ตำหนิ</label>
                            <textarea
                                className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-700/15 focus:border-emerald-700 outline-none transition-all min-h-[60px] text-sm text-gray-600 resize-none"
                                placeholder="เช่น มีรอยพับที่ปกหลัง..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="relative group w-full py-3.5 bg-emerald-900 text-white font-bold text-sm uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-250 flex items-center justify-center gap-2 mt-2 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
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