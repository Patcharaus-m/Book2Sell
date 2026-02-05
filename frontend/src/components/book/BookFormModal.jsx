import React, { useState, useEffect } from 'react';
import { X, Upload, Book, User, DollarSign, Tag, FileText, Save, Plus } from 'lucide-react';

const BookFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category: 'นิยาย',
        description: '',
        imageUrl: '',
        condition: 90,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                author: '',
                price: '',
                category: 'นิยาย',
                description: '',
                imageUrl: '',
                condition: 90,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const categories = ["นิยาย", "การ์ตูน", "ความรู้", "เทคโนโลยี", "ประวัติศาสตร์", "พัฒนาตนเอง", "อื่นๆ"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {initialData ? <Save size={24} /> : <Plus size={24} />}
                        {initialData ? "แก้ไขข้อมูลหนังสือ" : "ลงขายหนังสือ"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side: Image Upload & Preview */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">รูปปกหนังสือ</label>
                            <div className="relative group aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                        <p className="text-xs text-gray-500">วางรูปภาพที่นี่ หรือใส่ URL ด้านล่าง</p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white text-sm font-medium">เปลี่ยนรูปภาพ</p>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="URL รูปภาพหนังสือ"
                                className="w-full px-4 py-2 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                        </div>

                        {/* Right Side: Fields */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    <Book size={16} className="text-blue-500" /> ชื่อหนังสือ
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="เช่น มหาศึกคนชนเทพ"
                                    className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    <User size={16} className="text-blue-500" /> ผู้แต่ง
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ชื่อผู้เขียน"
                                    className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <DollarSign size={16} className="text-purple-500" /> ราคา (บาท)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">฿</span>
                                        <input
                                            type="number"
                                            required
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <Tag size={16} className="text-purple-500" /> หมวดหมู่
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    <FileText size={16} className="text-orange-500" /> รายละเอียด
                                </label>
                                <textarea
                                    placeholder="เล่ารายละเอียดหนังสือ เช่น สภาพหนังสือ หรือตำหนิต่างๆ"
                                    rows="4"
                                    className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 px-4 border border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {initialData ? "บันทึก" : "ลงขาย"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookFormModal;
