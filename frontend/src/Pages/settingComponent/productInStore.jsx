import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Edit2, Trash2, X, AlertOctagon, Save, Image, DollarSign, Package, FileText, Tag, Loader2, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useBook } from "../../context/BookContext";
import { getBooksBySellerId, updateBookService } from "../../services/bookService";

export default function ProductInStore() {
    const { user } = useAuth();
    const { deleteBook } = useBook();
    const [userProducts, setUserProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    // ดึงหนังสือของ user นี้จาก API
    useEffect(() => {
        const fetchMyBooks = async () => {
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
        };

        fetchMyBooks();
    }, [user]);

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

        setIsSaving(true);
        const bookId = itemToEdit._id || itemToEdit.id;
        const userId = user._id || user.id;

        const result = await updateBookService(bookId, editForm, userId);

        if (result.code === 200 || result.code === 201) {
            // อัปเดต local state
            setUserProducts(prev => prev.map(book =>
                (book._id === bookId || book.id === bookId)
                    ? { ...book, ...editForm }
                    : book
            ));
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
                images: [base64String, ...(prev.images?.slice(1) || [])]
            }));
        };
        reader.readAsDataURL(file);
    };

    const conditionOptions = ['มือหนึ่ง', 'สภาพ 90%', 'สภาพ 80%', 'สภาพดี', 'มีตำหนิเล็กน้อย'];

    return (
        <div className="relative min-h-screen">
            <div className="mb-10 animate-in slide-in-from-top-4 duration-700 fade-in">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 tracking-tight mb-2">สินค้าในร้าน</h1>
                <p className="text-gray-500 italic flex items-center gap-2">
                    <span className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full"></span>
                    จัดการหนังสือที่คุณลงขาย
                </p>
            </div>

            {loading ? (
                <div className="text-center py-20 animate-pulse">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                    <p className="text-gray-400 font-medium">กำลังโหลดข้อมูล...</p>
                </div>
            ) : userProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {userProducts.map((product, idx) => (
                        <div
                            key={product._id || product.id}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-5 shadow-xl shadow-purple-100/20 hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden animate-in fade-in zoom-in-95 fill-mode-backwards"
                        >
                            {/* Glass background decoration */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl group-hover:bg-purple-300/40 transition-all duration-700" />
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl group-hover:bg-pink-300/40 transition-all duration-700" />

                            <div className="relative z-10">
                                <div className="aspect-[3/4] overflow-hidden rounded-[2rem] mb-5 bg-gray-50 border border-white/40 shadow-inner group-hover:shadow-lg transition-all duration-500 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                    <img
                                        src={product.image || (product.images && product.images[0])}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Quick Status Tag */}
                                    <div className="absolute top-3 left-3 z-20">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-purple-600 uppercase tracking-widest shadow-sm">
                                            {product.stock > 0 ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="font-black text-gray-900 truncate mb-1 text-lg px-2 group-hover:text-purple-600 transition-colors">{product.title}</h3>
                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 font-black text-xl mb-6 px-2">฿{product.sellingPrice?.toLocaleString()}</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleOpenEdit(product)}
                                        className="flex-1 py-3 bg-white/60 backdrop-blur-md text-gray-600 font-bold rounded-2xl border border-white/60 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-purple-200 hover:shadow-lg flex items-center justify-center gap-2 group/edit relative overflow-hidden
                                        active:scale-75 hover:scale-95 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <Edit2 size={16} className="relative z-10 group-hover:text-white transition-colors" />
                                        <span className="relative z-10">แก้ไข</span>
                                    </button>
                                    <button
                                        onClick={() => setItemToDelete(product)}
                                        className="w-14 h-14 bg-red-50/50 backdrop-blur-sm text-red-500 font-bold rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center shadow-sm hover:shadow-red-200 group/btn"
                                    >
                                        <Trash2 size={20} className="group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300 active:rotate-360" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white/40 backdrop-blur-lg rounded-[3rem] border border-white/50 shadow-sm border-dashed border-purple-100/50 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-purple-100/50 shadow-lg">
                        <BookOpen size={40} className="text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">ยังไม่มีหนังสือในชั้น</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">เริ่มลงขายหนังสือเล่มแรกของคุณและสร้างรายได้!</p>
                </div>
            )}

            {/* Edit Book Modal - Enhanced Design */}
            {itemToEdit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-purple-900/20 backdrop-blur-sm animate-in fade-in duration-500"
                        onClick={() => setItemToEdit(null)}
                    />

                    <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-6 shadow-2xl shadow-purple-500/20 animate-in zoom-in-95 spring-bounce-30 duration-500">
                        {/* Decorative Blob */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

                        <button
                            onClick={() => setItemToEdit(null)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-20
                            hover:scale-110 active:scale-95 hover:rotate-180 duration-400
                            "
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6 relative z-10 text-center md:text-left">
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 tracking-tight">แก้ไขข้อมูลหนังสือ</h2>
                            <p className="text-gray-400 text-xs font-bold mt-0.5 uppercase tracking-wider">Product Update</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 relative z-10">
                            {/* Title */}
                            <div className="col-span-2 md:col-span-3 group">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">ชื่อหนังสือ</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-purple-200 focus:bg-white focus:shadow-md focus:shadow-purple-100/30 transition-all placeholder:text-gray-200"
                                        placeholder="ชื่อหนังสือ"
                                    />
                                </div>
                            </div>

                            {/* Author */}
                            <div className="col-span-1 group">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">ผู้แต่ง</label>
                                <input
                                    type="text"
                                    value={editForm.author}
                                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-purple-200 focus:bg-white focus:shadow-md focus:shadow-purple-100/30 transition-all placeholder:text-gray-200 transform group-focus-within:scale-[1.005]"
                                    placeholder="ชื่อผู้แต่ง"
                                />
                            </div>

                            {/* Category */}
                            <div className="col-span-1 group">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">หมวดหมู่</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-purple-200 focus:bg-white focus:shadow-md focus:shadow-purple-100/30 transition-all placeholder:text-gray-200"
                                        placeholder="หมวดหมู่"
                                    />
                                </div>
                            </div>

                            {/* Condition */}
                            <div className="col-span-1 group">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">สภาพสินค้า</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <select
                                        value={editForm.condition}
                                        onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-purple-200 focus:bg-white appearance-none cursor-pointer"
                                    >
                                        {conditionOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-300">
                                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Price */}
                            <div className="group">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">ราคาปก</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        type="number"
                                        value={editForm.coverPrice}
                                        onChange={(e) => setEditForm({ ...editForm, coverPrice: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-purple-200 focus:bg-white transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Selling Price */}
                            <div className="group">
                                <label className="text-[9px] font-black text-pink-500 uppercase tracking-widest mb-1.5 block group-focus-within:text-pink-600 transition-colors">ราคาขายจริง</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
                                    <input
                                        type="number"
                                        value={editForm.sellingPrice}
                                        onChange={(e) => setEditForm({ ...editForm, sellingPrice: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-3 bg-pink-50/30 border-2 border-pink-100 rounded-xl text-sm font-black text-pink-600 focus:outline-none focus:border-pink-200 focus:bg-white transition-all shadow-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="group">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">สต็อก</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                                    <input
                                        type="number"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-purple-200 focus:bg-white transition-all"
                                        placeholder="1"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-span-2 md:col-span-3 group">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">รายละเอียด / ตำหนิ</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                    <FileText size={16} className="absolute left-4 top-3 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:border-purple-200 focus:bg-white transition-all min-h-[60px] max-h-[80px] resize-none leading-relaxed"
                                        placeholder="รายละเอียดเพิ่มเติม หรือตำหนิของหนังสือ..."
                                    />
                                </div>
                            </div>

                            {/* Image URL & Preview */}
                            <div className="col-span-2 md:col-span-3">
                                <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-purple-600 transition-colors">รูปภาพประกอบ</label>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 group">
                                        <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.005]">
                                            <Image size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={editForm.images?.[0] || ''}
                                                onChange={(e) => setEditForm({ ...editForm, images: [e.target.value, ...(editForm.images?.slice(1) || [])] })}
                                                className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-purple-50 rounded-xl text-xs font-medium text-gray-500 focus:outline-none focus:border-purple-200 focus:bg-white"
                                                placeholder="ชื่อไฟล์ หรือ URL รูปภาพ"
                                            />
                                        </div>
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold rounded-xl text-xs transition-all flex items-center gap-2 border-2 border-purple-100"
                                    >
                                        <Upload size={14} />
                                        <span>อัปโหลดรูป</span>
                                    </button>

                                    {editForm.images?.[0] && (
                                        <div className="p-1 bg-white rounded-lg border border-purple-50 shadow-sm shrink-0">
                                            <img
                                                src={editForm.images[0].startsWith('data:') ? editForm.images[0] : editForm.images[0]}
                                                alt="Preview"
                                                className="h-10 w-auto rounded object-contain"
                                            />
                                        </div>
                                    )}
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
                                className="flex-[2] py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black rounded-xl text-sm shadow-lg shadow-purple-100 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 group"
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
