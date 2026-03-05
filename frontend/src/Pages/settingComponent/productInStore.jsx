import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Edit2, Trash2, X, AlertOctagon, Save, Image, DollarSign, Package, FileText, Tag, Loader2, Upload, ShoppingCart, Info, CheckCircle, MessageCircle, Star, User } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useBook } from "../../context/useBook";
import { getBooksBySellerId, updateBookService } from "../../services/bookService";

export default function ProductInStore() {
    const { user } = useAuth();
    const { deleteBook, refreshBooks } = useBook();
    const [userProducts, setUserProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'available' | 'sold' | 'closed'
    const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'
    const fileInputRef = useRef(null);

    // ดึงหนังสือของ user นี้จาก API
    const fetchMyBooks = React.useCallback(async () => {
        if (!user?._id && !user?.id) {
            setLoading(false);
            return;
        }

        const sellerId = user._id || user.id;
        const result = await getBooksBySellerId(sellerId);

        if (result.payload) {
            setUserProducts(result.payload);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchMyBooks();
    }, [fetchMyBooks]);

    // เมื่อเลือกหนังสือที่จะแก้ไข
    const handleOpenEdit = (product) => {
        setItemToEdit(product);
        setEditForm({
            title: product.title || '',
            author: product.author || '',
            category: product.category || '',
            isbn: product.isbn || '',
            coverPrice: product.coverPrice || 0,
            sellingPrice: product.sellingPrice || 0,
            condition: product.condition || 'สภาพดี',
            description: product.description || '',
            stock: product.stock || 1,
            images: product.images || []
        });
    };

    // บันทึกการแก้ไข
    const handleSaveEdit = async () => {
        if (!itemToEdit) return;

        if (!editForm.sellingPrice || Number(editForm.sellingPrice) <= 0) {
            alert('กรุณาระบุราคาขายที่มากกว่า 0');
            return;
        }
        if (Number(editForm.sellingPrice) > 999999) {
            alert('ราคาขายต้องไม่เกิน 999,999');
            return;
        }

        if (editForm.isbn && editForm.isbn.length !== 13) {
            alert('ISBN ต้องมี 13 หลักพอดี');
            return;
        }

        setIsSaving(true);
        const bookId = itemToEdit._id || itemToEdit.id;
        const userId = user._id || user.id;

        const result = await updateBookService(bookId, {
            ...editForm,
            sellingPrice: Number(editForm.sellingPrice)
        }, userId);
        console.log('Update result:', result);

        if (result.code === 200 || result.code === 201 || result.status === 2001) {
            // Refetch ข้อมูลล่าสุดจาก Backend เพื่อความชัวร์ (สำหรับหน้านี้)
            await fetchMyBooks();

            // อัปเดตข้อมูล Global Context (สำหรับหน้าหลัก)
            if (refreshBooks) {
                refreshBooks();
            }

            setItemToEdit(null);
            alert("อัปเดตหนังสือเรียบร้อยแล้ว!");
        } else {
            alert(result.error?.message || result.message || "ไม่สามารถอัปเดตหนังสือได้");
        }
        setIsSaving(false);
    };

    const handleDelete = async (bookId) => {
        const userId = user._id || user.id;
        const result = await deleteBook(bookId, userId);

        if (result.success) {
            setUserProducts(prev => prev.filter(book => book._id !== bookId && book.id !== bookId));
            setItemToDelete(null);
            alert("ลบหนังสือเรียบร้อยแล้ว!");
        } else {
            alert(result.message || "ไม่สามารถลบหนังสือได้");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if ((editForm.images || []).length >= 5) {
            alert("เพิ่มได้ไม่เกิน 5 รูปครับ");
            return;
        }

        // Check file size (optional, but good practice given 50MB limit)
        if (file.size > 10 * 1024 * 1024) { // 10MB limit for safe Base64
            alert("ไฟล์มีขนาดใหญ่เกินไป (จำกัด 10MB สำหรับการอัปโหลดด่วน)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setEditForm(prev => ({
                ...prev,
                images: [...(prev.images || []), base64String]
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddImageUrl = () => {
        const url = imageUrlInputRef.current?.value;
        if (!url) return;

        if ((editForm.images || []).length >= 5) {
            alert("เพิ่มได้ไม่เกิน 5 รูปครับ");
            return;
        }

        if (!(editForm.images || []).includes(url)) {
            setEditForm(prev => ({
                ...prev,
                images: [...(prev.images || []), url]
            }));
            if (imageUrlInputRef.current) imageUrlInputRef.current.value = '';
        }
    };

    const removeImage = (index) => {
        setEditForm(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const imageUrlInputRef = useRef(null);

    const conditionOptions = ['มือหนึ่ง', 'สภาพ 90%', 'สภาพ 80%', 'สภาพดี', 'มีตำหนิเล็กน้อย'];

    // Status helpers
    const getStatusInfo = (product) => {
        const s = product.status || (product.stock > 0 ? 'available' : 'sold');
        if (s === 'sold') return { label: 'ขายแล้ว', color: 'bg-red-500 text-white', dot: 'bg-red-400' };
        if (s === 'closed') return { label: 'ปิดการขาย', color: 'bg-gray-400 text-white', dot: 'bg-gray-300' };
        return { label: 'ขายอยู่', color: 'bg-emerald-500 text-white', dot: 'bg-emerald-400' };
    };

    const counts = {
        all: userProducts.length,
        available: userProducts.filter(p => (p.status || 'available') === 'available').length,
        sold: userProducts.filter(p => p.status === 'sold').length,
        closed: userProducts.filter(p => p.status === 'closed').length,
    };

    const filteredProducts = statusFilter === 'all'
        ? userProducts
        : userProducts.filter(p => (p.status || 'available') === statusFilter);

    return (
        <div className="relative min-h-screen">
            <div className="mb-8 animate-in slide-in-from-top-4 duration-700 fade-in">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 tracking-tight mb-2">สินค้าในร้าน</h1>
                <p className="text-gray-500 italic flex items-center gap-2">
                    <span className="w-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"></span>
                    จัดการหนังสือที่คุณลงขาย
                </p>
                {!loading && userProducts.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">
                        {[
                            ['all', 'ทั้งหมด', 'bg-gray-900 text-white'],
                            ['available', 'ขายอยู่', 'bg-emerald-500 text-white'],
                            ['sold', 'ขายแล้ว', 'bg-red-500 text-white'],
                            ['closed', 'ปิดการขาย', 'bg-gray-400 text-white'],
                        ].map(([key, label, activeClass]) => (
                            <button key={key}
                                onClick={() => setStatusFilter(key)}
                                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${statusFilter === key
                                    ? activeClass + ' shadow-lg scale-105'
                                    : 'bg-white/60 text-gray-500 border border-gray-100 hover:border-emerald-200 hover:text-emerald-600'
                                    }`}>
                                {label}
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${statusFilter === key ? 'bg-white/25' : 'bg-gray-100'}`}>
                                    {counts[key]}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>


            {loading ? (
                <div className="text-center py-20 animate-pulse">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                    <p className="text-gray-400 font-medium">กำลังโหลดข้อมูล...</p>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product, idx) => {
                        const statusInfo = getStatusInfo(product);
                        const isSold = product.status === 'sold';
                        const isClosed = product.status === 'closed';
                        const isDimmed = isSold || isClosed;
                        return (
                            <div
                                key={product._id || product.id}
                                style={{ animationDelay: `${idx * 100}ms` }}
                                className={`group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-5 shadow-xl shadow-emerald-100/20 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden animate-in fade-in zoom-in-95 fill-mode-backwards ${isDimmed ? 'opacity-70 saturate-50 hover:opacity-90 hover:saturate-75' : ''
                                    }`}
                            >
                                {/* Glass background decoration */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl group-hover:bg-emerald-300/40 transition-all duration-700" />
                                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl group-hover:bg-teal-300/40 transition-all duration-700" />

                                <div className="relative z-10">
                                    <div className="aspect-[3/4] overflow-hidden rounded-[2rem] mb-5 bg-gray-50 border border-white/40 shadow-inner group-hover:shadow-lg transition-all duration-500 relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                        <img
                                            src={product.image || (product.images && product.images[0])}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Rich Status Badge */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 ${statusInfo.color} backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-md`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} bg-white/50 animate-pulse`} />
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        {/* Stock count - top right */}
                                        <div className="absolute top-3 right-3 z-20">
                                            <span className="flex items-center gap-1 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black text-white/90">
                                                <Package size={9} /> {product.stock || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-gray-900 truncate mb-0.5 text-lg px-2 group-hover:text-emerald-600 transition-colors">{product.title}</h3>
                                    <p className="text-xs text-gray-400 font-bold px-2 mb-1 truncate">{product.author}</p>
                                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-black text-xl mb-4 px-2 flex items-center gap-2">{(product.sellingPrice || 0).toLocaleString()} <i className="bi bi-coin text-emerald-500" /></p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => !isDimmed && handleOpenEdit(product)}
                                            disabled={isDimmed}
                                            className={`flex-1 py-3 font-bold rounded-2xl border flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-300 ${isDimmed
                                                ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
                                                : 'bg-white/60 backdrop-blur-md text-gray-600 border-white/60 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent shadow-sm hover:shadow-emerald-200 hover:shadow-lg active:scale-75 hover:scale-95'
                                                }`}
                                        >
                                            <Edit2 size={16} />
                                            <span>แก้ไข</span>
                                        </button>
                                        <button
                                            onClick={() => setItemToDelete(product)}
                                            className="w-14 h-14 bg-red-50/50 backdrop-blur-sm text-red-500 font-bold rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center shadow-sm hover:shadow-red-200 group/btn"
                                        >
                                            <Trash2 size={20} className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Empty state
                <div className="text-center py-32 bg-white/40 backdrop-blur-lg rounded-[3rem] border border-white/50 shadow-sm border-dashed border-emerald-100/50 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-emerald-100/50 shadow-lg">
                        <BookOpen size={40} className="text-emerald-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        {statusFilter === 'all' ? 'ยังไม่มีหนังสือในชั้น' : `ไม่มีหนังสือในสถานะ "${statusFilter === 'available' ? 'ขายอยู่' : statusFilter === 'sold' ? 'ขายแล้ว' : 'ปิดการขาย'}"`}
                    </h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">เริ่มลงขายหนังสือเล่มแรกของคุณและสร้างรายได้!</p>
                </div>
            )}

            {/* Edit Book Modal - Enhanced Design */}
            {itemToEdit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-emerald-900/20 backdrop-blur-sm animate-in fade-in duration-500"
                        onClick={() => setItemToEdit(null)}
                    />

                    <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-6 shadow-2xl shadow-emerald-500/20 animate-in zoom-in-95 spring-bounce-30 duration-500">
                        {/* Decorative Blob */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

                        <button
                            onClick={() => setItemToEdit(null)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-20
                            hover:scale-110 active:scale-95 hover:rotate-180 duration-400
                            "
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6 relative z-10 text-center md:text-left">
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 tracking-tight">แก้ไขข้อมูลหนังสือ</h2>
                            <p className="text-gray-400 text-xs font-bold mt-0.5 uppercase tracking-wider">Product Update</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 relative z-10">
                            {/* Title */}
                            <div className="col-span-2 md:col-span-3 group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors">ชื่อหนังสือ</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white focus:shadow-md focus:shadow-emerald-100/30 transition-all placeholder:text-gray-200"
                                        placeholder="ชื่อหนังสือ"
                                    />
                                </div>
                            </div>

                            {/* Author */}
                            <div className="col-span-1 group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors">ผู้แต่ง</label>
                                <input
                                    type="text"
                                    value={editForm.author}
                                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white focus:shadow-md focus:shadow-emerald-100/30 transition-all placeholder:text-gray-200 transform group-focus-within:scale-[1.005]"
                                    placeholder="ชื่อผู้แต่ง"
                                />
                            </div>

                            {/* Category */}
                            <div className="col-span-1 group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors">หมวดหมู่</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white focus:shadow-md focus:shadow-emerald-100/30 transition-all placeholder:text-gray-200"
                                        placeholder="หมวดหมู่"
                                    />
                                </div>
                            </div>

                            {/* ISBN */}
                            <div className="col-span-1 group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors">เลข ISBN (13 หลัก)</label>
                                <input
                                    type="text"
                                    value={editForm.isbn}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                                        setEditForm({ ...editForm, isbn: val });
                                    }}
                                    className="w-full px-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white focus:shadow-md focus:shadow-emerald-100/30 transition-all placeholder:text-gray-200 transform group-focus-within:scale-[1.005]"
                                    placeholder="ใส่เฉพาะตัวเลข"
                                />
                            </div>

                            {/* Condition */}
                            <div className="col-span-1 group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors">สภาพสินค้า</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <select
                                        value={editForm.condition}
                                        onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white appearance-none cursor-pointer"
                                    >
                                        {conditionOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-300">
                                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Price */}
                            <div className="group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors flex items-center gap-1">ราคาปก (<i className="bi bi-coin" style={{ fontSize: '8px' }} />)</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="number"
                                        value={editForm.coverPrice}
                                        onChange={(e) => setEditForm({ ...editForm, coverPrice: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Selling Price */}
                            <div className="group">
                                <label className="text-[9px] font-black text-teal-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-teal-600 transition-colors flex items-center gap-1">ราคาขายจริง (<i className="bi bi-coin" style={{ fontSize: '8px' }} />)</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" />
                                    <input
                                        type="number"
                                        min="1"
                                        max="999999"
                                        value={editForm.sellingPrice}
                                        onChange={(e) => setEditForm({ ...editForm, sellingPrice: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-teal-50/30 border-2 border-teal-100 rounded-xl text-sm font-black text-teal-600 focus:outline-none focus:border-teal-200 focus:bg-white transition-all shadow-sm"
                                        placeholder="ราคาขั้นต่ำ 1"
                                    />
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors">สต็อก</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="number"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white transition-all"
                                        placeholder="1"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-span-2 md:col-span-3 group">
                                <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-emerald-600 transition-colors">รายละเอียด / ตำหนิ</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <FileText size={16} className="absolute left-4 top-3 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:border-emerald-200 focus:bg-white transition-all min-h-[60px] max-h-[80px] resize-none leading-relaxed"
                                        placeholder="รายละเอียดเพิ่มเติม หรือตำหนิของหนังสือ..."
                                    />
                                </div>
                            </div>

                            {/* Image URL & Preview */}
                            <div className="col-span-2 md:col-span-3 pt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">รูปภาพหนังสือ</label>

                                    {/* Toggle Buttons */}
                                    <div className="flex bg-emerald-50/50 p-1 rounded-xl border border-emerald-100">
                                        <button
                                            type="button"
                                            onClick={() => setImageInputMode('upload')}
                                            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${imageInputMode === 'upload'
                                                ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            อัปโหลด
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setImageInputMode('url')}
                                            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${imageInputMode === 'url'
                                                ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            ใส่ URL
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        {imageInputMode === 'upload' ? (
                                            <div className="flex-1 group">
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border-2 border-emerald-100 border-dashed hover:border-emerald-300"
                                                >
                                                    <Upload size={14} />
                                                    <span>คลิกเลือกไฟล์เพื่ออัปโหลด</span>
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-1 group">
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1 transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                                        <Image size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 group-focus-within:text-emerald-500 transition-colors" />
                                                        <input
                                                            type="text"
                                                            ref={imageUrlInputRef}
                                                            className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-emerald-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-200 focus:bg-white transition-all shadow-inner"
                                                            placeholder="เช่น https://example.com/image.jpg"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddImageUrl}
                                                        className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 active:scale-90 transition-all"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Horizontal Preview Scroll */}
                                    <div className="flex gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar min-h-[80px]">
                                        {(editForm.images || []).length === 0 ? (
                                            <div className="flex-1 h-20 border-2 border-dashed border-emerald-50 rounded-2xl flex flex-col items-center justify-center opacity-40">
                                                <ImageIcon size={20} className="text-emerald-200" />
                                                <span className="text-[8px] font-black text-emerald-300 uppercase tracking-widest mt-1">ยังไม่มีรูปภาพ</span>
                                            </div>
                                        ) : (
                                            (editForm.images || []).map((url, index) => (
                                                <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden group border-2 border-white shadow-md">
                                                    <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg scale-75 hover:scale-100"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                    {index === 0 && (
                                                        <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 backdrop-blur-sm text-[7px] font-black text-white text-center py-0.5 uppercase tracking-widest">
                                                            ปก
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-8 relative z-10">
                            <button
                                onClick={() => setItemToEdit(null)}
                                className="flex-1 py-3 bg-white border border-gray-100 hover:border-gray-200 text-gray-500 font-bold rounded-xl text-sm transition-all active:scale-98"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="flex-[2] py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-black rounded-xl text-sm shadow-lg shadow-emerald-100 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>กำลังบันทึก...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="group-hover:animate-bounce" />
                                        <span>บันทึกการแก้ไข</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal - Enhanced */}
            {itemToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-red-900/10 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setItemToDelete(null)}
                    />

                    <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 spring-bounce-20 duration-500 flex flex-col items-center">
                        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner border border-red-100 animate-in zoom-in spin-in-12 duration-500">
                            <AlertOctagon size={40} className="text-red-500 drop-shadow-sm" />
                        </div>

                        <h2 className="text-3xl font-black text-gray-900 mb-3 text-center tracking-tight">ยืนยันการลบ?</h2>
                        <p className="text-gray-500 text-center mb-10 leading-relaxed font-medium">
                            คุณต้องการลบหนังสือ <br /><span className="text-gray-900 font-bold text-lg">"{itemToDelete.title}"</span><br /> ออกจากร้านใช่หรือไม่?
                        </p>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-black rounded-2xl transition-all"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => handleDelete(itemToDelete._id || itemToDelete.id)}
                                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-200 transition-all hover:scale-105 active:scale-95"
                            >
                                ลบทิ้ง
                            </button>
                        </div>

                        <button
                            onClick={() => setItemToDelete(null)}
                            className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-900 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
